from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Literal
from datetime import datetime
import uuid

class UserPreferences(BaseModel):
    theme: str = "light"
    notifications: bool = True
    email_frequency: Literal["daily", "weekly", "none"] = "daily"

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    display_name: str
    profile_image: Optional[str] = None
    subscription_tier: Literal["free", "individual", "organization"] = "free"
    subscription_status: Literal["active", "expired", "trial"] = "active"
    subscription_expiry: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    preferences: UserPreferences = Field(default_factory=UserPreferences)

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    display_name: str
    profile_image: Optional[str] = None

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    profile_image: Optional[str] = None
    preferences: Optional[UserPreferences] = None

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    display_name: str
    profile_image: Optional[str] = None
    subscription_tier: str
    subscription_status: str
    subscription_expiry: Optional[datetime] = None
    created_at: datetime
    last_login: Optional[datetime] = None
    preferences: UserPreferences

