import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.database import Base, get_db
from app.models.user import User
from app.models.article import Article
from app.models.organization import Organization
from app.models.organization_member import OrganizationMember
from app.models.user_interest import UserInterest
from app.auth.auth import create_access_token

# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    # Create the database tables
    Base.metadata.create_all(bind=engine)
    
    # Create a new session for each test
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Drop all tables after each test
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    # Override the get_db dependency to use our test database
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    # Remove the override after the test
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def test_user(db_session):
    # Create a test user
    user = User(
        email="test@example.com",
        password_hash="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
        display_name="Test User",
        subscription_tier="free"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture(scope="function")
def premium_user(db_session):
    # Create a premium user
    user = User(
        email="premium@example.com",
        password_hash="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
        display_name="Premium User",
        subscription_tier="individual"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture(scope="function")
def org_user(db_session):
    # Create an organization user
    user = User(
        email="org@example.com",
        password_hash="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
        display_name="Org User",
        subscription_tier="organization"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture(scope="function")
def test_organization(db_session, org_user):
    # Create a test organization
    org = Organization(
        name="Test Organization",
        subscription={"plan": "enterprise", "seats": 10}
    )
    db_session.add(org)
    db_session.commit()
    db_session.refresh(org)
    
    # Add the org_user as an admin
    member = OrganizationMember(
        organization_id=org.id,
        user_id=org_user.id,
        role="admin"
    )
    db_session.add(member)
    db_session.commit()
    
    return org

@pytest.fixture(scope="function")
def test_articles(db_session):
    # Create test articles with different access tiers
    articles = [
        Article(
            title="Free Article",
            content="This is a free article content.",
            summary="Free article summary",
            source="Test Source",
            source_url="https://example.com/free",
            author="Test Author",
            categories=["news", "technology"],
            access_tier="free"
        ),
        Article(
            title="Premium Article",
            content="This is a premium article content.",
            summary="Premium article summary",
            source="Test Source",
            source_url="https://example.com/premium",
            author="Test Author",
            categories=["business", "finance"],
            access_tier="premium"
        ),
        Article(
            title="Organization Article",
            content="This is an organization article content.",
            summary="Organization article summary",
            source="Test Source",
            source_url="https://example.com/org",
            author="Test Author",
            categories=["enterprise", "management"],
            access_tier="organization"
        )
    ]
    
    for article in articles:
        db_session.add(article)
    
    db_session.commit()
    
    # Refresh to get the IDs
    for article in articles:
        db_session.refresh(article)
    
    return articles

@pytest.fixture(scope="function")
def user_token(test_user):
    # Create a token for the test user
    access_token = create_access_token(
        data={"sub": test_user.email}
    )
    return access_token

@pytest.fixture(scope="function")
def premium_token(premium_user):
    # Create a token for the premium user
    access_token = create_access_token(
        data={"sub": premium_user.email}
    )
    return access_token

@pytest.fixture(scope="function")
def org_token(org_user):
    # Create a token for the organization user
    access_token = create_access_token(
        data={"sub": org_user.email}
    )
    return access_token

@pytest.fixture(scope="function")
def user_headers(user_token):
    return {"Authorization": f"Bearer {user_token}"}

@pytest.fixture(scope="function")
def premium_headers(premium_token):
    return {"Authorization": f"Bearer {premium_token}"}

@pytest.fixture(scope="function")
def org_headers(org_token):
    return {"Authorization": f"Bearer {org_token}"}

