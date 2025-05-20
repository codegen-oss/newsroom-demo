from sqlalchemy import Column, String, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.db.session import Base
from app.models.enums import SubscriptionTier

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    display_name = Column(String)
    subscription_tier = Column(String, default=SubscriptionTier.FREE)
    created_at = Column(DateTime, default=datetime.utcnow)
    preferences = Column(JSON, default=dict)
    
    interests = relationship("UserInterest", back_populates="user")
    org_memberships = relationship("OrganizationMember", back_populates="user")

