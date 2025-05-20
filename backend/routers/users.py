"""
User router for the News Room API.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from database import get_db, User, UserInterest
from backend.models.users import UserResponse, UserUpdate, UserInterestCreate, UserInterestResponse, UserInterestUpdate
from backend.routers.auth import get_current_user

router = APIRouter()

@router.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/users/me", response_model=UserResponse)
async def update_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Update user fields if provided
    if user_update.email is not None:
        current_user.email = user_update.email
    if user_update.display_name is not None:
        current_user.display_name = user_update.display_name
    if user_update.subscription_tier is not None:
        current_user.subscription_tier = user_update.subscription_tier
    if user_update.preferences is not None:
        current_user.preferences = user_update.preferences
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/users/me/interests", response_model=List[UserInterestResponse])
async def read_user_interests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(UserInterest).filter(UserInterest.user_id == current_user.id).all()

@router.post("/users/me/interests", response_model=UserInterestResponse)
async def create_user_interest(
    interest: UserInterestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
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

@router.put("/users/me/interests/{interest_id}", response_model=UserInterestResponse)
async def update_user_interest(
    interest_id: str,
    interest_update: UserInterestUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_interest = db.query(UserInterest).filter(
        UserInterest.id == interest_id,
        UserInterest.user_id == current_user.id
    ).first()
    
    if db_interest is None:
        raise HTTPException(status_code=404, detail="Interest not found")
    
    # Update interest fields
    db_interest.categories = interest_update.categories
    db_interest.regions = interest_update.regions
    db_interest.topics = interest_update.topics
    
    db.commit()
    db.refresh(db_interest)
    return db_interest

@router.delete("/users/me/interests/{interest_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_interest(
    interest_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_interest = db.query(UserInterest).filter(
        UserInterest.id == interest_id,
        UserInterest.user_id == current_user.id
    ).first()
    
    if db_interest is None:
        raise HTTPException(status_code=404, detail="Interest not found")
    
    db.delete(db_interest)
    db.commit()
    return None

