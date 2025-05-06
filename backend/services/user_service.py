from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import uuid

from models import User, UserInterest
from schemas import UserCreate, UserUpdate, UserInterestCreate, UserInterestUpdate
from utils.auth import get_password_hash, verify_password

class UserService:
    @staticmethod
    def create_user(db: Session, user_create: UserCreate):
        """Create a new user"""
        # Check if user with this email already exists
        db_user = db.query(User).filter(User.email == user_create.email).first()
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        hashed_password = get_password_hash(user_create.password)
        db_user = User(
            id=str(uuid.uuid4()),
            email=user_create.email,
            password_hash=hashed_password,
            display_name=user_create.display_name,
            subscription_tier="free"
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        return db_user
    
    @staticmethod
    def get_user_by_email(db: Session, email: str):
        """Get a user by email"""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: uuid.UUID):
        """Get a user by ID"""
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def update_user(db: Session, user_id: uuid.UUID, user_update: UserUpdate):
        """Update a user"""
        db_user = db.query(User).filter(User.id == user_id).first()
        
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Update fields if provided
        if user_update.email is not None:
            # Check if email is already taken
            existing_user = db.query(User).filter(User.email == user_update.email).first()
            if existing_user and existing_user.id != user_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
            db_user.email = user_update.email
            
        if user_update.display_name is not None:
            db_user.display_name = user_update.display_name
            
        if user_update.password is not None:
            db_user.password_hash = get_password_hash(user_update.password)
            
        if user_update.subscription_tier is not None:
            db_user.subscription_tier = user_update.subscription_tier
            
        if user_update.preferences is not None:
            db_user.preferences = user_update.preferences
        
        db.commit()
        db.refresh(db_user)
        
        return db_user
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str):
        """Authenticate a user"""
        user = UserService.get_user_by_email(db, email)
        
        if not user:
            return False
        
        if not verify_password(password, user.password_hash):
            return False
        
        return user
    
    @staticmethod
    def create_user_interest(db: Session, interest_create: UserInterestCreate):
        """Create or update user interests"""
        # Check if user exists
        user = db.query(User).filter(User.id == interest_create.user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Check if user already has interests
        existing_interest = db.query(UserInterest).filter(
            UserInterest.user_id == interest_create.user_id
        ).first()
        
        if existing_interest:
            # Update existing interests
            if interest_create.categories is not None:
                existing_interest.categories = interest_create.categories
            if interest_create.regions is not None:
                existing_interest.regions = interest_create.regions
            if interest_create.topics is not None:
                existing_interest.topics = interest_create.topics
            
            db.commit()
            db.refresh(existing_interest)
            return existing_interest
        else:
            # Create new interests
            db_interest = UserInterest(
                id=str(uuid.uuid4()),
                user_id=interest_create.user_id,
                categories=interest_create.categories,
                regions=interest_create.regions,
                topics=interest_create.topics
            )
            
            db.add(db_interest)
            db.commit()
            db.refresh(db_interest)
            
            return db_interest
    
    @staticmethod
    def get_user_interest(db: Session, user_id: uuid.UUID):
        """Get user interests"""
        return db.query(UserInterest).filter(UserInterest.user_id == user_id).first()
    
    @staticmethod
    def update_user_interest(db: Session, user_id: uuid.UUID, interest_update: UserInterestUpdate):
        """Update user interests"""
        db_interest = db.query(UserInterest).filter(UserInterest.user_id == user_id).first()
        
        if not db_interest:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User interests not found"
            )
        
        # Update fields if provided
        if interest_update.categories is not None:
            db_interest.categories = interest_update.categories
        if interest_update.regions is not None:
            db_interest.regions = interest_update.regions
        if interest_update.topics is not None:
            db_interest.topics = interest_update.topics
        
        db.commit()
        db.refresh(db_interest)
        
        return db_interest

