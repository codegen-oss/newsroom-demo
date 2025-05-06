from sqlalchemy import Column, String, DateTime, Enum, JSON, UUID
from sqlalchemy.sql import func
import uuid

from .base import BaseModel

class Article(BaseModel):
    """Article model for storing news articles"""
    __tablename__ = "articles"
    
    id = Column(UUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    summary = Column(String, nullable=True)
    source = Column(String, nullable=True)
    source_url = Column(String, nullable=True)
    author = Column(String, nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=True)
    categories = Column(JSON, nullable=True)
    access_tier = Column(Enum("free", "premium", "organization", name="access_tier_enum"), default="free")
    featured_image = Column(String, nullable=True)

