from typing import List, Optional
from pydantic import BaseModel

# Shared properties
class UserInterestBase(BaseModel):
    categories: Optional[List[str]] = None
    regions: Optional[List[str]] = None
    topics: Optional[List[str]] = None

# Properties to receive via API on creation
class UserInterestCreate(UserInterestBase):
    user_id: str

# Properties to receive via API on update
class UserInterestUpdate(UserInterestBase):
    pass

# Properties to return via API
class UserInterestInDBBase(UserInterestBase):
    id: str
    user_id: str
    
    class Config:
        orm_mode = True

# Additional properties to return via API
class UserInterest(UserInterestInDBBase):
    pass

