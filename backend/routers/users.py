from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from database import get_db
from models import User, UserInterest
from schemas.user import (
    UserCreate, UserUpdate, UserResponse, UserWithInterests,
    UserInterestCreate, UserInterestUpdate, UserInterestResponse
)
from auth import get_current_user, get_password_hash

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

# User endpoints
@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        password_hash=hashed_password,
        display_name=user.display_name,
        subscription_tier="free"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/me", response_model=UserWithInterests)
def read_users_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return current_user

@router.put("/me", response_model=UserResponse)
def update_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_update.email is not None:
        current_user.email = user_update.email
    if user_update.display_name is not None:
        current_user.display_name = user_update.display_name
    if user_update.password is not None:
        current_user.password_hash = get_password_hash(user_update.password)
    if user_update.subscription_tier is not None:
        current_user.subscription_tier = user_update.subscription_tier
    
    db.commit()
    db.refresh(current_user)
    return current_user

# User interests endpoints
@router.post("/me/interests", response_model=UserInterestResponse)
def create_user_interests(
    interests: UserInterestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user already has interests
    db_interests = db.query(UserInterest).filter(UserInterest.user_id == current_user.id).first()
    if db_interests:
        raise HTTPException(status_code=400, detail="User interests already exist, use PUT to update")
    
    db_interests = UserInterest(
        user_id=current_user.id,
        categories=interests.categories,
        regions=interests.regions,
        topics=interests.topics
    )
    db.add(db_interests)
    db.commit()
    db.refresh(db_interests)
    return db_interests

@router.get("/me/interests", response_model=UserInterestResponse)
def read_user_interests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_interests = db.query(UserInterest).filter(UserInterest.user_id == current_user.id).first()
    if db_interests is None:
        raise HTTPException(status_code=404, detail="User interests not found")
    return db_interests

@router.put("/me/interests", response_model=UserInterestResponse)
def update_user_interests(
    interests_update: UserInterestUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_interests = db.query(UserInterest).filter(UserInterest.user_id == current_user.id).first()
    if db_interests is None:
        raise HTTPException(status_code=404, detail="User interests not found")
    
    if interests_update.categories is not None:
        db_interests.categories = interests_update.categories
    if interests_update.regions is not None:
        db_interests.regions = interests_update.regions
    if interests_update.topics is not None:
        db_interests.topics = interests_update.topics
    
    db.commit()
    db.refresh(db_interests)
    return db_interests

