from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Text, Enum, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid

from app.database.session import Base

# Define role enum for organization members
class OrganizationRole(str, enum.Enum):
    OWNER = "owner"
    ADMIN = "admin"
    EDITOR = "editor"
    MEMBER = "member"

# Define subscription tier enum
class SubscriptionTier(str, enum.Enum):
    FREE = "free"
    BASIC = "basic"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"

# User model
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    organizations = relationship("OrganizationMember", back_populates="user")
    articles = relationship("Article", back_populates="author")

# Organization model
class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    website = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    subscription_tier = Column(Enum(SubscriptionTier), default=SubscriptionTier.FREE)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    members = relationship("OrganizationMember", back_populates="organization")
    articles = relationship("Article", back_populates="organization")

# Organization Member model (join table with additional data)
class OrganizationMember(Base):
    __tablename__ = "organization_members"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"))
    role = Column(Enum(OrganizationRole), default=OrganizationRole.MEMBER)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="organizations")
    organization = relationship("Organization", back_populates="members")

# Article model
class Article(Base):
    __tablename__ = "articles"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, index=True)
    content = Column(Text)
    author_id = Column(String, ForeignKey("users.id"))
    organization_id = Column(String, ForeignKey("organizations.id"))
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    author = relationship("User", back_populates="articles")
    organization = relationship("Organization", back_populates="articles")

