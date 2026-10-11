from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.schemas.auth import LoginRequest, Token, UserCreate, UserResponse
from app.auth_utils import verify_password, get_password_hash, create_access_token, get_current_user, require_roles

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # Look up user by username (case insensitive) or email
    user = db.query(User).filter(
        (User.username.ilike(request.username.strip())) | 
        (User.email.ilike(request.username.strip()))
    ).first()

    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username/Registration No or password"
        )
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive. Please contact Medical Center Admin."
        )

    access_token = create_access_token(
        data={"sub": user.username, "role": user.role, "user_id": user.id, "name": user.full_name}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "username": user.username,
        "full_name": user.full_name,
        "user_id": user.id
    }

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/register-user", response_model=UserResponse)
def create_staff_user(
    user_in: UserCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN.value]))
):
    existing = db.query(User).filter(User.username == user_in.username.strip()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    new_user = User(
        username=user_in.username.strip(),
        full_name=user_in.full_name.strip(),
        email=user_in.email.strip() if user_in.email else None,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role,
        phone=user_in.phone,
        designation=user_in.designation
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/demo-accounts")
def get_demo_accounts():
    """Provides demo credentials for presentations and quick evaluation."""
    return [
        {"role": "doctor", "label": "Dr. Dissanayake (Medical Officer)", "username": "doctor1", "password": "password123", "portal": "staff"},
        {"role": "pharmacist", "label": "Mr. Bandara (Chief Pharmacist)", "username": "pharmacist1", "password": "password123", "portal": "staff"},
        {"role": "reception", "label": "Staff Nurse / Reception", "username": "reception1", "password": "password123", "portal": "staff"},
        {"role": "admin", "label": "Health Centre Administrator", "username": "admin", "password": "adminpassword", "portal": "staff"},
        {"role": "student", "label": "Miss D.S. Rajakaruna (Faculty of Science)", "username": "S/22/535", "password": "password123", "portal": "student"},
    ]
