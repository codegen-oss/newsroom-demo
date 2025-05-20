from sqlalchemy import Column, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
import uuid

from app.db.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class UserInterest(Base):
    __tablename__ = "user_interests"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    categories = Column(JSON, default=list)
    regions = Column(JSON, default=list)
    topics = Column(JSON, default=list)
    
    user = relationship("User", back_populates="interests")

