from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.database import Base

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    content = Column(Text, nullable=False)
    summary = Column(String(500), nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    author = Column(String(100), nullable=False)
    published_date = Column(DateTime, default=datetime.utcnow, index=True)
    updated_date = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    access_tier = Column(Integer, default=0, index=True)  # 0=free, 1=basic, 2=premium
    is_published = Column(Boolean, default=True, index=True)
    
    # Relationships
    category = relationship("Category", back_populates="articles")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True, index=True)
    description = Column(String(200), nullable=True)
    
    # Relationships
    articles = relationship("Article", back_populates="category")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), nullable=False, unique=True, index=True)
    email = Column(String(100), nullable=False, unique=True, index=True)
    hashed_password = Column(String(100), nullable=False)
    subscription_tier = Column(Integer, default=0)  # 0=free, 1=basic, 2=premium
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

