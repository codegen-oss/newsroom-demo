from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel

from app.models.enums import OrganizationRole

# Shared properties for Organization
class OrganizationBase(BaseModel):
    name: Optional[str] = None
    subscription: Optional[Dict[str, Any]] = None

# Properties to receive via API on creation
class OrganizationCreate(OrganizationBase):
    name: str

# Properties to receive via API on update
class OrganizationUpdate(OrganizationBase):
    pass

# Properties to return via API
class OrganizationInDBBase(OrganizationBase):
    id: str
    name: str
    created_at: datetime
    
    class Config:
        orm_mode = True

# Additional properties to return via API
class Organization(OrganizationInDBBase):
    pass

# Shared properties for OrganizationMember
class OrganizationMemberBase(BaseModel):
    organization_id: Optional[str] = None
    user_id: Optional[str] = None
    role: Optional[OrganizationRole] = None

# Properties to receive via API on creation
class OrganizationMemberCreate(OrganizationMemberBase):
    organization_id: str
    user_id: str
    role: OrganizationRole = OrganizationRole.MEMBER

# Properties to receive via API on update
class OrganizationMemberUpdate(OrganizationMemberBase):
    pass

# Properties to return via API
class OrganizationMemberInDBBase(OrganizationMemberBase):
    id: str
    organization_id: str
    user_id: str
    role: OrganizationRole
    
    class Config:
        orm_mode = True

# Additional properties to return via API
class OrganizationMember(OrganizationMemberInDBBase):
    pass

