from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from typing import Optional
from pydantic import BaseModel, EmailStr

from ...utils.auth.jwt import (
    create_access_token,
    create_refresh_token,
    verify_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from ...utils.auth.password import verify_password, get_password_hash
from ...utils.database import mongo_db, redis_client
from ...models.user.user_model import UserCreate, UserResponse

router = APIRouter()


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: Optional[str] = None


class RefreshToken(BaseModel):
    refresh_token: str


class ForgotPassword(BaseModel):
    email: EmailStr


class ResetPassword(BaseModel):
    token: str
    new_password: str


@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    # Check if user already exists
    existing_user = await mongo_db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )

    # Hash the password
    hashed_password = get_password_hash(user_data.password)

    # Create new user
    new_user = {
        "email": user_data.email,
        "password_hash": hashed_password,
        "display_name": user_data.display_name,
        "profile_image": user_data.profile_image,
        "subscription_tier": "free",
        "subscription_status": "active",
        "subscription_expiry": None,
        "created_at": None,  # Will be set by MongoDB
        "last_login": None,
        "preferences": {
            "theme": "light",
            "notifications": True,
            "email_frequency": "daily",
        },
    }

    # Insert user into database
    result = await mongo_db.users.insert_one(new_user)
    
    # Retrieve the created user
    created_user = await mongo_db.users.find_one({"_id": result.inserted_id})
    
    # Convert MongoDB _id to string for the response
    created_user["id"] = str(created_user["_id"])
    del created_user["_id"]
    del created_user["password_hash"]
    
    return created_user


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Find user by email
    user = await mongo_db.users.find_one({"email": form_data.username})
    
    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create token data
    user_id = str(user["_id"])
    token_data = {
        "sub": user_id,
        "tier": user["subscription_tier"],
    }
    
    # Create tokens
    access_token = create_access_token(
        data=token_data,
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    refresh_token = create_refresh_token(data=token_data)
    
    # Store refresh token in Redis with user ID as key
    redis_client.setex(
        f"refresh_token:{user_id}",
        timedelta(days=7).total_seconds(),
        refresh_token,
    )
    
    # Update last login time
    await mongo_db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": None}}  # Will be set to current time by MongoDB
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_token_data: RefreshToken):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Verify the refresh token
    token_data = verify_token(refresh_token_data.refresh_token, credentials_exception)
    user_id = token_data.user_id
    
    # Check if the refresh token is in Redis
    stored_token = redis_client.get(f"refresh_token:{user_id}")
    if not stored_token or stored_token.decode() != refresh_token_data.refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user data to include in the new token
    user = await mongo_db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Create new tokens
    token_data = {
        "sub": user_id,
        "tier": user["subscription_tier"],
    }
    
    access_token = create_access_token(data=token_data)
    new_refresh_token = create_refresh_token(data=token_data)
    
    # Update refresh token in Redis
    redis_client.setex(
        f"refresh_token:{user_id}",
        timedelta(days=7).total_seconds(),
        new_refresh_token,
    )
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
    }


@router.post("/logout")
async def logout(token_data: RefreshToken):
    try:
        # Verify the refresh token
        token_payload = verify_token(token_data.refresh_token, HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        ))
        
        # Delete the refresh token from Redis
        redis_client.delete(f"refresh_token:{token_payload.user_id}")
        
        return {"detail": "Successfully logged out"}
    except Exception:
        # Even if token verification fails, we consider it a successful logout
        return {"detail": "Successfully logged out"}


@router.post("/forgot-password")
async def forgot_password(forgot_pwd: ForgotPassword):
    # Check if user exists
    user = await mongo_db.users.find_one({"email": forgot_pwd.email})
    if not user:
        # Don't reveal that the user doesn't exist for security reasons
        return {"detail": "If your email is registered, you will receive a password reset link"}
    
    # Generate a password reset token
    user_id = str(user["_id"])
    token_data = {"sub": user_id, "purpose": "password_reset"}
    reset_token = create_access_token(
        data=token_data,
        expires_delta=timedelta(hours=1),
    )
    
    # Store the token in Redis
    redis_client.setex(
        f"password_reset:{user_id}",
        timedelta(hours=1).total_seconds(),
        reset_token,
    )
    
    # In a real application, send an email with the reset link
    # For now, just return the token (this would not happen in production)
    return {"detail": "If your email is registered, you will receive a password reset link", "token": reset_token}


@router.post("/reset-password")
async def reset_password(reset_data: ResetPassword):
    credentials_exception = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid or expired token",
    )
    
    try:
        # Verify the token
        token_data = verify_token(reset_data.token, credentials_exception)
        user_id = token_data.user_id
        
        # Check if the token is in Redis
        stored_token = redis_client.get(f"password_reset:{user_id}")
        if not stored_token or stored_token.decode() != reset_data.token:
            raise credentials_exception
        
        # Hash the new password
        hashed_password = get_password_hash(reset_data.new_password)
        
        # Update the user's password
        result = await mongo_db.users.update_one(
            {"_id": user_id},
            {"$set": {"password_hash": hashed_password}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        
        # Delete the reset token from Redis
        redis_client.delete(f"password_reset:{user_id}")
        
        return {"detail": "Password has been reset successfully"}
    except Exception as e:
        raise credentials_exception

