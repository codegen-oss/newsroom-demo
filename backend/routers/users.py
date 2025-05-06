from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import User, UserInterest
from ..schemas.user import (
    User as UserSchema,
    UserUpdate,
    UserInterest as UserInterestSchema,
    UserInterestCreate,
    UserInterestUpdate
)
from ..utils.auth import get_current_user, get_password_hash

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserSchema)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return current_user

@router.put("/me", response_model=UserSchema)
def update_user_profile(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update current user profile"""
    # Update user fields if provided
    if user_update.email is not None:
        # Check if email is already taken
        existing_user = db.query(User).filter(User.email == user_update.email).first()
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        current_user.email = user_update.email
    
    if user_update.display_name is not None:
        current_user.display_name = user_update.display_name
    
    if user_update.subscription_tier is not None:
        current_user.subscription_tier = user_update.subscription_tier
    
    if user_update.preferences is not None:
        current_user.preferences = user_update.preferences
    
    if user_update.password is not None:
        current_user.password_hash = get_password_hash(user_update.password)
    
    # Save changes
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.get("/me/interests", response_model=List[UserInterestSchema])
def get_user_interests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user interests"""
    return db.query(UserInterest).filter(UserInterest.user_id == current_user.id).all()

@router.post("/me/interests", response_model=UserInterestSchema)
def create_user_interest(
    interest: UserInterestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new interest for the current user"""
    db_interest = UserInterest(
        user_id=current_user.id,
        categories=interest.categories,
        regions=interest.regions,
        topics=interest.topics
    )
    
    db.add(db_interest)
    db.commit()
    db.refresh(db_interest)
    
    return db_interest

@router.put("/me/interests/{interest_id}", response_model=UserInterestSchema)
def update_user_interest(
    interest_id: str,
    interest_update: UserInterestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a user interest"""
    # Find the interest
    db_interest = db.query(UserInterest).filter(
        UserInterest.id == interest_id,
        UserInterest.user_id == current_user.id
    ).first()
    
    if not db_interest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interest not found"
        )
    
    # Update fields
    if interest_update.categories is not None:
        db_interest.categories = interest_update.categories
    
    if interest_update.regions is not None:
        db_interest.regions = interest_update.regions
    
    if interest_update.topics is not None:
        db_interest.topics = interest_update.topics
    
    # Save changes
    db.commit()
    db.refresh(db_interest)
    
    return db_interest

@router.delete("/me/interests/{interest_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_interest(
    interest_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a user interest"""
    # Find the interest
    db_interest = db.query(UserInterest).filter(
        UserInterest.id == interest_id,
        UserInterest.user_id == current_user.id
    ).first()
    
    if not db_interest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interest not found"
        )
    
    # Delete the interest
    db.delete(db_interest)
    db.commit()
    
    return None

