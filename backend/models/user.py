from sqlalchemy import Column, String, Enum, JSON, UUID
from sqlalchemy.sql import func
import uuid

from .base import BaseModel

class User(BaseModel):
    """User model for authentication and profile information"""
    __tablename__ = "users"
    
    id = Column(UUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    display_name = Column(String, nullable=False)
    subscription_tier = Column(Enum("free", "individual", "organization", name="subscription_tier_enum"), default="free")
    preferences = Column(JSON, nullable=True)

