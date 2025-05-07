from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class OrganizationBase(BaseModel):
    name: str
    subscription: Dict[str, Any] = {}

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

class OrganizationMemberBase(BaseModel):
    organization_id: str
    user_id: str
    role: str = "member"

class OrganizationMemberCreate(OrganizationMemberBase):
    pass

class OrganizationMemberUpdate(BaseModel):
    role: Optional[str] = None

class OrganizationMemberResponse(OrganizationMemberBase):
    id: str

    class Config:
        orm_mode = True

