"""
User models for the News Room API.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List, Any
from datetime import datetime
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from database.schema import SubscriptionTier

class UserBase(BaseModel):
    email: EmailStr
    display_name: str
    subscription_tier: SubscriptionTier = SubscriptionTier.FREE

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    display_name: Optional[str] = None
    subscription_tier: Optional[SubscriptionTier] = None
    preferences: Optional[Dict[str, Any]] = None

class UserResponse(UserBase):
    id: str
    created_at: datetime
    preferences: Dict[str, Any] = {}

    class Config:
        orm_mode = True

class UserInterestBase(BaseModel):
    categories: List[str] = []
    regions: List[str] = []
    topics: List[str] = []

class UserInterestCreate(UserInterestBase):
    pass

class UserInterestUpdate(UserInterestBase):
    pass

class UserInterestResponse(UserInterestBase):
    id: str
    user_id: str

    class Config:
        orm_mode = True

