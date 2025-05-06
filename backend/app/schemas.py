from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum as PyEnum

# Enums
class SubscriptionTier(str, PyEnum):
    free = "free"
    individual = "individual"
    organization = "organization"

class AccessTier(str, PyEnum):
    free = "free"
    premium = "premium"
    organization = "organization"

class UserRole(str, PyEnum):
    admin = "admin"
    member = "member"

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    display_name: str

class UserCreate(UserBase):
    password: str
    subscription_tier: SubscriptionTier = SubscriptionTier.free

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    subscription_tier: Optional[SubscriptionTier] = None

class UserInDB(UserBase):
    id: str
    subscription_tier: SubscriptionTier
    created_at: datetime
    preferences: Optional[Dict[str, Any]] = None

    class Config:
        orm_mode = True

class User(UserInDB):
    pass

# User Interest schemas
class UserInterestBase(BaseModel):
    categories: List[str] = []
    regions: List[str] = []
    topics: List[str] = []

class UserInterestCreate(UserInterestBase):
    user_id: str

class UserInterestUpdate(UserInterestBase):
    pass

class UserInterest(UserInterestBase):
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
    access_tier: AccessTier
    featured_image: Optional[str] = None

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    source: Optional[str] = None
    source_url: Optional[str] = None
    author: Optional[str] = None
    categories: Optional[List[str]] = None
    access_tier: Optional[AccessTier] = None
    featured_image: Optional[str] = None

class Article(ArticleBase):
    id: str
    published_at: datetime

    class Config:
        orm_mode = True

# Organization schemas
class OrganizationBase(BaseModel):
    name: str
    subscription: Dict[str, Any] = {}

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    subscription: Optional[Dict[str, Any]] = None

class Organization(OrganizationBase):
    id: str
    created_at: datetime

    class Config:
        orm_mode = True

# Organization Member schemas
class OrganizationMemberBase(BaseModel):
    organization_id: str
    user_id: str
    role: UserRole = UserRole.member

class OrganizationMemberCreate(OrganizationMemberBase):
    pass

class OrganizationMemberUpdate(BaseModel):
    role: Optional[UserRole] = None

class OrganizationMember(OrganizationMemberBase):
    id: str

    class Config:
        orm_mode = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None

