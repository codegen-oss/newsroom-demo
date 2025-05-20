"""
Database schema definitions for the News Room application.
This file contains SQLAlchemy models that represent the database schema.
"""

from datetime import datetime
import enum
import uuid
from typing import Dict, List, Optional, Any

from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class SubscriptionTier(enum.Enum):
    FREE = "free"
    INDIVIDUAL = "individual"
    ORGANIZATION = "organization"

class AccessTier(enum.Enum):
    FREE = "free"
    PREMIUM = "premium"
    ORGANIZATION = "organization"

class OrganizationRole(enum.Enum):
    ADMIN = "admin"
    MEMBER = "member"

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    display_name = Column(String, nullable=False)
    subscription_tier = Column(Enum(SubscriptionTier), default=SubscriptionTier.FREE)
    created_at = Column(DateTime, default=datetime.utcnow)
    preferences = Column(SQLiteJSON, default=dict)
    
    # Relationships
    interests = relationship("UserInterest", back_populates="user", cascade="all, delete-orphan")
    organization_memberships = relationship("OrganizationMember", back_populates="user", cascade="all, delete-orphan")

class UserInterest(Base):
    __tablename__ = "user_interests"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    categories = Column(SQLiteJSON, default=list)
    regions = Column(SQLiteJSON, default=list)
    topics = Column(SQLiteJSON, default=list)
    
    # Relationships
    user = relationship("User", back_populates="interests")

class Article(Base):
    __tablename__ = "articles"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    summary = Column(String)
    source = Column(String)
    source_url = Column(String)
    author = Column(String)
    published_at = Column(DateTime, default=datetime.utcnow)
    categories = Column(SQLiteJSON, default=list)
    access_tier = Column(Enum(AccessTier), default=AccessTier.FREE)
    featured_image = Column(String)

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    subscription = Column(SQLiteJSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    members = relationship("OrganizationMember", back_populates="organization", cascade="all, delete-orphan")

class OrganizationMember(Base):
    __tablename__ = "organization_members"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    role = Column(Enum(OrganizationRole), default=OrganizationRole.MEMBER)
    
    # Relationships
    organization = relationship("Organization", back_populates="members")
    user = relationship("User", back_populates="organization_memberships")

