from sqlalchemy import Column, String, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid
from ..database.database import Base

class UserInterest(Base):
    __tablename__ = "user_interests"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    categories = Column(JSON, default=[])
    regions = Column(JSON, default=[])
    topics = Column(JSON, default=[])

