from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr

from app.models.enums import SubscriptionTier

# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    display_name: Optional[str] = None
    subscription_tier: Optional[SubscriptionTier] = None
    preferences: Optional[Dict[str, Any]] = None

# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: str
    display_name: str

# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None

# Properties to return via API
class UserInDBBase(UserBase):
    id: str
    email: EmailStr
    created_at: datetime
    
    class Config:
        orm_mode = True

# Additional properties to return via API
class User(UserInDBBase):
    pass

# Additional properties stored in DB
class UserInDB(UserInDBBase):
    password_hash: str

