import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "University of Peradeniya - Health Centre Management System"
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:chamo21@localhost:5432/university_medical_center"
    )
    SECRET_KEY: str = os.getenv("SECRET_KEY", "uop_medical_secret_key_2026_super_secure_hash")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    class Config:
        case_sensitive = True

settings = Settings()
