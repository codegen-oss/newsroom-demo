"""
Article models for the News Room API.
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from database.schema import AccessTier

class ArticleBase(BaseModel):
    title: str
    content: str
    summary: Optional[str] = None
    source: Optional[str] = None
    source_url: Optional[str] = None
    author: Optional[str] = None
    categories: List[str] = []
    access_tier: AccessTier = AccessTier.FREE
    featured_image: Optional[str] = None

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    source: Optional[str] = None
    source_url: Optional[str] = None
    author: Optional[str] = None
    categories: Optional[List[str]] = None
    access_tier: Optional[AccessTier] = None
    featured_image: Optional[str] = None

class ArticleResponse(ArticleBase):
    id: str
    published_at: datetime

    class Config:
        orm_mode = True

