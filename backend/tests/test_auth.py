from fastapi.testclient import TestClient
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app.models.models import User

# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create test database and tables
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Override the get_db dependency
app.dependency_overrides[get_db] = override_get_db

# Create test client
client = TestClient(app)

def test_register_user():
    response = client.post(
        "/api/register",
        json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "password123",
            "full_name": "Test User"
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["username"] == "testuser"
    assert data["full_name"] == "Test User"
    assert "id" in data

def test_register_existing_email():
    # First registration
    client.post(
        "/api/register",
        json={
            "email": "duplicate@example.com",
            "username": "uniqueuser",
            "password": "password123",
        },
    )
    
    # Second registration with same email
    response = client.post(
        "/api/register",
        json={
            "email": "duplicate@example.com",
            "username": "anotheruser",
            "password": "password123",
        },
    )
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]

def test_login():
    # Register a user first
    client.post(
        "/api/register",
        json={
            "email": "login@example.com",
            "username": "loginuser",
            "password": "password123",
        },
    )
    
    # Login with username
    response = client.post(
        "/api/token",
        data={
            "username": "loginuser",
            "password": "password123",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    
    # Login with email
    response = client.post(
        "/api/token",
        data={
            "username": "login@example.com",
            "password": "password123",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password():
    # Register a user first
    client.post(
        "/api/register",
        json={
            "email": "wrong@example.com",
            "username": "wronguser",
            "password": "password123",
        },
    )
    
    # Try to login with wrong password
    response = client.post(
        "/api/token",
        data={
            "username": "wronguser",
            "password": "wrongpassword",
        },
    )
    assert response.status_code == 401
    assert "Incorrect username or password" in response.json()["detail"]

def test_get_user_profile():
    # Register a user first
    client.post(
        "/api/register",
        json={
            "email": "profile@example.com",
            "username": "profileuser",
            "password": "password123",
            "full_name": "Profile User",
        },
    )
    
    # Login to get token
    response = client.post(
        "/api/token",
        data={
            "username": "profileuser",
            "password": "password123",
        },
    )
    token = response.json()["access_token"]
    
    # Get user profile
    response = client.get(
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "profile@example.com"
    assert data["username"] == "profileuser"
    assert data["full_name"] == "Profile User"

def test_update_user_profile():
    # Register a user first
    client.post(
        "/api/register",
        json={
            "email": "update@example.com",
            "username": "updateuser",
            "password": "password123",
        },
    )
    
    # Login to get token
    response = client.post(
        "/api/token",
        data={
            "username": "updateuser",
            "password": "password123",
        },
    )
    token = response.json()["access_token"]
    
    # Update user profile
    response = client.put(
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "full_name": "Updated User",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "update@example.com"
    assert data["username"] == "updateuser"
    assert data["full_name"] == "Updated User"

