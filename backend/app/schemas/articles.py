from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

# Base Article Schema
class ArticleBase(BaseModel):
    title: str
    content: str
    is_published: bool = False

# Article Create Schema
class ArticleCreate(ArticleBase):
    organization_id: str

# Article Update Schema
class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_published: Optional[bool] = None

# Article Response Schema
class Article(ArticleBase):
    id: str
    author_id: str
    organization_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

