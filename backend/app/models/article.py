from sqlalchemy import Column, String, DateTime, Enum, JSON, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from ..database.database import Base

class Article(Base):
    __tablename__ = "articles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String)
    content = Column(Text)
    summary = Column(String)
    source = Column(String)
    source_url = Column(String)
    author = Column(String)
    published_at = Column(DateTime, default=datetime.utcnow)
    categories = Column(JSON, default=[])
    access_tier = Column(Enum('free', 'premium', 'organization', name='access_tier_enum'), default='free')
    featured_image = Column(String, nullable=True)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=True)
    
    # Relationships
    organization = relationship("Organization", back_populates="articles")
