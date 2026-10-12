from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class PatientBase(BaseModel):
    patient_type: str = "student" # student or staff
    reg_no: str
    file_no: Optional[str] = None
    name: str
    title: Optional[str] = "Mr"
    gender: str = "M"
    age: Optional[int] = None
    date_of_birth: Optional[date] = None
    faculty: Optional[str] = None
    hall_department: Optional[str] = None
    academic_year: Optional[str] = None
    phone_personal: Optional[str] = None
    phone_home: Optional[str] = None
    nic: Optional[str] = None
    home_address: Optional[str] = None
    emergency_contact: Optional[str] = None
    blood_group: Optional[str] = None
    allergies: Optional[str] = None
    chronic_conditions: Optional[str] = None
    dietary_notes: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    faculty: Optional[str] = None
    hall_department: Optional[str] = None
    academic_year: Optional[str] = None
    phone_personal: Optional[str] = None
    phone_home: Optional[str] = None
    nic: Optional[str] = None
    home_address: Optional[str] = None
    emergency_contact: Optional[str] = None
    blood_group: Optional[str] = None
    allergies: Optional[str] = None
    chronic_conditions: Optional[str] = None
    dietary_notes: Optional[str] = None

class PatientResponse(PatientBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
