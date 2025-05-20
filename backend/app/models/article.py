from sqlalchemy import Column, String, DateTime, JSON
from datetime import datetime
import uuid

from app.db.session import Base
from app.models.enums import AccessTier

def generate_uuid():
    return str(uuid.uuid4())

class Article(Base):
    __tablename__ = "articles"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String)
    content = Column(String)
    summary = Column(String)
    source = Column(String)
    source_url = Column(String)
    author = Column(String)
    published_at = Column(DateTime, default=datetime.utcnow)
    categories = Column(JSON, default=list)
    access_tier = Column(String, default=AccessTier.FREE)
    featured_image = Column(String, nullable=True)

