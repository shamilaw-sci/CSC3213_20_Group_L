from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
import app.models # Register all models

# Create database tables
Base.metadata.create_all(bind=engine)

from app.routers import auth, patients, opd, doctor, pharmacy, analytics

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Automated Digital Health Centre Management System for University of Peradeniya",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In dev, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(opd.router)
app.include_router(doctor.router)
app.include_router(pharmacy.router)
app.include_router(analytics.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "docs": "/docs"
    }
