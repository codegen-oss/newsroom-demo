from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from db import get_db
from models import User
from schemas import (
    UserResponse, 
    UserUpdate, 
    UserInterestCreate, 
    UserInterestUpdate, 
    UserInterestResponse
)
from services import UserService
from utils.auth import get_current_active_user

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    """Get current user profile"""
    return current_user

@router.put("/me", response_model=UserResponse)
def update_user_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user profile"""
    return UserService.update_user(db, current_user.id, user_update)

@router.post("/me/interests", response_model=UserInterestResponse)
def create_user_interests(
    interest_create: UserInterestCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create or update current user interests"""
    # Ensure the user_id matches the current user
    if interest_create.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User ID in request does not match authenticated user"
        )
    
    return UserService.create_user_interest(db, interest_create)

@router.get("/me/interests", response_model=UserInterestResponse)
def read_user_interests(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user interests"""
    interests = UserService.get_user_interest(db, current_user.id)
    
    if not interests:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User interests not found"
        )
    
    return interests

@router.put("/me/interests", response_model=UserInterestResponse)
def update_user_interests(
    interest_update: UserInterestUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user interests"""
    return UserService.update_user_interest(db, current_user.id, interest_update)

