from sqlalchemy import Column, ForeignKey, Enum, UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from .base import BaseModel

class OrganizationMember(BaseModel):
    """Organization membership model for managing user roles within organizations"""
    __tablename__ = "organization_members"
    
    id = Column(UUID, primary_key=True, default=uuid4)
    organization_id = Column(UUID, ForeignKey("organizations.id"), nullable=False)
    user_id = Column(UUID, ForeignKey("users.id"), nullable=False)
    role = Column(Enum('admin', 'member', name='organization_role_enum'), default='member', nullable=False)
    
    # Relationships
    organization = relationship("Organization", back_populates="members")
    user = relationship("User", back_populates="organization_memberships")
    
    # Composite unique constraint to prevent duplicate memberships
    __table_args__ = (
        {'sqlite_autoincrement': True},
    )

