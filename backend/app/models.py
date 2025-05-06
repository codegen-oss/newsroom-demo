from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, JSON, Enum
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
import enum
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

class SubscriptionTier(str, enum.Enum):
    free = "free"
    individual = "individual"
    organization = "organization"

class AccessTier(str, enum.Enum):
    free = "free"
    premium = "premium"
    organization = "organization"

class UserRole(str, enum.Enum):
    admin = "admin"
    member = "member"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    display_name = Column(String)
    subscription_tier = Column(Enum(SubscriptionTier), default=SubscriptionTier.free)
    created_at = Column(DateTime, default=datetime.utcnow)
    preferences = Column(JSON, default=dict)
    
    # Relationships
    interests = relationship("UserInterest", back_populates="user")
    organization_memberships = relationship("OrganizationMember", back_populates="user")

class UserInterest(Base):
    __tablename__ = "user_interests"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    categories = Column(JSON, default=list)
    regions = Column(JSON, default=list)
    topics = Column(JSON, default=list)
    
    # Relationships
    user = relationship("User", back_populates="interests")

class Article(Base):
    __tablename__ = "articles"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String)
    content = Column(String)
    summary = Column(String)
    source = Column(String)
    source_url = Column(String)
    author = Column(String)
    published_at = Column(DateTime, default=datetime.utcnow)
    categories = Column(JSON, default=list)
    access_tier = Column(Enum(AccessTier), default=AccessTier.free)
    featured_image = Column(String, nullable=True)

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String)
    subscription = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    members = relationship("OrganizationMember", back_populates="organization")

class OrganizationMember(Base):
    __tablename__ = "organization_members"

    id = Column(String, primary_key=True, default=generate_uuid)
    organization_id = Column(String, ForeignKey("organizations.id"))
    user_id = Column(String, ForeignKey("users.id"))
    role = Column(Enum(UserRole), default=UserRole.member)
    
    # Relationships
    organization = relationship("Organization", back_populates="members")
    user = relationship("User", back_populates="organization_memberships")

