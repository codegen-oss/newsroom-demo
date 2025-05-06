from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# Category schemas
class CategoryBase(BaseModel):
    """
    Base schema for category data.
    """
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=255)

class CategoryCreate(CategoryBase):
    """
    Schema for creating a new category.
    """
    pass

class Category(CategoryBase):
    """
    Schema for category responses.
    """
    id: int

    class Config:
        orm_mode = True

# Article schemas
class ArticleBase(BaseModel):
    """
    Base schema for article data.
    """
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    summary: Optional[str] = Field(None, max_length=500)
    author: Optional[str] = Field(None, max_length=100)

class ArticleCreate(ArticleBase):
    """
    Schema for creating a new article.
    """
    category_ids: Optional[List[int]] = []

class ArticleUpdate(ArticleBase):
    """
    Schema for updating an article.
    """
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = Field(None, min_length=1)
    category_ids: Optional[List[int]] = None

class Article(ArticleBase):
    """
    Schema for article responses.
    """
    id: int
    published_date: datetime
    updated_date: datetime
    categories: List[Category] = []

    class Config:
        orm_mode = True

