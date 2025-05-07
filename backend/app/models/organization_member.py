from sqlalchemy import Column, String, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
import uuid
from ..database.database import Base

class OrganizationMember(Base):
    __tablename__ = "organization_members"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id"))
    user_id = Column(String, ForeignKey("users.id"))
    role = Column(Enum('admin', 'member', name='role_enum'), default='member')

