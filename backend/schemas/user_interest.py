from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID

class UserInterestBase(BaseModel):
    user_id: UUID
    categories: Optional[List[str]] = None
    regions: Optional[List[str]] = None
    topics: Optional[List[str]] = None

class UserInterestCreate(UserInterestBase):
    pass

class UserInterestUpdate(BaseModel):
    categories: Optional[List[str]] = None
    regions: Optional[List[str]] = None
    topics: Optional[List[str]] = None

class UserInterestResponse(UserInterestBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

