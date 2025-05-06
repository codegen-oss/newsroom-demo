from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime

# Organization schemas
class OrganizationBase(BaseModel):
    name: str
    description: Optional[str] = None
    subscription: Dict[str, Any]

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    subscription: Optional[Dict[str, Any]] = None

class OrganizationResponse(OrganizationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Organization member schemas
class OrganizationMemberBase(BaseModel):
    role: str = "member"  # "admin" or "member"

class OrganizationMemberCreate(OrganizationMemberBase):
    user_id: UUID

class OrganizationMemberUpdate(BaseModel):
    role: Optional[str] = None

class OrganizationMemberResponse(OrganizationMemberBase):
    id: UUID
    organization_id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Combined organization with members
class OrganizationWithMembers(OrganizationResponse):
    members: List[OrganizationMemberResponse] = []

    class Config:
        orm_mode = True

