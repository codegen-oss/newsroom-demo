from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, List, Literal
from datetime import datetime
import uuid

class OrganizationSubscription(BaseModel):
    plan: str
    seats: int
    used_seats: int = 0
    start_date: datetime
    renewal_date: datetime
    payment_method: Dict = {}

class Organization(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    logo: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    billing_email: EmailStr
    billing_address: Dict = {}
    subscription: OrganizationSubscription
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class OrganizationMember(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    organization_id: str
    user_id: str
    role: Literal["admin", "member", "viewer"] = "member"
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    invited_by: Optional[str] = None

class OrganizationCreate(BaseModel):
    name: str
    logo: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    billing_email: EmailStr
    billing_address: Dict = {}
    subscription: OrganizationSubscription

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    logo: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    billing_email: Optional[EmailStr] = None
    billing_address: Optional[Dict] = None
    subscription: Optional[OrganizationSubscription] = None

class OrganizationResponse(BaseModel):
    id: str
    name: str
    logo: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    billing_email: EmailStr
    subscription: OrganizationSubscription
    created_at: datetime
    updated_at: datetime

class OrganizationMemberCreate(BaseModel):
    user_id: str
    role: Literal["admin", "member", "viewer"] = "member"
    invited_by: str

class OrganizationMemberUpdate(BaseModel):
    role: Literal["admin", "member", "viewer"]

class OrganizationMemberResponse(BaseModel):
    id: str
    organization_id: str
    user_id: str
    role: str
    joined_at: datetime
    invited_by: Optional[str] = None

