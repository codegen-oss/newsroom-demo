from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime
from enum import Enum

class SubscriptionTier(str, Enum):
    FREE = "free"
    INDIVIDUAL = "individual"
    ORGANIZATION = "organization"

class AccessTier(str, Enum):
    FREE = "free"
    PREMIUM = "premium"
    ORGANIZATION = "organization"

class OrganizationRole(str, Enum):
    ADMIN = "admin"
    MEMBER = "member"

# User schemas
class UserBase(BaseModel):
    email: str
    display_name: str
    subscription_tier: SubscriptionTier = SubscriptionTier.FREE
    preferences: Dict[str, Any] = {}

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[str] = None
    display_name: Optional[str] = None
    subscription_tier: Optional[SubscriptionTier] = None
    preferences: Optional[Dict[str, Any]] = None

class UserInDB(UserBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class User(UserInDB):
    pass

# UserInterest schemas
class UserInterestBase(BaseModel):
    categories: List[str] = []
    regions: List[str] = []
    topics: List[str] = []

class UserInterestCreate(UserInterestBase):
    user_id: str

class UserInterestUpdate(BaseModel):
    categories: Optional[List[str]] = None
    regions: Optional[List[str]] = None
    topics: Optional[List[str]] = None

class UserInterestInDB(UserInterestBase):
    id: str
    user_id: str
    
    class Config:
        from_attributes = True

class UserInterest(UserInterestInDB):
    pass

# Article schemas
class ArticleBase(BaseModel):
    title: str
    content: str
    summary: str
    source: str
    source_url: str
    author: str
    categories: List[str] = []
    access_tier: AccessTier = AccessTier.FREE
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

class ArticleInDB(ArticleBase):
    id: str
    published_at: datetime
    
    class Config:
        from_attributes = True

class Article(ArticleInDB):
    pass

# Organization schemas
class OrganizationBase(BaseModel):
    name: str
    subscription: Dict[str, Any] = {}

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    subscription: Optional[Dict[str, Any]] = None

class OrganizationInDB(OrganizationBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Organization(OrganizationInDB):
    pass

# OrganizationMember schemas
class OrganizationMemberBase(BaseModel):
    organization_id: str
    user_id: str
    role: OrganizationRole = OrganizationRole.MEMBER

class OrganizationMemberCreate(OrganizationMemberBase):
    pass

class OrganizationMemberUpdate(BaseModel):
    role: Optional[OrganizationRole] = None

class OrganizationMemberInDB(OrganizationMemberBase):
    id: str
    
    class Config:
        from_attributes = True

class OrganizationMember(OrganizationMemberInDB):
    pass

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

