import pytest
from fastapi import HTTPException

from app.models.article import Article
from app.schemas.article import ArticleCreate, ArticleUpdate

@pytest.fixture
def test_article(db_session):
    """Create a test article in the database."""
    article = Article(
        title="Test Article",
        content="This is a test article content.",
        summary="Test article summary",
        source="Test Source",
        source_url="https://example.com/test",
        author="Test Author",
        categories=["test", "example"],
        access_tier="free",
        featured_image="https://example.com/image.jpg"
    )
    db_session.add(article)
    db_session.commit()
    db_session.refresh(article)
    return article

@pytest.fixture
def premium_article(db_session):
    """Create a premium test article in the database."""
    article = Article(
        title="Premium Article",
        content="This is a premium article content.",
        summary="Premium article summary",
        source="Premium Source",
        source_url="https://example.com/premium",
        author="Premium Author",
        categories=["premium", "example"],
        access_tier="premium",
        featured_image="https://example.com/premium-image.jpg"
    )
    db_session.add(article)
    db_session.commit()
    db_session.refresh(article)
    return article

@pytest.fixture
def organization_article(db_session):
    """Create an organization test article in the database."""
    article = Article(
        title="Organization Article",
        content="This is an organization article content.",
        summary="Organization article summary",
        source="Organization Source",
        source_url="https://example.com/organization",
        author="Organization Author",
        categories=["organization", "example"],
        access_tier="organization",
        featured_image="https://example.com/organization-image.jpg"
    )
    db_session.add(article)
    db_session.commit()
    db_session.refresh(article)
    return article

def test_get_articles(authorized_client, test_article):
    """Test retrieving a list of articles."""
    response = authorized_client.get("/articles/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1
    
    # Test filtering by category
    response = authorized_client.get("/articles/?category=test")
    assert response.status_code == 200
    assert len(response.json()) >= 1
    assert response.json()[0]["categories"] == ["test", "example"]
    
    # Test filtering by access tier
    response = authorized_client.get("/articles/?access_tier=free")
    assert response.status_code == 200
    assert len(response.json()) >= 1
    assert response.json()[0]["access_tier"] == "free"
    
    # Test pagination
    response = authorized_client.get("/articles/?skip=0&limit=1")
    assert response.status_code == 200
    assert len(response.json()) == 1

def test_get_article_by_id(authorized_client, test_article, premium_article, organization_article):
    """Test retrieving an article by ID."""
    # Test retrieving a free article
    response = authorized_client.get(f"/articles/{test_article.id}")
    assert response.status_code == 200
    assert response.json()["title"] == test_article.title
    
    # Test retrieving a premium article with a free user (should be forbidden)
    response = authorized_client.get(f"/articles/{premium_article.id}")
    assert response.status_code == 403
    
    # Test retrieving an organization article with a free user (should be forbidden)
    response = authorized_client.get(f"/articles/{organization_article.id}")
    assert response.status_code == 403
    
    # Test with non-existent article ID
    response = authorized_client.get("/articles/999999")
    assert response.status_code == 404

def test_premium_user_access(premium_client, test_article, premium_article, organization_article):
    """Test article access for premium users."""
    # Premium user should be able to access free articles
    response = premium_client.get(f"/articles/{test_article.id}")
    assert response.status_code == 200
    
    # Premium user should be able to access premium articles
    response = premium_client.get(f"/articles/{premium_article.id}")
    assert response.status_code == 200
    
    # Premium user should not be able to access organization articles
    response = premium_client.get(f"/articles/{organization_article.id}")
    assert response.status_code == 403

def test_organization_user_access(organization_client, test_article, premium_article, organization_article):
    """Test article access for organization users."""
    # Organization user should be able to access free articles
    response = organization_client.get(f"/articles/{test_article.id}")
    assert response.status_code == 200
    
    # Organization user should be able to access premium articles
    response = organization_client.get(f"/articles/{premium_article.id}")
    assert response.status_code == 200
    
    # Organization user should be able to access organization articles
    response = organization_client.get(f"/articles/{organization_article.id}")
    assert response.status_code == 200

def test_create_article(authorized_client):
    """Test creating a new article."""
    article_data = {
        "title": "New Article",
        "content": "This is a new article content.",
        "summary": "New article summary",
        "source": "New Source",
        "source_url": "https://example.com/new",
        "author": "New Author",
        "categories": ["new", "example"],
        "access_tier": "free",
        "featured_image": "https://example.com/new-image.jpg"
    }
    
    response = authorized_client.post("/articles/", json=article_data)
    assert response.status_code == 200
    assert response.json()["title"] == article_data["title"]
    assert response.json()["content"] == article_data["content"]
    assert response.json()["categories"] == article_data["categories"]

def test_update_article(authorized_client, test_article):
    """Test updating an article."""
    update_data = {
        "title": "Updated Article",
        "summary": "Updated summary"
    }
    
    response = authorized_client.put(f"/articles/{test_article.id}", json=update_data)
    assert response.status_code == 200
    assert response.json()["title"] == update_data["title"]
    assert response.json()["summary"] == update_data["summary"]
    # Other fields should remain unchanged
    assert response.json()["content"] == test_article.content
    
    # Test updating a non-existent article
    response = authorized_client.put("/articles/999999", json=update_data)
    assert response.status_code == 404

def test_delete_article(authorized_client, test_article, db_session):
    """Test deleting an article."""
    response = authorized_client.delete(f"/articles/{test_article.id}")
    assert response.status_code == 200
    
    # Verify that the article was deleted
    article = db_session.query(Article).filter(Article.id == test_article.id).first()
    assert article is None
    
    # Test deleting a non-existent article
    response = authorized_client.delete("/articles/999999")
    assert response.status_code == 404

