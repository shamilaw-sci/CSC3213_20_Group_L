from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class IssueTokenRequest(BaseModel):
    reg_no: str
    visit_type: str = "FIRST" # FIRST or SUBS
    priority: str = "NORMAL" # NORMAL, URGENT, EMERGENCY
    chief_complaint: Optional[str] = None

class OPDVisitResponse(BaseModel):
    id: int
    token_number: int
    visit_date: date
    patient_id: int
    patient_reg_no: str
    patient_name: str
    patient_age: Optional[int] = None
    patient_sex: Optional[str] = None
    hall_department: Optional[str] = None
    visit_type: str
    status: str
    priority: str
    chief_complaint: Optional[str] = None
    diagnosis_summary: Optional[str] = None
    remarks: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class QueueStatusUpdate(BaseModel):
    status: str # WAITING, IN_CONSULTATION, PHARMACY_PENDING, COMPLETED, CANCELLED
