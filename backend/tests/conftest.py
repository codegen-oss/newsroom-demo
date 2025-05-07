import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.database import Base, get_db
from app.auth.auth import create_access_token
from app.models.user import User

# Create an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    """
    Create a fresh database session for each test.
    """
    # Create the database tables
    Base.metadata.create_all(bind=engine)
    
    # Create a new session for testing
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Drop all tables after the test is complete
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    """
    Create a test client for FastAPI with a database session dependency override.
    """
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    
    # Clear any dependency overrides after the test
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def test_user(db_session):
    """
    Create a test user in the database.
    """
    from app.auth.auth import get_password_hash
    
    # Create a test user
    user = User(
        email="test@example.com",
        password_hash=get_password_hash("password123"),
        display_name="Test User",
        subscription_tier="free"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture(scope="function")
def premium_user(db_session):
    """
    Create a premium test user in the database.
    """
    from app.auth.auth import get_password_hash
    
    # Create a premium test user
    user = User(
        email="premium@example.com",
        password_hash=get_password_hash("password123"),
        display_name="Premium User",
        subscription_tier="individual"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture(scope="function")
def organization_user(db_session):
    """
    Create an organization test user in the database.
    """
    from app.auth.auth import get_password_hash
    
    # Create an organization test user
    user = User(
        email="org@example.com",
        password_hash=get_password_hash("password123"),
        display_name="Organization User",
        subscription_tier="organization"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture(scope="function")
def token(test_user):
    """
    Create a JWT token for the test user.
    """
    return create_access_token(data={"sub": test_user.email})

@pytest.fixture(scope="function")
def premium_token(premium_user):
    """
    Create a JWT token for the premium user.
    """
    return create_access_token(data={"sub": premium_user.email})

@pytest.fixture(scope="function")
def organization_token(organization_user):
    """
    Create a JWT token for the organization user.
    """
    return create_access_token(data={"sub": organization_user.email})

@pytest.fixture(scope="function")
def authorized_client(client, token):
    """
    Create a test client with authorization headers.
    """
    client.headers = {
        **client.headers,
        "Authorization": f"Bearer {token}"
    }
    return client

@pytest.fixture(scope="function")
def premium_client(client, premium_token):
    """
    Create a test client with premium user authorization headers.
    """
    client.headers = {
        **client.headers,
        "Authorization": f"Bearer {premium_token}"
    }
    return client

@pytest.fixture(scope="function")
def organization_client(client, organization_token):
    """
    Create a test client with organization user authorization headers.
    """
    client.headers = {
        **client.headers,
        "Authorization": f"Bearer {organization_token}"
    }
    return client

