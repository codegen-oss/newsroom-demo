from sqlalchemy import Column, String, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from ..database.database import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String)
    subscription = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)

