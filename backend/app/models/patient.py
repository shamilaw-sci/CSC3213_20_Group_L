import enum
from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class PatientType(str, enum.Enum):
    STUDENT = "student"
    STAFF = "staff"

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    patient_type = Column(String(20), default=PatientType.STUDENT.value, nullable=False)
    
    # Identifier (Student Reg No e.g. S/22/535 or Staff ID / NIC)
    reg_no = Column(String(50), unique=True, index=True, nullable=False)
    file_no = Column(String(50), nullable=True) # Physical Medical file reference if any
    
    name = Column(String(200), nullable=False)
    title = Column(String(20), nullable=True) # Mr, Miss, Mrs, Rev, Dr
    gender = Column(String(10), nullable=False) # M, F
    age = Column(Integer, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    
    # Campus Details
    faculty = Column(String(100), nullable=True) # Science, Engineering, Arts, Agriculture, etc.
    hall_department = Column(String(100), nullable=True) # Sangamitta, Hilda, Ramanathan, NRS (Non-resident), Electrical, etc.
    academic_year = Column(String(20), nullable=True) # e.g. 1st Year, 2nd Year, 2022/2023
    
    # Contact Info
    phone_personal = Column(String(30), nullable=True)
    phone_home = Column(String(30), nullable=True)
    nic = Column(String(30), nullable=True)
    home_address = Column(Text, nullable=True)
    emergency_contact = Column(String(200), nullable=True)
    
    # Clinical baseline & alerts
    blood_group = Column(String(10), nullable=True) # A+, B+, O+, AB+, etc.
    allergies = Column(Text, nullable=True) # Drug allergies e.g. Penicillin, Sulfa
    chronic_conditions = Column(Text, nullable=True) # Asthma, Diabetes, Hypertension
    dietary_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    opd_visits = relationship("OPDVisit", back_populates="patient", cascade="all, delete-orphan")
    consultations = relationship("Consultation", back_populates="patient", cascade="all, delete-orphan")
