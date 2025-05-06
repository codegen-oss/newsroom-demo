from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import secrets
import string
from datetime import datetime, timedelta

from app.database import get_db
from app.models.models import User
from app.utils.security import get_password_hash

router = APIRouter(tags=["password-reset"])

# In a real application, you would store these tokens in a database
# with expiration times and associate them with users
# For this demo, we'll use an in-memory dictionary
reset_tokens = {}

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordReset(BaseModel):
    token: str
    new_password: str

@router.post("/password-reset/request")
def request_password_reset(
    reset_request: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    """
    Request a password reset token.
    In a real application, this would send an email with the token.
    """
    # Find user by email
    user = db.query(User).filter(User.email == reset_request.email).first()
    if not user:
        # Don't reveal that the email doesn't exist
        return {"message": "If your email is registered, you will receive a password reset link"}
    
    # Generate a secure random token
    alphabet = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(alphabet) for _ in range(64))
    
    # Store the token with expiration time (24 hours)
    reset_tokens[token] = {
        "user_id": user.id,
        "expires_at": datetime.utcnow() + timedelta(hours=24)
    }
    
    # In a real application, send an email with the reset link
    # For this demo, we'll just return the token
    return {
        "message": "If your email is registered, you will receive a password reset link",
        "token": token  # In a real app, don't return this, send it via email
    }

@router.post("/password-reset/confirm")
def confirm_password_reset(
    reset_data: PasswordReset,
    db: Session = Depends(get_db)
):
    """
    Reset password using the token.
    """
    # Check if token exists and is valid
    token_data = reset_tokens.get(reset_data.token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )
    
    # Check if token is expired
    if datetime.utcnow() > token_data["expires_at"]:
        # Remove expired token
        del reset_tokens[reset_data.token]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token has expired"
        )
    
    # Get user
    user = db.query(User).filter(User.id == token_data["user_id"]).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not found"
        )
    
    # Update password
    user.hashed_password = get_password_hash(reset_data.new_password)
    db.commit()
    
    # Remove used token
    del reset_tokens[reset_data.token]
    
    return {"message": "Password has been reset successfully"}

