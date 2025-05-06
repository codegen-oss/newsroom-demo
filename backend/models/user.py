from sqlalchemy import Column, String, Enum, JSON, UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from .base import BaseModel

class User(BaseModel):
    """User model for authentication and profile information"""
    __tablename__ = "users"
    
    id = Column(UUID, primary_key=True, default=uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    display_name = Column(String, nullable=False)
    subscription_tier = Column(Enum('free', 'individual', 'organization', name='subscription_tier_enum'), 
                              default='free', nullable=False)
    
    # Relationships
    interests = relationship("UserInterest", back_populates="user", uselist=False, cascade="all, delete-orphan")
    organization_memberships = relationship("OrganizationMember", back_populates="user", cascade="all, delete-orphan")

