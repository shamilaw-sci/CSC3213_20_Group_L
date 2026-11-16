from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from app.database import get_db
from app.models.opd import OPDVisit, QueueStatus, VisitType
from app.models.consultation import Consultation
from app.models.pharmacy import Medicine, Prescription, PrescriptionStatus
from app.models.patient import Patient
from app.models.user import User
from app.schemas.analytics import DailyStatsResponse, DiagnosisStat, FacultyStat
from app.auth_utils import get_current_user

router = APIRouter(prefix="/api/analytics", tags=["Analytics & Reports"])

@router.get("/daily-summary", response_model=DailyStatsResponse)
def get_daily_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    
    total_today = db.query(OPDVisit).filter(OPDVisit.visit_date == today).count()
    waiting_today = db.query(OPDVisit).filter(
        OPDVisit.visit_date == today,
        OPDVisit.status.in_([QueueStatus.WAITING.value, QueueStatus.IN_CONSULTATION.value, QueueStatus.PHARMACY_PENDING.value])
    ).count()
    completed_today = db.query(OPDVisit).filter(
        OPDVisit.visit_date == today,
        OPDVisit.status == QueueStatus.COMPLETED.value
    ).count()
    
    prescriptions_dispensed_today = db.query(Prescription).filter(
        func.date(Prescription.dispensed_at) == today,
        Prescription.status == PrescriptionStatus.DISPENSED.value
    ).count()
    
    low_stock_medicines_count = db.query(Medicine).filter(
        Medicine.is_active == True,
        Medicine.stock_quantity <= Medicine.min_stock_alert
    ).count()
    
    first_visits = db.query(OPDVisit).filter(
        OPDVisit.visit_date == today,
        OPDVisit.visit_type == VisitType.FIRST.value
    ).count()
    
    subs_visits = db.query(OPDVisit).filter(
        OPDVisit.visit_date == today,
        OPDVisit.visit_type == VisitType.SUBS.value
    ).count()
    
    # Top diagnoses
    diagnoses_raw = db.query(
        Consultation.diagnosis,
        func.count(Consultation.id).label("count")
    ).group_by(Consultation.diagnosis).order_by(func.count(Consultation.id).desc()).limit(6).all()
    
    top_diagnoses = [DiagnosisStat(diagnosis=d[0], count=d[1]) for d in diagnoses_raw if d[0]]
    
    # Faculty distribution
    faculties_raw = db.query(
        Patient.faculty,
        func.count(Patient.id).label("count")
    ).filter(Patient.faculty != None).group_by(Patient.faculty).order_by(func.count(Patient.id).desc()).limit(8).all()
    
    faculty_dist = [FacultyStat(faculty=f[0], count=f[1]) for f in faculties_raw if f[0]]
    
    return DailyStatsResponse(
        total_today=total_today,
        waiting_today=waiting_today,
        completed_today=completed_today,
        prescriptions_dispensed_today=prescriptions_dispensed_today,
        low_stock_medicines_count=low_stock_medicines_count,
        first_visits_count=first_visits,
        subs_visits_count=subs_visits,
        top_diagnoses=top_diagnoses,
        faculty_distribution=faculty_dist
    )
