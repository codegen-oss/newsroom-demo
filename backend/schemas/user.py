from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    display_name: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    display_name: Optional[str] = None
    password: Optional[str] = None
    subscription_tier: Optional[str] = None

class UserResponse(UserBase):
    id: UUID
    subscription_tier: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# User interests schemas
class UserInterestBase(BaseModel):
    categories: List[str] = []
    regions: List[str] = []
    topics: List[str] = []

class UserInterestCreate(UserInterestBase):
    pass

class UserInterestUpdate(BaseModel):
    categories: Optional[List[str]] = None
    regions: Optional[List[str]] = None
    topics: Optional[List[str]] = None

class UserInterestResponse(UserInterestBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Combined user with interests
class UserWithInterests(UserResponse):
    interests: Optional[UserInterestResponse] = None

    class Config:
        orm_mode = True

