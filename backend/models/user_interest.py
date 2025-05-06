from sqlalchemy import Column, ForeignKey, JSON, UUID
from sqlalchemy.orm import relationship
import uuid

from .base import BaseModel

class UserInterest(BaseModel):
    """User interests model for storing user preferences"""
    __tablename__ = "user_interests"
    
    id = Column(UUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(UUID, ForeignKey("users.id"), nullable=False)
    categories = Column(JSON, nullable=True)
    regions = Column(JSON, nullable=True)
    topics = Column(JSON, nullable=True)
    
    # Relationship
    user = relationship("User", backref="interests")

