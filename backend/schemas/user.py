from pydantic import BaseModel, EmailStr, Field, UUID4
from typing import Optional, Dict, Any, List
from enum import Enum

class SubscriptionTier(str, Enum):
    FREE = "free"
    INDIVIDUAL = "individual"
    ORGANIZATION = "organization"

class UserBase(BaseModel):
    email: EmailStr
    display_name: str
    subscription_tier: SubscriptionTier = SubscriptionTier.FREE
    preferences: Optional[Dict[str, Any]] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    display_name: Optional[str] = None
    subscription_tier: Optional[SubscriptionTier] = None
    preferences: Optional[Dict[str, Any]] = None
    password: Optional[str] = None

class UserInterestBase(BaseModel):
    categories: Optional[List[str]] = None
    regions: Optional[List[str]] = None
    topics: Optional[List[str]] = None

class UserInterestCreate(UserInterestBase):
    pass

class UserInterestUpdate(UserInterestBase):
    pass

class UserInterest(UserInterestBase):
    id: UUID4
    user_id: UUID4
    
    class Config:
        orm_mode = True

class User(UserBase):
    id: UUID4
    interests: Optional[List[UserInterest]] = None
    
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None

