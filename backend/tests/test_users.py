import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from services import UserService
from schemas import UserCreate, UserInterestCreate
from utils.auth import create_access_token

def create_test_user(db: Session):
    """Helper function to create a test user"""
    user_create = UserCreate(
        email="test@example.com",
        display_name="Test User",
        password="password123"
    )
    return UserService.create_user(db, user_create)

def get_auth_header(user_id: uuid.UUID):
    """Helper function to get authorization header"""
    access_token = create_access_token(data={"sub": str(user_id)})
    return {"Authorization": f"Bearer {access_token}"}

def test_get_current_user(client: TestClient, db: Session):
    """Test getting the current user profile"""
    # Create a user and get auth header
    user = create_test_user(db)
    headers = get_auth_header(user.id)
    
    # Get current user profile
    response = client.get(
        "/api/users/me",
        headers=headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["display_name"] == "Test User"
    assert data["subscription_tier"] == "free"

def test_update_current_user(client: TestClient, db: Session):
    """Test updating the current user profile"""
    # Create a user and get auth header
    user = create_test_user(db)
    headers = get_auth_header(user.id)
    
    # Update user profile
    response = client.put(
        "/api/users/me",
        headers=headers,
        json={
            "display_name": "Updated Name",
            "subscription_tier": "individual"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["display_name"] == "Updated Name"
    assert data["subscription_tier"] == "individual"
    assert data["email"] == "test@example.com"  # Unchanged field

def test_create_user_interests(client: TestClient, db: Session):
    """Test creating user interests"""
    # Create a user and get auth header
    user = create_test_user(db)
    headers = get_auth_header(user.id)
    
    # Create user interests
    response = client.post(
        "/api/users/me/interests",
        headers=headers,
        json={
            "user_id": str(user.id),
            "categories": ["news", "technology"],
            "regions": ["US", "EU"],
            "topics": ["AI", "Climate"]
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["categories"] == ["news", "technology"]
    assert data["regions"] == ["US", "EU"]
    assert data["topics"] == ["AI", "Climate"]
    assert data["user_id"] == str(user.id)

def test_get_user_interests(client: TestClient, db: Session):
    """Test getting user interests"""
    # Create a user and get auth header
    user = create_test_user(db)
    headers = get_auth_header(user.id)
    
    # Create user interests first
    interest_create = UserInterestCreate(
        user_id=user.id,
        categories=["news", "technology"],
        regions=["US", "EU"],
        topics=["AI", "Climate"]
    )
    UserService.create_user_interest(db, interest_create)
    
    # Get user interests
    response = client.get(
        "/api/users/me/interests",
        headers=headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["categories"] == ["news", "technology"]
    assert data["regions"] == ["US", "EU"]
    assert data["topics"] == ["AI", "Climate"]
    assert data["user_id"] == str(user.id)

def test_update_user_interests(client: TestClient, db: Session):
    """Test updating user interests"""
    # Create a user and get auth header
    user = create_test_user(db)
    headers = get_auth_header(user.id)
    
    # Create user interests first
    interest_create = UserInterestCreate(
        user_id=user.id,
        categories=["news", "technology"],
        regions=["US", "EU"],
        topics=["AI", "Climate"]
    )
    UserService.create_user_interest(db, interest_create)
    
    # Update user interests
    response = client.put(
        "/api/users/me/interests",
        headers=headers,
        json={
            "categories": ["business", "health"],
            "topics": ["Blockchain"]
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["categories"] == ["business", "health"]
    assert data["regions"] == ["US", "EU"]  # Unchanged field
    assert data["topics"] == ["Blockchain"]
    assert data["user_id"] == str(user.id)

