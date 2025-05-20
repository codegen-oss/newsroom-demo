from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, HttpUrl

from app.models.enums import AccessTier

# Shared properties
class ArticleBase(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    source: Optional[str] = None
    source_url: Optional[str] = None
    author: Optional[str] = None
    categories: Optional[List[str]] = None
    access_tier: Optional[AccessTier] = None
    featured_image: Optional[str] = None

# Properties to receive via API on creation
class ArticleCreate(ArticleBase):
    title: str
    content: str
    summary: str
    source: str
    source_url: str
    author: str
    categories: List[str]
    access_tier: AccessTier = AccessTier.FREE

# Properties to receive via API on update
class ArticleUpdate(ArticleBase):
    pass

# Properties to return via API
class ArticleInDBBase(ArticleBase):
    id: str
    title: str
    published_at: datetime
    
    class Config:
        orm_mode = True

# Additional properties to return via API
class Article(ArticleInDBBase):
    pass

# Full article with content
class ArticleDetail(Article):
    content: str

