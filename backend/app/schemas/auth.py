from pydantic import BaseModel, EmailStr
from typing import Optional

class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str
    full_name: str
    user_id: int

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class UserCreate(BaseModel):
    username: str
    full_name: str
    password: str
    role: str
    email: Optional[str] = None
    phone: Optional[str] = None
    designation: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    username: str
    full_name: str
    email: Optional[str] = None
    role: str
    phone: Optional[str] = None
    designation: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True
