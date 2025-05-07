from sqlalchemy import Column, String, DateTime, Enum, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from ..database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    display_name = Column(String)
    subscription_tier = Column(Enum('free', 'individual', 'organization', name='subscription_tier_enum'), default='free')
    created_at = Column(DateTime, default=datetime.utcnow)
    preferences = Column(JSON, default={})

