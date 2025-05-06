from typing import List, Optional
from pydantic import BaseModel, EmailStr, HttpUrl, validator
from datetime import datetime
from app.models.models import OrganizationRole, SubscriptionTier

# Base Organization Schema
class OrganizationBase(BaseModel):
    name: str
    description: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    subscription_tier: SubscriptionTier = SubscriptionTier.FREE

# Organization Create Schema
class OrganizationCreate(OrganizationBase):
    pass

# Organization Update Schema
class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    subscription_tier: Optional[SubscriptionTier] = None
    is_active: Optional[bool] = None

# Base Organization Member Schema
class OrganizationMemberBase(BaseModel):
    user_id: str
    organization_id: str
    role: OrganizationRole = OrganizationRole.MEMBER

# Organization Member Create Schema
class OrganizationMemberCreate(BaseModel):
    user_id: str
    role: OrganizationRole = OrganizationRole.MEMBER

# Organization Member Update Schema
class OrganizationMemberUpdate(BaseModel):
    role: OrganizationRole

# User Base Schema (for use in Organization responses)
class UserBase(BaseModel):
    id: str
    email: str
    username: str
    full_name: Optional[str] = None

    class Config:
        orm_mode = True

# Organization Member Response Schema
class OrganizationMember(OrganizationMemberBase):
    id: str
    joined_at: datetime
    updated_at: Optional[datetime] = None
    user: UserBase

    class Config:
        orm_mode = True

# Organization Response Schema
class Organization(OrganizationBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    members: List[OrganizationMember] = []

    class Config:
        orm_mode = True

# Organization with Basic Info (without members)
class OrganizationBasic(OrganizationBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# Organization Member Response (without user details)
class OrganizationMemberBasic(BaseModel):
    id: str
    user_id: str
    organization_id: str
    role: OrganizationRole
    joined_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

