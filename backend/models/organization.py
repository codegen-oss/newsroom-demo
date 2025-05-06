from sqlalchemy import Column, String, JSON, UUID
import uuid

from .base import BaseModel

class Organization(BaseModel):
    """Organization model for storing organization information"""
    __tablename__ = "organizations"
    
    id = Column(UUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    subscription = Column(JSON, nullable=True)

