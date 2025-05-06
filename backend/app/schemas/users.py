from typing import List, Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

from app.schemas.organizations import OrganizationBasic

# Base User Schema
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    is_active: bool = True

# User Create Schema
class UserCreate(UserBase):
    password: str

# User Update Schema
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None

# User Response Schema
class User(UserBase):
    id: str
    is_superuser: bool = False
    created_at: datetime
    updated_at: Optional[datetime] = None
    organizations: List[OrganizationBasic] = []

    class Config:
        orm_mode = True

# User Login Schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str

# Token Data Schema
class TokenData(BaseModel):
    user_id: Optional[str] = None

