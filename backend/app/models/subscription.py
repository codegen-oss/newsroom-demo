from sqlalchemy import Column, String, DateTime, Enum, JSON, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from ..database.database import Base

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id"))
    tier = Column(String, default="basic")  # basic, premium, enterprise
    status = Column(Enum('active', 'inactive', 'pending', 'cancelled', name='subscription_status_enum'), default='active')
    payment_details = Column(JSON, default={})
    price = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    
    # Relationships
    organization = relationship("Organization", backref="subscription_details")

