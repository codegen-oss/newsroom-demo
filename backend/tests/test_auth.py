import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from services import UserService
from schemas import UserCreate

def test_register_user(client: TestClient, db: Session):
    """Test user registration"""
    response = client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "display_name": "Test User",
            "password": "password123"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["display_name"] == "Test User"
    assert "id" in data
    assert "password_hash" not in data

def test_register_duplicate_email(client: TestClient, db: Session):
    """Test registering with an email that's already in use"""
    # Create a user first
    user_create = UserCreate(
        email="test@example.com",
        display_name="Test User",
        password="password123"
    )
    UserService.create_user(db, user_create)
    
    # Try to register with the same email
    response = client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "display_name": "Another User",
            "password": "password456"
        }
    )
    
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]

def test_login(client: TestClient, db: Session):
    """Test user login"""
    # Create a user first
    user_create = UserCreate(
        email="test@example.com",
        display_name="Test User",
        password="password123"
    )
    UserService.create_user(db, user_create)
    
    # Login
    response = client.post(
        "/api/auth/token",
        data={
            "username": "test@example.com",
            "password": "password123"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials(client: TestClient, db: Session):
    """Test login with invalid credentials"""
    # Create a user first
    user_create = UserCreate(
        email="test@example.com",
        display_name="Test User",
        password="password123"
    )
    UserService.create_user(db, user_create)
    
    # Login with wrong password
    response = client.post(
        "/api/auth/token",
        data={
            "username": "test@example.com",
            "password": "wrongpassword"
        }
    )
    
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]

