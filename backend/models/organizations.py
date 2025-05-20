"""
Organization models for the News Room API.
"""

from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from database.schema import OrganizationRole

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
    role: OrganizationRole = OrganizationRole.MEMBER

class OrganizationMemberCreate(OrganizationMemberBase):
    pass

class OrganizationMemberUpdate(BaseModel):
    role: Optional[OrganizationRole] = None

class OrganizationMemberResponse(OrganizationMemberBase):
    id: str

    class Config:
        orm_mode = True

