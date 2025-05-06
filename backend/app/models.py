import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    display_name = Column(String)
    subscription_tier = Column(Enum("free", "individual", "organization", name="subscription_tier_enum"))
    created_at = Column(DateTime, default=datetime.utcnow)
    preferences = Column(SQLiteJSON)
    
    # Relationships
    interests = relationship("UserInterest", back_populates="user")
    org_memberships = relationship("OrganizationMember", back_populates="user")

class UserInterest(Base):
    __tablename__ = "user_interests"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    categories = Column(SQLiteJSON)
    regions = Column(SQLiteJSON)
    topics = Column(SQLiteJSON)
    
    # Relationships
    user = relationship("User", back_populates="interests")

class Article(Base):
    __tablename__ = "articles"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String)
    content = Column(String)
    summary = Column(String)
    source = Column(String)
    source_url = Column(String)
    author = Column(String)
    published_at = Column(DateTime)
    categories = Column(SQLiteJSON)
    access_tier = Column(Enum("free", "premium", "organization", name="access_tier_enum"))
    featured_image = Column(String)

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String)
    subscription = Column(SQLiteJSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    members = relationship("OrganizationMember", back_populates="organization")

class OrganizationMember(Base):
    __tablename__ = "organization_members"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id"))
    user_id = Column(String, ForeignKey("users.id"))
    role = Column(Enum("admin", "member", name="role_enum"))
    
    # Relationships
    organization = relationship("Organization", back_populates="members")
    user = relationship("User", back_populates="org_memberships")

