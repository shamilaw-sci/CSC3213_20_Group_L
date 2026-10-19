from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from app.schemas.pharmacy import PrescriptionItemCreate, PrescriptionResponse

class ConsultationCreate(BaseModel):
    opd_visit_id: int
    symptoms: Optional[str] = None
    examination_findings: Optional[str] = None
    diagnosis: str
    clinical_notes: Optional[str] = None
    
    # In-Patient / Ward Referral
    is_admitted: bool = False
    admitted_ward: Optional[str] = None
    admission_date: Optional[date] = None
    discharge_date: Optional[date] = None
    
    # Medical Leave / Excuse Endorsement
    medical_leave_granted: bool = False
    leave_start_date: Optional[date] = None
    leave_end_date: Optional[date] = None
    leave_days: Optional[int] = None
    leave_reason: Optional[str] = None
    
    # Digital Treatment Sheet / Prescribed medicines
    prescription_items: Optional[List[PrescriptionItemCreate]] = []
    special_instructions: Optional[str] = None

class ConsultationResponse(BaseModel):
    id: int
    opd_visit_id: int
    patient_id: int
    doctor_id: int
    symptoms: Optional[str] = None
    examination_findings: Optional[str] = None
    diagnosis: str
    clinical_notes: Optional[str] = None
    
    is_admitted: bool
    admitted_ward: Optional[str] = None
    admission_date: Optional[date] = None
    discharge_date: Optional[date] = None
    
    medical_leave_granted: bool
    leave_start_date: Optional[date] = None
    leave_end_date: Optional[date] = None
    leave_days: Optional[int] = None
    leave_reason: Optional[str] = None
    
    created_at: datetime
    doctor_name: Optional[str] = None
    prescription: Optional[PrescriptionResponse] = None

    class Config:
        from_attributes = True
