from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, UserInterest
from app.schemas import (
    UserCreate,
    UserUpdate,
    UserResponse,
    UserInterestCreate,
    UserInterestUpdate,
    UserInterestResponse
)
from app.auth.utils import get_password_hash, get_current_user

router = APIRouter()

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        password_hash=hashed_password,
        display_name=user.display_name,
        subscription_tier=user.subscription_tier,
        preferences=user.preferences
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
def update_user(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_update.display_name is not None:
        current_user.display_name = user_update.display_name
    if user_update.subscription_tier is not None:
        current_user.subscription_tier = user_update.subscription_tier
    if user_update.preferences is not None:
        current_user.preferences = user_update.preferences
    
    db.commit()
    db.refresh(current_user)
    return current_user

# User interests endpoints
@router.post("/me/interests", response_model=UserInterestResponse)
def create_user_interest(
    interest: UserInterestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
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

@router.get("/me/interests", response_model=List[UserInterestResponse])
def read_user_interests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    interests = db.query(UserInterest).filter(UserInterest.user_id == current_user.id).all()
    return interests

@router.put("/me/interests/{interest_id}", response_model=UserInterestResponse)
def update_user_interest(
    interest_id: str,
    interest_update: UserInterestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_interest = db.query(UserInterest).filter(
        UserInterest.id == interest_id,
        UserInterest.user_id == current_user.id
    ).first()
    
    if not db_interest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interest not found"
        )
    
    if interest_update.categories is not None:
        db_interest.categories = interest_update.categories
    if interest_update.regions is not None:
        db_interest.regions = interest_update.regions
    if interest_update.topics is not None:
        db_interest.topics = interest_update.topics
    
    db.commit()
    db.refresh(db_interest)
    return db_interest

