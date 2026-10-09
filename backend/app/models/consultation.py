from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(Integer, primary_key=True, index=True)
    
    opd_visit_id = Column(Integer, ForeignKey("opd_visits.id"), nullable=False, unique=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Clinical details
    symptoms = Column(Text, nullable=True) # e.g. Fever x 3 days, cough, throat pain
    examination_findings = Column(Text, nullable=True) # BP, Pulse, Chest clear, etc.
    diagnosis = Column(String(255), nullable=False) # Gastritis, URTI, Chicken Pox, Migraine
    clinical_notes = Column(Text, nullable=True)
    
    # In-Patient / Ward Referral (matching paper form)
    is_admitted = Column(Boolean, default=False)
    admitted_ward = Column(String(100), nullable=True) # e.g. "Health Centre Ward", "Kandy Gen Hosp Ward 7"
    admission_date = Column(Date, nullable=True)
    discharge_date = Column(Date, nullable=True)
    
    # Medical Leave / Certificate Endorsement (Internal tracking without client PDF clutter)
    medical_leave_granted = Column(Boolean, default=False)
    leave_start_date = Column(Date, nullable=True)
    leave_end_date = Column(Date, nullable=True)
    leave_days = Column(Integer, nullable=True)
    leave_reason = Column(String(255), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    opd_visit = relationship("OPDVisit", back_populates="consultation")
    patient = relationship("Patient", back_populates="consultations")
    doctor = relationship("User")
    prescription = relationship("Prescription", back_populates="consultation", uselist=False)
