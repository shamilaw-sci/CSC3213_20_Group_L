import enum
from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class PrescriptionStatus(str, enum.Enum):
    PENDING = "PENDING"
    DISPENSED = "DISPENSED"
    CANCELLED = "CANCELLED"

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), unique=True, index=True, nullable=False) # e.g. "Paracetamol 500mg", "Cetirizine 10mg"
    generic_name = Column(String(150), nullable=True) # e.g. "Paracetamol"
    category = Column(String(100), nullable=True) # Antibiotics, Analgesic, Antihistamine, Antacid, Vitamin
    dosage_form = Column(String(50), default="Tablet") # Tablet, Capsule, Syrup, Ointment, Injection, Inhaler
    strength = Column(String(50), nullable=True) # 500mg, 10mg, 250mg/5ml
    
    # Inventory Tracking
    stock_quantity = Column(Integer, default=0, nullable=False)
    unit = Column(String(20), default="tabs") # tabs, bottles, tubes, vials
    min_stock_alert = Column(Integer, default=50, nullable=False) # Threshold for Low Stock Warning
    batch_number = Column(String(50), nullable=True)
    expiry_date = Column(Date, nullable=True)
    supplier = Column(String(150), nullable=True) # MSD, SPC, Local
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Helper property
    @property
    def is_low_stock(self) -> bool:
        return self.stock_quantity <= self.min_stock_alert

class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, index=True)
    
    consultation_id = Column(Integer, ForeignKey("consultations.id"), nullable=False, unique=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    pharmacist_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    status = Column(String(30), default=PrescriptionStatus.PENDING.value, nullable=False)
    special_instructions = Column(Text, nullable=True) # e.g. "Take after meals", "Drink plenty of water"
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    dispensed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    consultation = relationship("Consultation", back_populates="prescription")
    patient = relationship("Patient")
    doctor = relationship("User", foreign_keys=[doctor_id])
    pharmacist = relationship("User", foreign_keys=[pharmacist_id])
    items = relationship("PrescriptionItem", back_populates="prescription", cascade="all, delete-orphan")

class PrescriptionItem(Base):
    __tablename__ = "prescription_items"

    id = Column(Integer, primary_key=True, index=True)
    prescription_id = Column(Integer, ForeignKey("prescriptions.id"), nullable=False)
    medicine_id = Column(Integer, ForeignKey("medicines.id"), nullable=False)
    
    medicine_name = Column(String(150), nullable=False) # Snapshot name
    dosage = Column(String(50), nullable=False) # e.g. "2 tabs", "1 tsp", "1 puff"
    frequency = Column(String(50), nullable=False) # e.g. "tds (3 times a day)", "nocte (at night)", "bd (twice a day)", "prn (as needed)"
    duration = Column(String(50), nullable=False) # e.g. "3 days", "5 days", "1 week"
    quantity_prescribed = Column(Integer, nullable=False) # Total quantity to dispense e.g. 18 tabs
    instructions = Column(String(100), nullable=True) # "After meals", "Before meals"
    
    is_dispensed = Column(Boolean, default=False)

    # Relationships
    prescription = relationship("Prescription", back_populates="items")
    medicine = relationship("Medicine")
