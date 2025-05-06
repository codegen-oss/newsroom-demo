import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from services import UserService, ArticleService
from schemas import UserCreate, ArticleCreate
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

def test_create_article(client: TestClient, db: Session):
    """Test creating an article"""
    # Create a user and get auth header
    user = create_test_user(db)
    headers = get_auth_header(user.id)
    
    # Create an article
    response = client.post(
        "/api/articles/",
        headers=headers,
        json={
            "title": "Test Article",
            "content": "This is a test article content.",
            "summary": "Test summary",
            "source": "Test Source",
            "categories": ["news", "technology"]
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Article"
    assert data["content"] == "This is a test article content."
    assert data["summary"] == "Test summary"
    assert data["source"] == "Test Source"
    assert data["categories"] == ["news", "technology"]
    assert "id" in data

def test_get_articles(client: TestClient, db: Session):
    """Test getting all articles"""
    # Create a user and get auth header
    user = create_test_user(db)
    headers = get_auth_header(user.id)
    
    # Create some articles
    article_create1 = ArticleCreate(
        title="Article 1",
        content="Content 1",
        categories=["news"],
        access_tier="free"
    )
    article_create2 = ArticleCreate(
        title="Article 2",
        content="Content 2",
        categories=["technology"],
        access_tier="premium"
    )
    
    ArticleService.create_article(db, article_create1)
    ArticleService.create_article(db, article_create2)
    
    # Get all articles
    response = client.get("/api/articles/")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["title"] == "Article 1"
    assert data[1]["title"] == "Article 2"
    
    # Test filtering by access tier
    response = client.get("/api/articles/?access_tier=premium")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Article 2"
    
    # Test filtering by category
    response = client.get("/api/articles/?category=news")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Article 1"

def test_get_article_by_id(client: TestClient, db: Session):
    """Test getting an article by ID"""
    # Create a user and get auth header
    user = create_test_user(db)
    headers = get_auth_header(user.id)
    
    # Create an article
    article_create = ArticleCreate(
        title="Test Article",
        content="This is a test article content.",
        summary="Test summary"
    )
    
    article = ArticleService.create_article(db, article_create)
    
    # Get the article by ID
    response = client.get(f"/api/articles/{article.id}")
    
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Article"
    assert data["content"] == "This is a test article content."
    assert data["summary"] == "Test summary"
    
    # Test getting a non-existent article
    response = client.get(f"/api/articles/{uuid.uuid4()}")
    
    assert response.status_code == 404
    assert "Article not found" in response.json()["detail"]

def test_update_article(client: TestClient, db: Session):
    """Test updating an article"""
    # Create a user and get auth header
    user = create_test_user(db)
    headers = get_auth_header(user.id)
    
    # Create an article
    article_create = ArticleCreate(
        title="Original Title",
        content="Original content",
        summary="Original summary"
    )
    
    article = ArticleService.create_article(db, article_create)
    
    # Update the article
    response = client.put(
        f"/api/articles/{article.id}",
        headers=headers,
        json={
            "title": "Updated Title",
            "content": "Updated content"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["content"] == "Updated content"
    assert data["summary"] == "Original summary"  # Unchanged field

def test_delete_article(client: TestClient, db: Session):
    """Test deleting an article"""
    # Create a user and get auth header
    user = create_test_user(db)
    headers = get_auth_header(user.id)
    
    # Create an article
    article_create = ArticleCreate(
        title="Test Article",
        content="This is a test article content."
    )
    
    article = ArticleService.create_article(db, article_create)
    
    # Delete the article
    response = client.delete(
        f"/api/articles/{article.id}",
        headers=headers
    )
    
    assert response.status_code == 200
    assert "Article deleted successfully" in response.json()["message"]
    
    # Verify the article is deleted
    response = client.get(f"/api/articles/{article.id}")
    assert response.status_code == 404

