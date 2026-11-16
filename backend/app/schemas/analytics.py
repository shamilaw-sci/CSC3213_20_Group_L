from pydantic import BaseModel
from typing import List, Dict, Any

class DiagnosisStat(BaseModel):
    diagnosis: str
    count: int

class FacultyStat(BaseModel):
    faculty: str
    count: int

class DailyStatsResponse(BaseModel):
    total_today: int
    waiting_today: int
    completed_today: int
    prescriptions_dispensed_today: int
    low_stock_medicines_count: int
    first_visits_count: int
    subs_visits_count: int
    top_diagnoses: List[DiagnosisStat]
    faculty_distribution: List[FacultyStat]
