from sqlalchemy import Column, String, JSON, UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from .base import BaseModel

class Organization(BaseModel):
    """Organization model for managing organization data"""
    __tablename__ = "organizations"
    
    id = Column(UUID, primary_key=True, default=uuid4)
    name = Column(String, nullable=False, unique=True)
    description = Column(String, nullable=True)
    subscription = Column(JSON, nullable=False)  # Contains subscription details like tier, billing info, etc.
    
    # Relationships
    members = relationship("OrganizationMember", back_populates="organization", cascade="all, delete-orphan")

