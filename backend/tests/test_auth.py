import pytest
from fastapi.testclient import TestClient
from app.auth.auth import get_password_hash

def test_login_success(client, test_user):
    response = client.post(
        "/token",
        data={"username": "test@example.com", "password": "password"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials(client):
    response = client.post(
        "/token",
        data={"username": "wrong@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"

def test_register_success(client):
    response = client.post(
        "/register",
        json={
            "email": "newuser@example.com",
            "password": "password123",
            "display_name": "New User",
            "subscription_tier": "free"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["display_name"] == "New User"
    assert data["subscription_tier"] == "free"

def test_register_existing_email(client, test_user):
    response = client.post(
        "/register",
        json={
            "email": "test@example.com",  # Already exists
            "password": "password123",
            "display_name": "Duplicate User",
            "subscription_tier": "free"
        }
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

def test_register_invalid_email(client):
    response = client.post(
        "/register",
        json={
            "email": "invalid-email",  # Invalid email format
            "password": "password123",
            "display_name": "Invalid Email User",
            "subscription_tier": "free"
        }
    )
    assert response.status_code == 422  # Validation error

def test_register_short_password(client):
    response = client.post(
        "/register",
        json={
            "email": "shortpw@example.com",
            "password": "short",  # Too short
            "display_name": "Short Password User",
            "subscription_tier": "free"
        }
    )
    assert response.status_code == 400
    assert "Password must be at least 8 characters long" in response.json()["detail"]

def test_register_invalid_tier(client):
    response = client.post(
        "/register",
        json={
            "email": "invalidtier@example.com",
            "password": "password123",
            "display_name": "Invalid Tier User",
            "subscription_tier": "invalid"  # Invalid tier
        }
    )
    assert response.status_code == 400
    assert "Invalid subscription tier" in response.json()["detail"]

