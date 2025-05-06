from sqlalchemy import Column, String, Text, DateTime, Enum, ForeignKey, Table, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.sqlite import JSON
from sqlalchemy.sql import func
import uuid
import enum
from .base import BaseModel
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Association tables for many-to-many relationships
article_category = Table(
    'article_category',
    Base.metadata,
    Column('article_id', String, ForeignKey('articles.id')),
    Column('category_id', String, ForeignKey('categories.id'))
)

article_tag = Table(
    'article_tag',
    Base.metadata,
    Column('article_id', String, ForeignKey('articles.id')),
    Column('tag_id', String, ForeignKey('tags.id'))
)

class AccessTier(str, enum.Enum):
    FREE = "free"
    PREMIUM = "premium"
    ORGANIZATION = "organization"

class Article(BaseModel):
    """Article model"""
    __tablename__ = "articles"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    summary = Column(String, nullable=True)
    source = Column(String, nullable=True)
    source_url = Column(String, nullable=True)
    author = Column(String, nullable=False)
    published_at = Column(DateTime(timezone=True), server_default=func.now())
    featured_image = Column(String, nullable=True)
    access_tier = Column(Enum(AccessTier), default=AccessTier.FREE)
    
    # Relationships
    categories = relationship("Category", secondary=article_category, back_populates="articles")
    tags = relationship("Tag", secondary=article_tag, back_populates="articles")

class Category(BaseModel):
    """Category model"""
    __tablename__ = "categories"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, unique=True)
    description = Column(String, nullable=True)
    
    # Relationships
    articles = relationship("Article", secondary=article_category, back_populates="categories")

class Tag(BaseModel):
    """Tag model"""
    __tablename__ = "tags"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, unique=True)
    
    # Relationships
    articles = relationship("Article", secondary=article_tag, back_populates="tags")

