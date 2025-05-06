from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID

class ArticleBase(BaseModel):
    title: str
    content: str
    summary: Optional[str] = None
    source: Optional[str] = None
    source_url: Optional[str] = None
    author: Optional[str] = None
    categories: Optional[List[str]] = None
    access_tier: Optional[str] = "free"
    featured_image: Optional[str] = None

class ArticleCreate(ArticleBase):
    published_at: Optional[datetime] = None

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    source: Optional[str] = None
    source_url: Optional[str] = None
    author: Optional[str] = None
    published_at: Optional[datetime] = None
    categories: Optional[List[str]] = None
    access_tier: Optional[str] = None
    featured_image: Optional[str] = None

class ArticleResponse(ArticleBase):
    id: UUID
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

