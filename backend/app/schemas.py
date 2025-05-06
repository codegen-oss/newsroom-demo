from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

# Enums
class SubscriptionTierEnum(str, Enum):
    free = "free"
    individual = "individual"
    organization = "organization"

class AccessTierEnum(str, Enum):
    free = "free"
    premium = "premium"
    organization = "organization"

class RoleEnum(str, Enum):
    admin = "admin"
    member = "member"

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    display_name: str

class UserCreate(UserBase):
    password: str
    subscription_tier: SubscriptionTierEnum = SubscriptionTierEnum.free
    preferences: Optional[Dict[str, Any]] = None

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    subscription_tier: Optional[SubscriptionTierEnum] = None
    preferences: Optional[Dict[str, Any]] = None

class UserResponse(UserBase):
    id: str
    subscription_tier: SubscriptionTierEnum
    created_at: datetime
    preferences: Optional[Dict[str, Any]] = None

    class Config:
        orm_mode = True

# UserInterest schemas
class UserInterestBase(BaseModel):
    categories: Optional[List[str]] = None
    regions: Optional[List[str]] = None
    topics: Optional[List[str]] = None

class UserInterestCreate(UserInterestBase):
    pass

class UserInterestUpdate(UserInterestBase):
    pass

class UserInterestResponse(UserInterestBase):
    id: str
    user_id: str

    class Config:
        orm_mode = True

# Article schemas
class ArticleBase(BaseModel):
    title: str
    content: str
    summary: str
    source: str
    source_url: str
    author: str
    categories: List[str]
    access_tier: AccessTierEnum
    featured_image: Optional[str] = None

class ArticleCreate(ArticleBase):
    published_at: Optional[datetime] = None

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    source: Optional[str] = None
    source_url: Optional[str] = None
    author: Optional[str] = None
    categories: Optional[List[str]] = None
    access_tier: Optional[AccessTierEnum] = None
    featured_image: Optional[str] = None

class ArticleResponse(ArticleBase):
    id: str
    published_at: datetime

    class Config:
        orm_mode = True

# Organization schemas
class OrganizationBase(BaseModel):
    name: str
    subscription: Dict[str, Any]

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    subscription: Optional[Dict[str, Any]] = None

class OrganizationResponse(OrganizationBase):
    id: str
    created_at: datetime

    class Config:
        orm_mode = True

# OrganizationMember schemas
class OrganizationMemberBase(BaseModel):
    organization_id: str
    user_id: str
    role: RoleEnum

class OrganizationMemberCreate(OrganizationMemberBase):
    pass

class OrganizationMemberUpdate(BaseModel):
    role: Optional[RoleEnum] = None

class OrganizationMemberResponse(OrganizationMemberBase):
    id: str

    class Config:
        orm_mode = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

