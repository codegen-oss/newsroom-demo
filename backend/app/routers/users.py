from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database.database import get_db
from ..models.user import User
from ..models.user_interest import UserInterest
from ..schemas.user import UserCreate, UserUpdate, UserResponse
from ..schemas.user_interest import UserInterestCreate, UserInterestUpdate, UserInterestResponse
from ..auth.auth import get_current_user

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Update user fields if provided
    if user_update.display_name is not None:
        current_user.display_name = user_update.display_name
    if user_update.subscription_tier is not None:
        current_user.subscription_tier = user_update.subscription_tier
    if user_update.preferences is not None:
        current_user.preferences = user_update.preferences
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/interests", response_model=UserInterestResponse)
async def get_user_interests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    interests = db.query(UserInterest).filter(UserInterest.user_id == current_user.id).first()
    if not interests:
        raise HTTPException(status_code=404, detail="User interests not found")
    return interests

@router.post("/interests", response_model=UserInterestResponse)
async def create_user_interests(
    interests: UserInterestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if interests already exist
    existing_interests = db.query(UserInterest).filter(UserInterest.user_id == current_user.id).first()
    if existing_interests:
        raise HTTPException(status_code=400, detail="User interests already exist, use PUT to update")
    
    # Create new interests
    new_interests = UserInterest(
        user_id=current_user.id,
        categories=interests.categories,
        regions=interests.regions,
        topics=interests.topics
    )
    
    db.add(new_interests)
    db.commit()
    db.refresh(new_interests)
    return new_interests

@router.put("/interests", response_model=UserInterestResponse)
async def update_user_interests(
    interests_update: UserInterestUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get existing interests
    existing_interests = db.query(UserInterest).filter(UserInterest.user_id == current_user.id).first()
    if not existing_interests:
        raise HTTPException(status_code=404, detail="User interests not found")
    
    # Update fields if provided
    if interests_update.categories is not None:
        existing_interests.categories = interests_update.categories
    if interests_update.regions is not None:
        existing_interests.regions = interests_update.regions
    if interests_update.topics is not None:
        existing_interests.topics = interests_update.topics
    
    db.commit()
    db.refresh(existing_interests)
    return existing_interests

