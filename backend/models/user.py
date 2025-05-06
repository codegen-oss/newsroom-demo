from sqlalchemy import Column, String, Enum, JSON, UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from .base import BaseModel

class User(BaseModel):
    """User model for authentication and profile management"""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    display_name = Column(String, nullable=False)
    subscription_tier = Column(Enum('free', 'individual', 'organization', name='subscription_tier_enum'), default='free')
    preferences = Column(JSON, nullable=True)
    
    # Relationships
    interests = relationship("UserInterest", back_populates="user", cascade="all, delete-orphan")
