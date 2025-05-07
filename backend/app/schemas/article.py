from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ArticleBase(BaseModel):
    title: str
    content: str
    summary: str
    source: str
    source_url: str
    author: str
    categories: List[str] = []
    access_tier: str = "free"
    featured_image: Optional[str] = None
    organization_id: Optional[str] = None

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
    access_tier: Optional[str] = None
    featured_image: Optional[str] = None
    organization_id: Optional[str] = None

class ArticleResponse(ArticleBase):
    id: str
    published_at: datetime

    class Config:
        orm_mode = True

class OrganizationArticleResponse(ArticleResponse):
    organization_name: Optional[str] = None
    
    class Config:
        orm_mode = True
