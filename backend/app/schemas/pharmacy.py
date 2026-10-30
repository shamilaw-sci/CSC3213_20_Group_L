from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

class MedicineBase(BaseModel):
    name: str
    generic_name: Optional[str] = None
    category: Optional[str] = "General"
    dosage_form: str = "Tablet"
    strength: Optional[str] = None
    stock_quantity: int = 0
    unit: str = "tabs"
    min_stock_alert: int = 50
    batch_number: Optional[str] = None
    expiry_date: Optional[date] = None
    supplier: Optional[str] = None

class MedicineCreate(MedicineBase):
    pass

class MedicineUpdate(BaseModel):
    name: Optional[str] = None
    generic_name: Optional[str] = None
    category: Optional[str] = None
    dosage_form: Optional[str] = None
    strength: Optional[str] = None
    stock_quantity: Optional[int] = None
    unit: Optional[str] = None
    min_stock_alert: Optional[int] = None
    batch_number: Optional[str] = None
    expiry_date: Optional[date] = None
    supplier: Optional[str] = None

class MedicineResponse(MedicineBase):
    id: int
    is_active: bool
    is_low_stock: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PrescriptionItemBase(BaseModel):
    medicine_id: int
    dosage: str # e.g. "2 tabs"
    frequency: str # e.g. "tds (3 times a day)"
    duration: str # e.g. "3 days"
    quantity_prescribed: int
    instructions: Optional[str] = "After meals"

class PrescriptionItemCreate(PrescriptionItemBase):
    pass

class PrescriptionItemResponse(PrescriptionItemBase):
    id: int
    medicine_name: str
    is_dispensed: bool

    class Config:
        from_attributes = True

class PrescriptionResponse(BaseModel):
    id: int
    consultation_id: int
    patient_id: int
    doctor_id: int
    pharmacist_id: Optional[int] = None
    status: str
    special_instructions: Optional[str] = None
    created_at: datetime
    dispensed_at: Optional[datetime] = None
    items: List[PrescriptionItemResponse] = []
    
    # Extra info for UI convenience
    patient_name: Optional[str] = None
    patient_reg_no: Optional[str] = None
    doctor_name: Optional[str] = None

    class Config:
        from_attributes = True

class DispenseRequest(BaseModel):
    prescription_id: int
    remarks: Optional[str] = None
