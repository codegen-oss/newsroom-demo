from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    display_name: str
    subscription_tier: str = "free"

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    subscription_tier: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None

class UserResponse(UserBase):
    id: str
    created_at: datetime
    preferences: Dict[str, Any] = {}

    class Config:
        orm_mode = True

