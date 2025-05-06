from fastapi.testclient import TestClient
import pytest

from app.main import app
from app.routes.password_reset import reset_tokens

# Create test client
client = TestClient(app)

def test_password_reset_request():
    # Register a user first
    client.post(
        "/api/register",
        json={
            "email": "reset@example.com",
            "username": "resetuser",
            "password": "password123",
        },
    )
    
    # Request password reset
    response = client.post(
        "/api/password-reset/request",
        json={
            "email": "reset@example.com",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "token" in data  # In a real app, token would be sent via email
    
    # Store token for next test
    token = data["token"]
    
    # Reset password
    response = client.post(
        "/api/password-reset/confirm",
        json={
            "token": token,
            "new_password": "newpassword123",
        },
    )
    assert response.status_code == 200
    assert "Password has been reset successfully" in response.json()["message"]
    
    # Try to login with new password
    response = client.post(
        "/api/token",
        data={
            "username": "resetuser",
            "password": "newpassword123",
        },
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    
    # Try to login with old password
    response = client.post(
        "/api/token",
        data={
            "username": "resetuser",
            "password": "password123",
        },
    )
    assert response.status_code == 401

def test_invalid_reset_token():
    response = client.post(
        "/api/password-reset/confirm",
        json={
            "token": "invalid-token",
            "new_password": "newpassword123",
        },
    )
    assert response.status_code == 400
    assert "Invalid or expired token" in response.json()["detail"]

