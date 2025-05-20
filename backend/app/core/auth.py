from typing import Optional
from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User
from app.schemas.token import TokenPayload
from app.models.enums import SubscriptionTier, AccessTier

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
        if token_data.sub is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == token_data.sub).first()
    if user is None:
        raise credentials_exception
    return user

def check_article_access(user: User, article_access_tier: str) -> bool:
    """Check if a user has access to an article based on subscription tier."""
    if article_access_tier == AccessTier.FREE:
        return True
    
    if article_access_tier == AccessTier.PREMIUM:
        return user.subscription_tier in [SubscriptionTier.INDIVIDUAL, SubscriptionTier.ORGANIZATION]
    
    if article_access_tier == AccessTier.ORGANIZATION:
        return user.subscription_tier == SubscriptionTier.ORGANIZATION
    
    return False

