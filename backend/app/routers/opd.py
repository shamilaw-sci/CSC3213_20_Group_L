from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, datetime, timezone
from typing import List, Optional
from app.database import get_db
from app.models.opd import OPDVisit, VisitType, QueueStatus
from app.models.patient import Patient
from app.models.user import User, UserRole
from app.schemas.opd import IssueTokenRequest, OPDVisitResponse, QueueStatusUpdate
from app.auth_utils import get_current_user, require_roles

router = APIRouter(prefix="/api/opd", tags=["OPD & Patients Register"])

@router.post("/issue-token", response_model=OPDVisitResponse)
def issue_daily_token(
    request: IssueTokenRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN.value, UserRole.RECEPTION.value, UserRole.DOCTOR.value]))
):
    """
    Issues daily OPD token number and creates an entry in the Daily Patients' Register.
    """
    clean_reg_no = request.reg_no.strip()
    patient = db.query(Patient).filter(Patient.reg_no.ilike(clean_reg_no)).first()
    if not patient:
        raise HTTPException(
            status_code=404,
            detail=f"Patient '{clean_reg_no}' not found. Please register the patient in directory first."
        )

    today = date.today()
    
    # Calculate next daily token number for today
    max_token = db.query(func.max(OPDVisit.token_number)).filter(
        OPDVisit.visit_date == today
    ).scalar()
    
    next_token = (max_token or 0) + 1
    
    # Auto-detect if this is first visit or subsequent
    past_visits_count = db.query(OPDVisit).filter(OPDVisit.patient_id == patient.id).count()
    determined_visit_type = VisitType.FIRST.value if past_visits_count == 0 else (request.visit_type or VisitType.SUBS.value)

    new_visit = OPDVisit(
        token_number=next_token,
        visit_date=today,
        patient_id=patient.id,
        patient_reg_no=patient.reg_no,
        patient_name=patient.name,
        patient_age=patient.age,
        patient_sex=patient.gender,
        hall_department=patient.hall_department or patient.faculty,
        visit_type=determined_visit_type,
        status=QueueStatus.WAITING.value,
        priority=request.priority,
        chief_complaint=request.chief_complaint
    )
    
    db.add(new_visit)
    db.commit()
    db.refresh(new_visit)
    return new_visit

@router.get("/queue", response_model=List[OPDVisitResponse])
def get_current_opd_queue(
    db: Session = Depends(get_db)
):
    """
    Returns today's active OPD queue for waiting room monitors and clinicians.
    """
    today = date.today()
    return db.query(OPDVisit).filter(
        OPDVisit.visit_date == today
    ).order_by(
        OPDVisit.token_number.asc()
    ).all()

@router.get("/patients-register", response_model=List[OPDVisitResponse])
def get_daily_patients_register(
    target_date: Optional[date] = None,
    limit: int = 200,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns the exact digital counterpart of the physical UNIVERSITY OF PERADENIYA - PATIENTS' REGISTER.
    """
    query_date = target_date or date.today()
    return db.query(OPDVisit).filter(
        OPDVisit.visit_date == query_date
    ).order_by(
        OPDVisit.token_number.asc()
    ).offset(offset).limit(limit).all()

@router.put("/status/{visit_id}", response_model=OPDVisitResponse)
def update_opd_visit_status(
    visit_id: int,
    status_update: QueueStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN.value, UserRole.RECEPTION.value, UserRole.DOCTOR.value, UserRole.PHARMACIST.value]))
):
    visit = db.query(OPDVisit).filter(OPDVisit.id == visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="OPD Visit not found")
        
    visit.status = status_update.status
    if status_update.status == QueueStatus.COMPLETED.value:
        visit.completed_at = datetime.now(timezone.utc)
        
    db.commit()
    db.refresh(visit)
    return visit
