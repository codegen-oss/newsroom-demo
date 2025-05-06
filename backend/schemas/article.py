from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class AccessTier(str, Enum):
    FREE = "free"
    PREMIUM = "premium"
    ORGANIZATION = "organization"

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class Tag(TagBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ArticleBase(BaseModel):
    title: str
    content: str
    summary: Optional[str] = None
    source: Optional[str] = None
    source_url: Optional[str] = None
    author: str
    featured_image: Optional[str] = None
    access_tier: AccessTier = AccessTier.FREE

class ArticleCreate(ArticleBase):
    category_ids: List[str] = []
    tag_ids: List[str] = []

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    source: Optional[str] = None
    source_url: Optional[str] = None
    author: Optional[str] = None
    featured_image: Optional[str] = None
    access_tier: Optional[AccessTier] = None
    category_ids: Optional[List[str]] = None
    tag_ids: Optional[List[str]] = None

class Article(ArticleBase):
    id: str
    published_at: datetime
    created_at: datetime
    updated_at: Optional[datetime] = None
    categories: List[Category] = []
    tags: List[Tag] = []

    class Config:
        from_attributes = True

class ArticleList(BaseModel):
    items: List[Article]
    total: int
    page: int
    size: int
    pages: int

