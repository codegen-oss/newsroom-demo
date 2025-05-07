from fastapi import APIRouter, Depends, HTTPException, status, Path, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database.database import get_db
from ..models.user import User
from ..models.user_interest import UserInterest
from ..schemas.user import UserCreate, UserUpdate, UserResponse
from ..schemas.user_interest import UserInterestCreate, UserInterestUpdate, UserInterestResponse
from ..auth.auth import get_current_user, get_current_active_user

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """
    Get the current authenticated user's profile information.
    """
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update the current authenticated user's profile information.
    """
    # Validate subscription tier if provided
    if user_update.subscription_tier is not None:
        valid_tiers = ["free", "individual", "organization"]
        if user_update.subscription_tier not in valid_tiers:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid subscription tier. Must be one of: {', '.join(valid_tiers)}"
            )
    
    try:
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
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user: {str(e)}"
        )

@router.get("/interests", response_model=UserInterestResponse)
async def get_user_interests(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get the current authenticated user's interests.
    """
    interests = db.query(UserInterest).filter(UserInterest.user_id == current_user.id).first()
    if not interests:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User interests not found"
        )
    return interests

@router.post("/interests", response_model=UserInterestResponse, status_code=status.HTTP_201_CREATED)
async def create_user_interests(
    interests: UserInterestCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create interests for the current authenticated user.
    """
    # Check if interests already exist
    existing_interests = db.query(UserInterest).filter(UserInterest.user_id == current_user.id).first()
    if existing_interests:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="User interests already exist, use PUT to update"
        )
    
    # Create new interests
    new_interests = UserInterest(
        user_id=current_user.id,
        categories=interests.categories,
        regions=interests.regions,
        topics=interests.topics
    )
    
    try:
        db.add(new_interests)
        db.commit()
        db.refresh(new_interests)
        return new_interests
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user interests: {str(e)}"
        )

@router.put("/interests", response_model=UserInterestResponse)
async def update_user_interests(
    interests_update: UserInterestUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update interests for the current authenticated user.
    """
    # Get existing interests
    existing_interests = db.query(UserInterest).filter(UserInterest.user_id == current_user.id).first()
    if not existing_interests:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User interests not found"
        )
    
    try:
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
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user interests: {str(e)}"
        )

@router.delete("/interests", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_interests(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete interests for the current authenticated user.
    """
    # Get existing interests
    existing_interests = db.query(UserInterest).filter(UserInterest.user_id == current_user.id).first()
    if not existing_interests:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User interests not found"
        )
    
    try:
        db.delete(existing_interests)
        db.commit()
        return None
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete user interests: {str(e)}"
        )
