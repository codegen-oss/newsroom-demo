import pytest
from fastapi import HTTPException
from jose import jwt
from datetime import datetime, timedelta

from app.auth.auth import (
    verify_password,
    get_password_hash,
    authenticate_user,
    create_access_token,
    get_current_user
)
from app.database.database import get_db
from app.models.user import User

def test_password_hashing():
    """Test that password hashing and verification works correctly."""
    password = "testpassword123"
    hashed_password = get_password_hash(password)
    
    # Verify that the hash is different from the original password
    assert hashed_password != password
    
    # Verify that the password verification works
    assert verify_password(password, hashed_password) is True
    assert verify_password("wrongpassword", hashed_password) is False

def test_create_access_token():
    """Test that JWT token creation works correctly."""
    data = {"sub": "test@example.com"}
    token = create_access_token(data=data)
    
    # Verify that a token was created
    assert token is not None
    
    # Decode the token and verify the data
    from app.auth.auth import SECRET_KEY, ALGORITHM
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    
    assert payload["sub"] == data["sub"]
    assert "exp" in payload  # Expiration time should be included

def test_authenticate_user(db_session, test_user):
    """Test user authentication with correct and incorrect credentials."""
    # Test with correct credentials
    user = authenticate_user(db_session, test_user.email, "password123")
    assert user is not None
    assert user.email == test_user.email
    
    # Test with incorrect password
    user = authenticate_user(db_session, test_user.email, "wrongpassword")
    assert user is None
    
    # Test with non-existent user
    user = authenticate_user(db_session, "nonexistent@example.com", "password123")
    assert user is None

def test_get_current_user(db_session, token, test_user):
    """Test that the current user can be retrieved from a valid token."""
    # Override the get_db dependency
    def override_get_db():
        yield db_session
    
    # Test with a valid token
    user = get_current_user(token, next(override_get_db()))
    assert user is not None
    assert user.email == test_user.email
    
    # Test with an invalid token
    with pytest.raises(HTTPException) as excinfo:
        get_current_user("invalid_token", next(override_get_db()))
    assert excinfo.value.status_code == 401
    
    # Test with an expired token
    from app.auth.auth import SECRET_KEY, ALGORITHM
    expired_data = {
        "sub": test_user.email,
        "exp": datetime.utcnow() - timedelta(minutes=30)
    }
    expired_token = jwt.encode(expired_data, SECRET_KEY, algorithm=ALGORITHM)
    
    with pytest.raises(HTTPException) as excinfo:
        get_current_user(expired_token, next(override_get_db()))
    assert excinfo.value.status_code == 401

def test_token_endpoint(client, test_user):
    """Test the token endpoint for user login."""
    # Test with correct credentials
    response = client.post(
        "/token",
        data={
            "username": test_user.email,
            "password": "password123"
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"
    
    # Test with incorrect password
    response = client.post(
        "/token",
        data={
            "username": test_user.email,
            "password": "wrongpassword"
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 401
    
    # Test with non-existent user
    response = client.post(
        "/token",
        data={
            "username": "nonexistent@example.com",
            "password": "password123"
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 401

