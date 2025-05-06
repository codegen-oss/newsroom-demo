# Import models here for easy access
from .base import Base, BaseModel
from .user import User
from .user_interest import UserInterest

# Export all models
__all__ = ['Base', 'BaseModel', 'User', 'UserInterest']
