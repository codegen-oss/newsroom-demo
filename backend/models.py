from sqlalchemy import Column, String, ForeignKey, DateTime, JSON, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

from database import Base

class BaseModel(Base):
    __abstract__ = True
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class User(BaseModel):
    __tablename__ = "users"
    
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    display_name = Column(String)
    subscription_tier = Column(String, default="free")  # free, individual, organization
    
    # Relationships
    interests = relationship("UserInterest", back_populates="user", uselist=False, cascade="all, delete-orphan")
    organization_memberships = relationship("OrganizationMember", back_populates="user", cascade="all, delete-orphan")

class UserInterest(BaseModel):
    __tablename__ = "user_interests"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    categories = Column(JSON, default=list)
    regions = Column(JSON, default=list)
    topics = Column(JSON, default=list)
    
    # Relationships
    user = relationship("User", back_populates="interests")

class Organization(BaseModel):
    __tablename__ = "organizations"
    
    name = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    subscription = Column(JSON)
    
    # Relationships
    members = relationship("OrganizationMember", back_populates="organization", cascade="all, delete-orphan")

class OrganizationMember(BaseModel):
    __tablename__ = "organization_members"
    
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    role = Column(String, default="member")  # admin, member
    
    # Relationships
    organization = relationship("Organization", back_populates="members")
    user = relationship("User", back_populates="organization_memberships")

