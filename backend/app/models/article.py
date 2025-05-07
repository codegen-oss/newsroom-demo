from sqlalchemy import Column, String, DateTime, Enum, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
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

