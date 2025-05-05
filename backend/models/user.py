from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum

class SubscriptionTier(str, Enum):
    FREE = "free"
    INDIVIDUAL = "individual"
    ORGANIZATION = "organization"

class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    TRIAL = "trial"

class EmailFrequency(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    NONE = "none"

class UserPreferences(BaseModel):
    theme: str = "light"
    notifications: bool = True
    email_frequency: EmailFrequency = EmailFrequency.DAILY

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    display_name: str
    profile_image: Optional[str] = None
    subscription_tier: SubscriptionTier = SubscriptionTier.FREE
    subscription_status: SubscriptionStatus = SubscriptionStatus.TRIAL
    subscription_expiry: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.now)
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
    subscription_tier: SubscriptionTier
    subscription_status: SubscriptionStatus
    subscription_expiry: Optional[datetime] = None
    created_at: datetime
    last_login: Optional[datetime] = None
    preferences: UserPreferences

