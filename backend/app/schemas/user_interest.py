from pydantic import BaseModel
from typing import List, Optional

class UserInterestBase(BaseModel):
    user_id: str
    categories: List[str] = []
    regions: List[str] = []
    topics: List[str] = []

class UserInterestCreate(UserInterestBase):
    pass

class UserInterestUpdate(BaseModel):
    categories: Optional[List[str]] = None
    regions: Optional[List[str]] = None
    topics: Optional[List[str]] = None

class UserInterestResponse(UserInterestBase):
    id: str

    class Config:
        orm_mode = True

