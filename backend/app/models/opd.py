import enum
from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class VisitType(str, enum.Enum):
    FIRST = "FIRST"
    SUBS = "SUBS"  # Subsequent / Follow-up

class QueueStatus(str, enum.Enum):
    WAITING = "WAITING"
    IN_CONSULTATION = "IN_CONSULTATION"
    PHARMACY_PENDING = "PHARMACY_PENDING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class OPDVisit(Base):
    __tablename__ = "opd_visits"

    id = Column(Integer, primary_key=True, index=True)
    
    # Token number of the day (e.g. 1, 2, 3... 108)
    token_number = Column(Integer, nullable=False)
    visit_date = Column(Date, default=func.current_date(), nullable=False, index=True)
    
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    
    # Snapshot fields matching the physical Patients' Register logbook
    patient_reg_no = Column(String(50), nullable=False)
    patient_name = Column(String(200), nullable=False)
    patient_age = Column(Integer, nullable=True)
    patient_sex = Column(String(10), nullable=True)
    hall_department = Column(String(100), nullable=True)
    
    visit_type = Column(String(20), default=VisitType.FIRST.value, nullable=False)
    status = Column(String(30), default=QueueStatus.WAITING.value, nullable=False)
    
    # Reception/Triage notes & Priority
    priority = Column(String(20), default="NORMAL") # NORMAL, EMERGENCY, URGENT
    chief_complaint = Column(String(255), nullable=True) # Initial reason given at reception
    
    # Diagnosis summary populated after doctor consultation (matching physical register)
    diagnosis_summary = Column(String(255), nullable=True)
    remarks = Column(String(255), nullable=True) # e.g. "Admitted", "Exam mc on", "243"
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    patient = relationship("Patient", back_populates="opd_visits")
    consultation = relationship("Consultation", back_populates="opd_visit", uselist=False)
