from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base

# Association table for many-to-many relationship between articles and categories
article_category = Table(
    "article_category",
    Base.metadata,
    Column("article_id", Integer, ForeignKey("articles.id"), primary_key=True),
    Column("category_id", Integer, ForeignKey("categories.id"), primary_key=True),
)

class Article(Base):
    """
    SQLAlchemy model for articles.
    """
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    summary = Column(String(500))
    author = Column(String(100))
    published_date = Column(DateTime, default=func.now())
    updated_date = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationship with categories (many-to-many)
    categories = relationship(
        "Category", 
        secondary=article_category, 
        back_populates="articles"
    )

class Category(Base):
    """
    SQLAlchemy model for categories.
    """
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(String(255))
    
    # Relationship with articles (many-to-many)
    articles = relationship(
        "Article", 
        secondary=article_category, 
        back_populates="categories"
    )

