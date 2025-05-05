from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum
import uuid

class OrganizationRole(str, Enum):
    ADMIN = "admin"
    MEMBER = "member"
    VIEWER = "viewer"

class PaymentMethod(BaseModel):
    type: str
    last_four: Optional[str] = None
    expiry: Optional[str] = None
    holder_name: Optional[str] = None

class BillingAddress(BaseModel):
    street: str
    city: str
    state: str
    postal_code: str
    country: str

class OrganizationSubscription(BaseModel):
    plan: str
    seats: int
    used_seats: int = 0
    start_date: datetime
    renewal_date: datetime
    payment_method: Optional[PaymentMethod] = None

class Organization(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    logo: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    billing_email: EmailStr
    billing_address: Optional[BillingAddress] = None
    subscription: OrganizationSubscription
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class OrganizationMember(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    organization_id: str
    user_id: str
    role: OrganizationRole
    joined_at: datetime = Field(default_factory=datetime.now)
    invited_by: Optional[str] = None

class OrganizationCreate(BaseModel):
    name: str
    logo: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    billing_email: EmailStr
    billing_address: Optional[BillingAddress] = None
    plan: str
    seats: int

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    logo: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    billing_email: Optional[EmailStr] = None
    billing_address: Optional[BillingAddress] = None

class OrganizationResponse(BaseModel):
    id: str
    name: str
    logo: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    subscription: OrganizationSubscription

