"""
Tests for the News Room API.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from ..api.main import app
from ..db.postgres.connection import Base, get_db
from ..db.postgres.models import User
from ..auth.password import get_password_hash

# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override the get_db dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create test client
client = TestClient(app)

@pytest.fixture(scope="function")
def test_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create test user
    db = TestingSessionLocal()
    test_user = User(
        email="test@example.com",
        username="testuser",
        hashed_password=get_password_hash("Test123!"),
        full_name="Test User",
        is_active=True
    )
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    db.close()
    
    yield
    
    # Drop tables
    Base.metadata.drop_all(bind=engine)

def test_root(test_db):
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to News Room API"}

def test_register(test_db):
    """Test user registration."""
    response = client.post(
        "/api/auth/register",
        json={
            "email": "newuser@example.com",
            "username": "newuser",
            "password": "NewUser123!",
            "full_name": "New User"
        }
    )
    assert response.status_code == 201
    assert "user_id" in response.json()

def test_login(test_db):
    """Test user login."""
    response = client.post(
        "/api/auth/login",
        data={
            "username": "testuser",
            "password": "Test123!"
        }
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert "refresh_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_login_invalid_credentials(test_db):
    """Test login with invalid credentials."""
    response = client.post(
        "/api/auth/login",
        data={
            "username": "testuser",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401

