import pytest
from fastapi import HTTPException

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

def test_get_users(authorized_client):
    """Test retrieving a list of users."""
    response = authorized_client.get("/users/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    # At least the test user should be in the list
    assert len(response.json()) >= 1

def test_get_current_user(authorized_client, test_user):
    """Test retrieving the current user's information."""
    response = authorized_client.get("/users/me")
    assert response.status_code == 200
    assert response.json()["email"] == test_user.email
    assert response.json()["display_name"] == test_user.display_name
    assert response.json()["subscription_tier"] == test_user.subscription_tier

def test_get_user_by_id(authorized_client, test_user):
    """Test retrieving a user by ID."""
    response = authorized_client.get(f"/users/{test_user.id}")
    assert response.status_code == 200
    assert response.json()["email"] == test_user.email
    
    # Test with non-existent user ID
    response = authorized_client.get("/users/999999")
    assert response.status_code == 404

def test_create_user(client):
    """Test creating a new user."""
    user_data = {
        "email": "newuser@example.com",
        "password": "password123",
        "display_name": "New User",
        "subscription_tier": "free"
    }
    
    response = client.post("/register", json=user_data)
    assert response.status_code == 201
    assert response.json()["email"] == user_data["email"]
    assert response.json()["display_name"] == user_data["display_name"]
    assert response.json()["subscription_tier"] == user_data["subscription_tier"]
    
    # Test creating a user with an existing email
    response = client.post("/register", json=user_data)
    assert response.status_code == 400

def test_update_user(authorized_client, test_user):
    """Test updating a user's information."""
    update_data = {
        "display_name": "Updated Name",
        "subscription_tier": "individual"
    }
    
    response = authorized_client.put(f"/users/{test_user.id}", json=update_data)
    assert response.status_code == 200
    assert response.json()["display_name"] == update_data["display_name"]
    assert response.json()["subscription_tier"] == update_data["subscription_tier"]
    
    # Test updating a non-existent user
    response = authorized_client.put("/users/999999", json=update_data)
    assert response.status_code == 404
    
    # Test updating another user (should be forbidden)
    other_user_data = {
        "email": "other@example.com",
        "password": "password123",
        "display_name": "Other User",
        "subscription_tier": "free"
    }
    
    # Create another user
    create_response = client.post("/register", json=other_user_data)
    other_user_id = create_response.json()["id"]
    
    # Try to update the other user
    response = authorized_client.put(f"/users/{other_user_id}", json=update_data)
    assert response.status_code == 403

def test_delete_user(authorized_client, test_user, db_session):
    """Test deleting a user."""
    response = authorized_client.delete(f"/users/{test_user.id}")
    assert response.status_code == 200
    
    # Verify that the user was deleted
    user = db_session.query(User).filter(User.id == test_user.id).first()
    assert user is None
    
    # Test deleting a non-existent user
    response = authorized_client.delete("/users/999999")
    assert response.status_code == 404

