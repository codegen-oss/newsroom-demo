from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, UserInterest
from app.schemas import User as UserSchema, UserCreate, UserUpdate, UserInterest as UserInterestSchema
from app.schemas import UserInterestCreate, UserInterestUpdate, Token
from app.auth.auth import authenticate_user, create_access_token, get_current_active_user, get_password_hash
from datetime import timedelta

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=UserSchema)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        password_hash=hashed_password,
        display_name=user.display_name,
        subscription_tier=user.subscription_tier
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserSchema)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.put("/{user_id}", response_model=UserSchema)
def update_user(
    user_id: str,
    user: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Only allow users to update their own profile
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this user")
    
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update user fields
    if user.display_name is not None:
        db_user.display_name = user.display_name
    if user.subscription_tier is not None:
        db_user.subscription_tier = user.subscription_tier
    
    db.commit()
    db.refresh(db_user)
    return db_user

# User Interests endpoints
@router.post("/interests", response_model=UserInterestSchema)
def create_user_interest(
    interest: UserInterestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Only allow users to create interests for themselves
    if current_user.id != interest.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to create interests for this user")
    
    # Check if user already has interests
    existing_interest = db.query(UserInterest).filter(UserInterest.user_id == interest.user_id).first()
    if existing_interest:
        raise HTTPException(status_code=400, detail="User already has interests defined")
    
    db_interest = UserInterest(
        user_id=interest.user_id,
        categories=interest.categories,
        regions=interest.regions,
        topics=interest.topics
    )
    db.add(db_interest)
    db.commit()
    db.refresh(db_interest)
    return db_interest

@router.get("/interests", response_model=List[UserInterestSchema])
def read_user_interests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    interests = db.query(UserInterest).filter(UserInterest.user_id == current_user.id).all()
    return interests

@router.put("/interests/{interest_id}", response_model=UserInterestSchema)
def update_user_interest(
    interest_id: str,
    interest: UserInterestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_interest = db.query(UserInterest).filter(UserInterest.id == interest_id).first()
    if not db_interest:
        raise HTTPException(status_code=404, detail="Interest not found")
    
    # Only allow users to update their own interests
    if db_interest.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this interest")
    
    # Update interest fields
    db_interest.categories = interest.categories
    db_interest.regions = interest.regions
    db_interest.topics = interest.topics
    
    db.commit()
    db.refresh(db_interest)
    return db_interest

