from sqlalchemy import Column, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.db.session import Base
from app.models.enums import OrganizationRole

def generate_uuid():
    return str(uuid.uuid4())

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String)
    subscription = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    members = relationship("OrganizationMember", back_populates="organization")

class OrganizationMember(Base):
    __tablename__ = "organization_members"

    id = Column(String, primary_key=True, default=generate_uuid)
    organization_id = Column(String, ForeignKey("organizations.id"))
    user_id = Column(String, ForeignKey("users.id"))
    role = Column(String, default=OrganizationRole.MEMBER)
    
    organization = relationship("Organization", back_populates="members")
    user = relationship("User", back_populates="org_memberships")

