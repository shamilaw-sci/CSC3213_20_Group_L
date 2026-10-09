import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
from app.database import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    DOCTOR = "doctor"
    PHARMACIST = "pharmacist"
    RECEPTION = "reception"
    STUDENT = "student"
    STAFF_PATIENT = "staff_patient"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False) # e.g. doctor1, admin, or S/22/535
    email = Column(String(150), unique=True, nullable=True)
    full_name = Column(String(200), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default=UserRole.STUDENT.value)
    is_active = Column(Boolean, default=True)
    phone = Column(String(20), nullable=True)
    designation = Column(String(100), nullable=True) # e.g. "Senior Medical Officer", "Chief Pharmacist"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
