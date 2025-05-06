import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base
from app.main import app, get_db
from app import models

# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def test_db():
    """
    Create a fresh database for each test.
    """
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create a session
    db = TestingSessionLocal()
    
    try:
        yield db
    finally:
        # Close session
        db.close()
        
        # Drop tables
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(test_db):
    """
    Create a test client with the test database.
    """
    # Override the get_db dependency
    def override_get_db():
        try:
            yield test_db
        finally:
            pass
    
    # Override the dependency
    app.dependency_overrides[get_db] = override_get_db
    
    # Create test client
    with TestClient(app) as client:
        yield client
    
    # Remove the override
    app.dependency_overrides.clear()

@pytest.fixture
def test_category(test_db):
    """
    Create a test category.
    """
    # Create category
    category = models.Category(
        name="Test Category",
        description="Test Category Description",
    )
    
    # Add to database
    test_db.add(category)
    test_db.commit()
    test_db.refresh(category)
    
    return category

@pytest.fixture
def test_article(test_db, test_category):
    """
    Create a test article with a category.
    """
    # Create article
    article = models.Article(
        title="Test Article",
        content="Test Article Content",
        summary="Test Article Summary",
        author="Test Author",
    )
    
    # Add to database
    test_db.add(article)
    test_db.commit()
    test_db.refresh(article)
    
    # Add category
    article.categories.append(test_category)
    test_db.commit()
    test_db.refresh(article)
    
    return article

