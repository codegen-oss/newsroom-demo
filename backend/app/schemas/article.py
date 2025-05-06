from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

# Category schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int

    class Config:
        orm_mode = True

# Article schemas
class ArticleBase(BaseModel):
    title: str
    content: str
    summary: Optional[str] = None
    category_id: int
    author: str
    access_tier: int = Field(0, ge=0, le=2, description="0=free, 1=basic, 2=premium")
    is_published: bool = True

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    category_id: Optional[int] = None
    author: Optional[str] = None
    access_tier: Optional[int] = Field(None, ge=0, le=2, description="0=free, 1=basic, 2=premium")
    is_published: Optional[bool] = None

class Article(ArticleBase):
    id: int
    published_date: datetime
    updated_date: datetime
    category: Category

    class Config:
        orm_mode = True

# Pagination schema
class PaginatedArticles(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[Article]

