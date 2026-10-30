from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import List, Optional
from app.database import get_db
from app.models.pharmacy import Medicine, Prescription, PrescriptionItem, PrescriptionStatus
from app.models.patient import Patient
from app.models.user import User, UserRole
from app.models.opd import OPDVisit, QueueStatus
from app.schemas.pharmacy import MedicineCreate, MedicineUpdate, MedicineResponse, DispenseRequest
from app.auth_utils import get_current_user, require_roles

router = APIRouter(prefix="/api/pharmacy", tags=["Pharmacy & Medicine Inventory"])

@router.get("/medicines", response_model=List[MedicineResponse])
def list_medicines(
    search: Optional[str] = None,
    category: Optional[str] = None,
    low_stock_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Medicine).filter(Medicine.is_active == True)
    
    if category:
        query = query.filter(Medicine.category == category)
        
    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            (Medicine.name.ilike(search_fmt)) | 
            (Medicine.generic_name.ilike(search_fmt))
        )
        
    medicines = query.order_by(Medicine.name.asc()).all()
    
    if low_stock_only:
        medicines = [m for m in medicines if m.is_low_stock]
        
    return medicines

@router.post("/medicines", response_model=MedicineResponse)
def add_new_medicine(
    medicine_in: MedicineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.PHARMACIST.value, UserRole.ADMIN.value]))
):
    existing = db.query(Medicine).filter(Medicine.name.ilike(medicine_in.name.strip())).first()
    if existing:
        raise HTTPException(status_code=400, detail="Medicine with this name already exists")
        
    new_med = Medicine(
        name=medicine_in.name.strip(),
        generic_name=medicine_in.generic_name.strip() if medicine_in.generic_name else None,
        category=medicine_in.category,
        dosage_form=medicine_in.dosage_form,
        strength=medicine_in.strength,
        stock_quantity=medicine_in.stock_quantity,
        unit=medicine_in.unit,
        min_stock_alert=medicine_in.min_stock_alert,
        batch_number=medicine_in.batch_number,
        expiry_date=medicine_in.expiry_date,
        supplier=medicine_in.supplier
    )
    db.add(new_med)
    db.commit()
    db.refresh(new_med)
    return new_med

@router.put("/medicines/{medicine_id}", response_model=MedicineResponse)
def update_medicine_inventory(
    medicine_id: int,
    medicine_update: MedicineUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.PHARMACIST.value, UserRole.ADMIN.value]))
):
    med = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found")
        
    update_data = medicine_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(med, field, value)
        
    db.commit()
    db.refresh(med)
    return med

@router.get("/prescriptions/pending")
def list_pending_prescriptions(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.PHARMACIST.value, UserRole.ADMIN.value]))
):
    """Fetches live incoming prescriptions waiting to be dispensed."""
    prescriptions = db.query(Prescription).filter(
        Prescription.status == PrescriptionStatus.PENDING.value
    ).order_by(Prescription.created_at.asc()).all()
    
    results = []
    for p in prescriptions:
        patient = db.query(Patient).filter(Patient.id == p.patient_id).first()
        doctor = db.query(User).filter(User.id == p.doctor_id).first()
        items = db.query(PrescriptionItem).filter(PrescriptionItem.prescription_id == p.id).all()
        
        items_data = []
        for i in items:
            med = db.query(Medicine).filter(Medicine.id == i.medicine_id).first()
            items_data.append({
                "item_id": i.id,
                "medicine_id": i.medicine_id,
                "medicine_name": i.medicine_name,
                "current_stock": med.stock_quantity if med else 0,
                "unit": med.unit if med else "tabs",
                "dosage": i.dosage,
                "frequency": i.frequency,
                "duration": i.duration,
                "quantity_prescribed": i.quantity_prescribed,
                "instructions": i.instructions,
                "is_low_stock": med.is_low_stock if med else False
            })
            
        results.append({
            "prescription_id": p.id,
            "consultation_id": p.consultation_id,
            "patient_id": patient.id if patient else None,
            "patient_name": patient.name if patient else "Unknown",
            "patient_reg_no": patient.reg_no if patient else "",
            "patient_age": patient.age if patient else None,
            "patient_allergies": patient.allergies if patient else None,
            "doctor_name": doctor.full_name if doctor else "Doctor",
            "special_instructions": p.special_instructions,
            "created_at": p.created_at.strftime("%H:%M"),
            "items": items_data
        })
    return results

@router.post("/dispense")
def dispense_prescription(
    request: DispenseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.PHARMACIST.value, UserRole.ADMIN.value]))
):
    """
    Dispenses prescribed medicines, decrements stock quantities, and updates patient visit status.
    """
    prescription = db.query(Prescription).filter(Prescription.id == request.prescription_id).first()
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
        
    if prescription.status == PrescriptionStatus.DISPENSED.value:
        raise HTTPException(status_code=400, detail="Prescription has already been dispensed")
        
    items = db.query(PrescriptionItem).filter(PrescriptionItem.prescription_id == prescription.id).all()
    
    # Decrement stock for each item
    for item in items:
        med = db.query(Medicine).filter(Medicine.id == item.medicine_id).first()
        if med:
            med.stock_quantity = max(0, med.stock_quantity - item.quantity_prescribed)
            item.is_dispensed = True
            
    prescription.status = PrescriptionStatus.DISPENSED.value
    prescription.pharmacist_id = current_user.id
    prescription.dispensed_at = datetime.now(timezone.utc)
    
    # Update associated OPD visit status to COMPLETED
    if prescription.consultation and prescription.consultation.opd_visit:
        prescription.consultation.opd_visit.status = QueueStatus.COMPLETED.value
        prescription.consultation.opd_visit.completed_at = datetime.now(timezone.utc)
        
    db.commit()
    return {"message": "Prescription successfully dispensed and medicine inventory updated"}

@router.get("/low-stock-alerts")
def get_low_stock_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Returns all medicines that have fallen below minimum stock threshold."""
    medicines = db.query(Medicine).filter(
        Medicine.is_active == True,
        Medicine.stock_quantity <= Medicine.min_stock_alert
    ).order_by(Medicine.stock_quantity.asc()).all()
    
    return [
        {
            "id": m.id,
            "name": m.name,
            "category": m.category,
            "stock_quantity": m.stock_quantity,
            "unit": m.unit,
            "min_stock_alert": m.min_stock_alert,
            "dosage_form": m.dosage_form,
            "expiry_date": m.expiry_date
        }
        for m in medicines
    ]
