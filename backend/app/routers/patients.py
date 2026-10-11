from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.database import get_db
from app.models.patient import Patient, PatientType
from app.models.user import User, UserRole
from app.schemas.patient import PatientCreate, PatientUpdate, PatientResponse
from app.auth_utils import get_current_user, require_roles, get_password_hash

router = APIRouter(prefix="/api/patients", tags=["Patients Directory"])

@router.get("/", response_model=List[PatientResponse])
def list_patients(
    search: Optional[str] = None,
    faculty: Optional[str] = None,
    patient_type: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Patient)
    
    if patient_type:
        query = query.filter(Patient.patient_type == patient_type)
        
    if faculty:
        query = query.filter(Patient.faculty == faculty)
        
    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Patient.reg_no.ilike(search_fmt),
                Patient.name.ilike(search_fmt),
                Patient.nic.ilike(search_fmt),
                Patient.hall_department.ilike(search_fmt)
            )
        )
        
    return query.order_by(Patient.name.asc()).offset(offset).limit(limit).all()

@router.post("/register", response_model=PatientResponse)
def register_patient_from_paper(
    patient_in: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN.value, UserRole.RECEPTION.value, UserRole.DOCTOR.value]))
):
    """
    Manual Data Entry interface to convert incoming physical paper medical registration forms
    into digital records.
    """
    clean_reg_no = patient_in.reg_no.strip()
    existing = db.query(Patient).filter(Patient.reg_no.ilike(clean_reg_no)).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Patient with Registration No '{clean_reg_no}' already exists in system"
        )
        
    new_patient = Patient(
        patient_type=patient_in.patient_type,
        reg_no=clean_reg_no,
        file_no=patient_in.file_no.strip() if patient_in.file_no else None,
        name=patient_in.name.strip(),
        title=patient_in.title,
        gender=patient_in.gender,
        age=patient_in.age,
        date_of_birth=patient_in.date_of_birth,
        faculty=patient_in.faculty,
        hall_department=patient_in.hall_department,
        academic_year=patient_in.academic_year,
        phone_personal=patient_in.phone_personal,
        phone_home=patient_in.phone_home,
        nic=patient_in.nic,
        home_address=patient_in.home_address,
        emergency_contact=patient_in.emergency_contact,
        blood_group=patient_in.blood_group,
        allergies=patient_in.allergies,
        chronic_conditions=patient_in.chronic_conditions,
        dietary_notes=patient_in.dietary_notes
    )
    db.add(new_patient)
    
    # Also create a default Student portal user account if it is a student
    user_existing = db.query(User).filter(User.username.ilike(clean_reg_no)).first()
    if not user_existing:
        new_user = User(
            username=clean_reg_no,
            full_name=patient_in.name.strip(),
            hashed_password=get_password_hash("password123"), # Default password for student portal
            role=UserRole.STUDENT.value if patient_in.patient_type == "student" else UserRole.STAFF_PATIENT.value,
            phone=patient_in.phone_personal
        )
        db.add(new_user)
        
    db.commit()
    db.refresh(new_patient)
    return new_patient

@router.get("/{reg_no:path}", response_model=PatientResponse)
def get_patient_by_reg_no(
    reg_no: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.reg_no.ilike(reg_no.strip())).first()
    if not patient:
        raise HTTPException(status_code=404, detail=f"Patient with Reg No '{reg_no}' not found")
    return patient

@router.put("/{reg_no:path}", response_model=PatientResponse)
def update_patient_profile(
    reg_no: str,
    patient_update: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN.value, UserRole.RECEPTION.value, UserRole.DOCTOR.value]))
):
    patient = db.query(Patient).filter(Patient.reg_no.ilike(reg_no.strip())).first()
    if not patient:
        raise HTTPException(status_code=404, detail=f"Patient with Reg No '{reg_no}' not found")
        
    update_data = patient_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)
        
    db.commit()
    db.refresh(patient)
    return patient
