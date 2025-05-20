from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.security import get_password_hash
from app.db.session import get_db
from app.models.user import User
from app.models.user_interest import UserInterest
from app.schemas.user import User as UserSchema, UserUpdate
from app.schemas.user_interest import UserInterest as UserInterestSchema, UserInterestCreate, UserInterestUpdate

router = APIRouter()

@router.get("/", response_model=List[UserSchema])
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Retrieve users.
    """
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}", response_model=UserSchema)
def read_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get a specific user by id.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user

@router.put("/me", response_model=UserSchema)
def update_user_me(
    *,
    db: Session = Depends(get_db),
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update own user.
    """
    if user_in.password:
        password_hash = get_password_hash(user_in.password)
        current_user.password_hash = password_hash
    
    if user_in.email is not None:
        current_user.email = user_in.email
    
    if user_in.display_name is not None:
        current_user.display_name = user_in.display_name
    
    if user_in.subscription_tier is not None:
        current_user.subscription_tier = user_in.subscription_tier
    
    if user_in.preferences is not None:
        current_user.preferences = user_in.preferences
    
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.get("/me/interests", response_model=UserInterestSchema)
def read_user_interests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get current user's interests.
    """
    interests = db.query(UserInterest).filter(UserInterest.user_id == current_user.id).first()
    if not interests:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User interests not found",
        )
    return interests

@router.post("/me/interests", response_model=UserInterestSchema)
def create_user_interests(
    *,
    db: Session = Depends(get_db),
    interests_in: UserInterestCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create interests for current user.
    """
    # Check if interests already exist
    existing_interests = db.query(UserInterest).filter(UserInterest.user_id == current_user.id).first()
    if existing_interests:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User interests already exist. Use PUT to update.",
        )
    
    # Create new interests
    interests = UserInterest(
        user_id=current_user.id,
        categories=interests_in.categories or [],
        regions=interests_in.regions or [],
        topics=interests_in.topics or [],
    )
    db.add(interests)
    db.commit()
    db.refresh(interests)
    
    return interests

@router.put("/me/interests", response_model=UserInterestSchema)
def update_user_interests(
    *,
    db: Session = Depends(get_db),
    interests_in: UserInterestUpdate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update interests for current user.
    """
    interests = db.query(UserInterest).filter(UserInterest.user_id == current_user.id).first()
    if not interests:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User interests not found. Use POST to create.",
        )
    
    if interests_in.categories is not None:
        interests.categories = interests_in.categories
    
    if interests_in.regions is not None:
        interests.regions = interests_in.regions
    
    if interests_in.topics is not None:
        interests.topics = interests_in.topics
    
    db.add(interests)
    db.commit()
    db.refresh(interests)
    
    return interests

