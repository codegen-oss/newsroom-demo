"""
User management router for the News Room application.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Body, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from ...db.postgres.connection import get_db
from ...db.postgres.models import User
from ...auth.jwt import get_current_active_user
from ...auth.password import get_password_hash, verify_password
from ...db.mongodb.connection import user_history_collection
from ...utils.security import is_valid_password

router = APIRouter()

# User schemas
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    is_active: bool

class UserUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    current_password: Optional[str] = None

class UserInterest(BaseModel):
    category: str
    level: int  # 1-5 scale

# Get current user
@router.get("/me", response_model=UserResponse)
async def get_current_user(
    current_user: User = Depends(get_current_active_user)
):
    return current_user

# Update current user
@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdateRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Update full name if provided
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    
    # Update email if provided
    if user_update.email is not None:
        # Check if email already exists
        if db.query(User).filter(User.email == user_update.email).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        current_user.email = user_update.email
    
    # Update password if provided
    if user_update.password is not None:
        # Verify current password
        if not user_update.current_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is required to update password"
            )
        
        if not verify_password(user_update.current_password, current_user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect current password"
            )
        
        # Validate new password
        if not is_valid_password(user_update.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 8 characters and include uppercase, lowercase, digit, and special character"
            )
        
        current_user.hashed_password = get_password_hash(user_update.password)
    
    # Save changes
    db.commit()
    db.refresh(current_user)
    
    return current_user

# Get user interests
@router.get("/me/interests", response_model=List[UserInterest])
async def get_user_interests(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # In a real implementation, you would fetch interests from the database
    # For now, we'll return a placeholder
    return [
        {"category": "technology", "level": 5},
        {"category": "business", "level": 3},
        {"category": "science", "level": 4}
    ]

# Update user interests
@router.put("/me/interests", response_model=List[UserInterest])
async def update_user_interests(
    interests: List[UserInterest],
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # In a real implementation, you would update interests in the database
    # For now, we'll just return the provided interests
    return interests

# Get user history
@router.get("/me/history")
async def get_user_history(
    current_user: User = Depends(get_current_active_user),
    limit: int = Query(10, ge=1, le=100),
    skip: int = Query(0, ge=0)
):
    # Fetch user history from MongoDB
    history = await user_history_collection.find(
        {"user_id": current_user.id}
    ).sort("timestamp", -1).skip(skip).limit(limit).to_list(length=limit)
    
    return history

# Delete user history
@router.delete("/me/history")
async def delete_user_history(
    current_user: User = Depends(get_current_active_user),
    history_id: Optional[str] = Query(None)
):
    if history_id:
        # Delete specific history item
        result = await user_history_collection.delete_one({
            "user_id": current_user.id,
            "_id": history_id
        })
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="History item not found"
            )
    else:
        # Delete all history for user
        result = await user_history_collection.delete_many({
            "user_id": current_user.id
        })
    
    return {"message": "History deleted successfully"}

