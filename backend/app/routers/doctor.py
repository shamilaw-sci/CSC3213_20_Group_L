from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date
from typing import List, Optional
from app.database import get_db
from app.models.opd import OPDVisit, QueueStatus
from app.models.patient import Patient
from app.models.consultation import Consultation
from app.models.pharmacy import Medicine, Prescription, PrescriptionItem, PrescriptionStatus
from app.models.user import User, UserRole
from app.schemas.doctor import ConsultationCreate, ConsultationResponse
from app.schemas.pharmacy import PrescriptionResponse
from app.auth_utils import get_current_user, require_roles

router = APIRouter(prefix="/api/doctor", tags=["Doctor Consultation & Treatment Sheet"])

@router.get("/queue", response_model=List[dict])
def get_doctor_waiting_queue(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.DOCTOR.value, UserRole.ADMIN.value]))
):
    """Returns today's patients waiting for consultation or currently in consultation."""
    today = date.today()
    visits = db.query(OPDVisit).filter(
        OPDVisit.visit_date == today,
        OPDVisit.status.in_([QueueStatus.WAITING.value, QueueStatus.IN_CONSULTATION.value])
    ).order_by(OPDVisit.token_number.asc()).all()
    
    results = []
    for v in visits:
        patient = db.query(Patient).filter(Patient.id == v.patient_id).first()
        results.append({
            "visit_id": v.id,
            "token_number": v.token_number,
            "status": v.status,
            "priority": v.priority,
            "chief_complaint": v.chief_complaint,
            "patient_id": patient.id,
            "patient_reg_no": patient.reg_no,
            "patient_name": patient.name,
            "patient_age": patient.age,
            "patient_gender": patient.gender,
            "faculty": patient.faculty,
            "hall_department": patient.hall_department,
            "blood_group": patient.blood_group,
            "allergies": patient.allergies,
            "chronic_conditions": patient.chronic_conditions,
            "visit_type": v.visit_type
        })
    return results

@router.get("/patient-history/{patient_id}")
def get_patient_clinical_history(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetches full past consultations, diagnoses, prescriptions, and medical leaves for a patient."""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
        
    consultations = db.query(Consultation).filter(
        Consultation.patient_id == patient_id
    ).order_by(Consultation.created_at.desc()).all()
    
    history_items = []
    for c in consultations:
        doctor = db.query(User).filter(User.id == c.doctor_id).first()
        prescription = db.query(Prescription).filter(Prescription.consultation_id == c.id).first()
        prescription_data = None
        if prescription:
            items = db.query(PrescriptionItem).filter(PrescriptionItem.prescription_id == prescription.id).all()
            prescription_data = {
                "id": prescription.id,
                "status": prescription.status,
                "special_instructions": prescription.special_instructions,
                "items": [
                    {
                        "medicine_name": i.medicine_name,
                        "dosage": i.dosage,
                        "frequency": i.frequency,
                        "duration": i.duration,
                        "quantity_prescribed": i.quantity_prescribed,
                        "instructions": i.instructions
                    }
                    for i in items
                ]
            }
            
        history_items.append({
            "consultation_id": c.id,
            "date": c.created_at.strftime("%Y-%m-%d %H:%M"),
            "doctor_name": doctor.full_name if doctor else "Medical Officer",
            "symptoms": c.symptoms,
            "examination_findings": c.examination_findings,
            "diagnosis": c.diagnosis,
            "clinical_notes": c.clinical_notes,
            "is_admitted": c.is_admitted,
            "admitted_ward": c.admitted_ward,
            "medical_leave_granted": c.medical_leave_granted,
            "leave_start_date": c.leave_start_date,
            "leave_end_date": c.leave_end_date,
            "leave_days": c.leave_days,
            "leave_reason": c.leave_reason,
            "prescription": prescription_data
        })
        
    return {
        "patient": {
            "id": patient.id,
            "reg_no": patient.reg_no,
            "name": patient.name,
            "faculty": patient.faculty,
            "hall_department": patient.hall_department,
            "gender": patient.gender,
            "age": patient.age,
            "blood_group": patient.blood_group,
            "allergies": patient.allergies,
            "chronic_conditions": patient.chronic_conditions
        },
        "history": history_items
    }

@router.post("/consult")
def record_consultation(
    consult_in: ConsultationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.DOCTOR.value, UserRole.ADMIN.value]))
):
    """
    Doctor submits consultation notes, diagnosis, optional medical leave endorsement,
    and digital Treatment Sheet (Rx) that immediately syncs to Pharmacy.
    """
    visit = db.query(OPDVisit).filter(OPDVisit.id == consult_in.opd_visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="OPD Visit not found")
        
    patient = db.query(Patient).filter(Patient.id == visit.patient_id).first()
    
    # 1. Create Consultation record
    new_consult = Consultation(
        opd_visit_id=visit.id,
        patient_id=patient.id,
        doctor_id=current_user.id,
        symptoms=consult_in.symptoms,
        examination_findings=consult_in.examination_findings,
        diagnosis=consult_in.diagnosis,
        clinical_notes=consult_in.clinical_notes,
        is_admitted=consult_in.is_admitted,
        admitted_ward=consult_in.admitted_ward if consult_in.is_admitted else None,
        admission_date=consult_in.admission_date if consult_in.is_admitted else None,
        discharge_date=consult_in.discharge_date if consult_in.is_admitted else None,
        medical_leave_granted=consult_in.medical_leave_granted,
        leave_start_date=consult_in.leave_start_date if consult_in.medical_leave_granted else None,
        leave_end_date=consult_in.leave_end_date if consult_in.medical_leave_granted else None,
        leave_days=consult_in.leave_days if consult_in.medical_leave_granted else None,
        leave_reason=consult_in.leave_reason or consult_in.diagnosis if consult_in.medical_leave_granted else None
    )
    db.add(new_consult)
    db.flush() # Get new_consult.id
    
    # 2. Update OPD Visit snapshot logbook
    visit.diagnosis_summary = consult_in.diagnosis
    remarks_items = []
    if consult_in.is_admitted:
        remarks_items.append("Admitted")
    if consult_in.medical_leave_granted:
        remarks_items.append(f"Leave {consult_in.leave_days}d")
    visit.remarks = ", ".join(remarks_items) if remarks_items else None
    
    # 3. Create digital Prescription if medicines prescribed
    has_prescriptions = consult_in.prescription_items and len(consult_in.prescription_items) > 0
    if has_prescriptions:
        new_prescription = Prescription(
            consultation_id=new_consult.id,
            patient_id=patient.id,
            doctor_id=current_user.id,
            status=PrescriptionStatus.PENDING.value,
            special_instructions=consult_in.special_instructions
        )
        db.add(new_prescription)
        db.flush()
        
        for item in consult_in.prescription_items:
            med = db.query(Medicine).filter(Medicine.id == item.medicine_id).first()
            med_name = med.name if med else "Medicine"
            new_item = PrescriptionItem(
                prescription_id=new_prescription.id,
                medicine_id=item.medicine_id,
                medicine_name=med_name,
                dosage=item.dosage,
                frequency=item.frequency,
                duration=item.duration,
                quantity_prescribed=item.quantity_prescribed,
                instructions=item.instructions
            )
            db.add(new_item)
            
        visit.status = QueueStatus.PHARMACY_PENDING.value
    else:
        visit.status = QueueStatus.COMPLETED.value
        
    db.commit()
    return {"message": "Consultation recorded successfully", "consultation_id": new_consult.id}

@router.get("/medical-leaves")
def list_medical_leaves(
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lists doctor-endorsed medical leaves for internal record keeping and verification."""
    query = db.query(Consultation).filter(Consultation.medical_leave_granted == True)
    consultations = query.order_by(Consultation.created_at.desc()).limit(100).all()
    
    results = []
    for c in consultations:
        p = db.query(Patient).filter(Patient.id == c.patient_id).first()
        doc = db.query(User).filter(User.id == c.doctor_id).first()
        
        if search:
            search_lower = search.lower()
            if search_lower not in p.name.lower() and search_lower not in p.reg_no.lower():
                continue
                
        results.append({
            "id": c.id,
            "student_reg_no": p.reg_no if p else "",
            "student_name": p.name if p else "",
            "faculty": p.faculty if p else "",
            "hall_department": p.hall_department if p else "",
            "doctor_name": doc.full_name if doc else "Medical Officer",
            "leave_start_date": c.leave_start_date,
            "leave_end_date": c.leave_end_date,
            "leave_days": c.leave_days,
            "leave_reason": c.leave_reason or c.diagnosis,
            "created_at": c.created_at.strftime("%Y-%m-%d")
        })
    return results
