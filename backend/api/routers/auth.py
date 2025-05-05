"""
Authentication router for the News Room application.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta

from ...db.postgres.connection import get_db
from ...db.postgres.models import User
from ...auth.jwt import create_access_token, create_refresh_token, Token, verify_token
from ...auth.password import verify_password, get_password_hash
from ...utils.security import generate_reset_token, is_token_expired, is_valid_password, is_valid_email
from ...db.redis.connection import set_cache, get_cache, delete_cache

router = APIRouter()

# User registration
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    email: str = Body(...),
    username: str = Body(...),
    password: str = Body(...),
    full_name: str = Body(...),
    db: Session = Depends(get_db)
):
    # Check if email already exists
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    if db.query(User).filter(User.username == username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Validate email format
    if not is_valid_email(email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format"
        )
    
    # Validate password strength
    if not is_valid_password(password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters and include uppercase, lowercase, digit, and special character"
        )
    
    # Create new user
    hashed_password = get_password_hash(password)
    new_user = User(
        email=email,
        username=username,
        hashed_password=hashed_password,
        full_name=full_name
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }

# User login
@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Find user by username
    user = db.query(User).filter(User.username == form_data.username).first()
    
    # Check if user exists and password is correct
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access and refresh tokens
    access_token = create_access_token(
        data={"sub": user.username}
    )
    refresh_token = create_refresh_token(
        data={"sub": user.username}
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

# Refresh token
@router.post("/refresh", response_model=Token)
async def refresh_token(
    refresh_token: str = Body(...),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Verify refresh token
    token_data = await verify_token(refresh_token, credentials_exception)
    
    # Find user by username
    user = db.query(User).filter(User.username == token_data.username).first()
    
    # Check if user exists and is active
    if not user or not user.is_active:
        raise credentials_exception
    
    # Create new access token
    access_token = create_access_token(
        data={"sub": user.username}
    )
    
    # Create new refresh token
    new_refresh_token = create_refresh_token(
        data={"sub": user.username}
    )
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

# Logout
@router.post("/logout")
async def logout(
    refresh_token: str = Body(...)
):
    # In a real implementation, you would blacklist the token
    # For now, we'll just return a success message
    return {"message": "Logged out successfully"}

# Forgot password
@router.post("/forgot-password")
async def forgot_password(
    email: str = Body(...),
    db: Session = Depends(get_db)
):
    # Find user by email
    user = db.query(User).filter(User.email == email).first()
    
    # Always return success to prevent email enumeration
    if not user:
        return {"message": "If your email is registered, you will receive a password reset link"}
    
    # Generate reset token
    reset_token = generate_reset_token()
    
    # Store token in Redis with expiration (24 hours)
    await set_cache(f"reset_token:{reset_token}", str(user.id), 86400)
    
    # In a real implementation, you would send an email with the reset link
    # For now, we'll just return the token
    return {
        "message": "If your email is registered, you will receive a password reset link",
        "reset_token": reset_token  # Remove this in production
    }

# Reset password
@router.post("/reset-password")
async def reset_password(
    token: str = Body(...),
    new_password: str = Body(...),
    db: Session = Depends(get_db)
):
    # Get user ID from Redis
    user_id = await get_cache(f"reset_token:{token}")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )
    
    # Validate password strength
    if not is_valid_password(new_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters and include uppercase, lowercase, digit, and special character"
        )
    
    # Find user by ID
    user = db.query(User).filter(User.id == int(user_id)).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not found"
        )
    
    # Update password
    user.hashed_password = get_password_hash(new_password)
    db.commit()
    
    # Delete token from Redis
    await delete_cache(f"reset_token:{token}")
    
    return {"message": "Password reset successfully"}

