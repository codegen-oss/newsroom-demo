from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List
from datetime import datetime

class SubscriptionTier(BaseModel):
    name: str
    price: float
    features: List[str]
    max_members: int

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

class OrganizationMemberInvite(BaseModel):
    email: EmailStr
    role: str = "member"

class OrganizationMemberUpdate(BaseModel):
    role: Optional[str] = None

class OrganizationMemberResponse(OrganizationMemberBase):
    id: str

    class Config:
        orm_mode = True

class OrganizationWithMembers(OrganizationResponse):
    members: List[OrganizationMemberResponse] = []

    class Config:
        orm_mode = True

class SubscriptionCreate(BaseModel):
    tier: str
    payment_method: Dict[str, Any] = {}
    
class SubscriptionUpdate(BaseModel):
    tier: Optional[str] = None
    payment_method: Optional[Dict[str, Any]] = None
    status: Optional[str] = None

class SubscriptionResponse(BaseModel):
    id: str
    organization_id: str
    tier: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True
