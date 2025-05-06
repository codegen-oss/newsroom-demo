from sqlalchemy import Column, ForeignKey, JSON, UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from .base import BaseModel

class UserInterest(BaseModel):
    """User interests model for storing user preferences"""
    __tablename__ = "user_interests"
    
    id = Column(UUID, primary_key=True, default=uuid4)
    user_id = Column(UUID, ForeignKey("users.id"), nullable=False, unique=True)
    
    # Store as JSON arrays
    categories = Column(JSON, default=list)
    regions = Column(JSON, default=list)
    topics = Column(JSON, default=list)
    
    # Relationship
    user = relationship("User", back_populates="interests")

