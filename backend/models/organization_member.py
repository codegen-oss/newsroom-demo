from sqlalchemy import Column, ForeignKey, Enum, UUID
from sqlalchemy.orm import relationship
import uuid

from .base import BaseModel

class OrganizationMember(BaseModel):
    """Organization member model for storing organization members"""
    __tablename__ = "organization_members"
    
    id = Column(UUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(UUID, ForeignKey("organizations.id"), nullable=False)
    user_id = Column(UUID, ForeignKey("users.id"), nullable=False)
    role = Column(Enum("admin", "member", name="org_role_enum"), default="member")
    
    # Relationships
    organization = relationship("Organization", backref="members")
    user = relationship("User", backref="organizations")

