import pytest
from fastapi.testclient import TestClient

def test_get_articles(client, user_headers, test_articles):
    response = client.get("/articles/", headers=user_headers)
    assert response.status_code == 200
    data = response.json()
    # Free user should only see free articles
    assert len(data) == 1
    assert data[0]["title"] == "Free Article"
    assert data[0]["access_tier"] == "free"

def test_get_articles_premium_user(client, premium_headers, test_articles):
    response = client.get("/articles/", headers=premium_headers)
    assert response.status_code == 200
    data = response.json()
    # Premium user should see free and premium articles
    assert len(data) == 2
    titles = [article["title"] for article in data]
    assert "Free Article" in titles
    assert "Premium Article" in titles

def test_get_articles_org_user(client, org_headers, test_articles):
    response = client.get("/articles/", headers=org_headers)
    assert response.status_code == 200
    data = response.json()
    # Org user should see all articles
    assert len(data) == 3
    titles = [article["title"] for article in data]
    assert "Free Article" in titles
    assert "Premium Article" in titles
    assert "Organization Article" in titles

def test_get_articles_with_category(client, org_headers, test_articles):
    response = client.get("/articles/?category=news", headers=org_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Free Article"
    assert "news" in data[0]["categories"]

def test_get_articles_with_access_tier(client, org_headers, test_articles):
    response = client.get("/articles/?access_tier=premium", headers=org_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Premium Article"
    assert data[0]["access_tier"] == "premium"

def test_get_articles_pagination(client, org_headers, test_articles, db_session):
    # Add more articles to test pagination
    from app.models.article import Article
    for i in range(5):
        article = Article(
            title=f"Extra Article {i}",
            content=f"Content {i}",
            summary=f"Summary {i}",
            source="Test Source",
            source_url=f"https://example.com/extra{i}",
            author="Test Author",
            categories=["extra"],
            access_tier="free"
        )
        db_session.add(article)
    db_session.commit()
    
    # Get first page (limit=3)
    response = client.get("/articles/?skip=0&limit=3", headers=org_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    
    # Get second page
    response = client.get("/articles/?skip=3&limit=3", headers=org_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    
    # Get third page (should have 2 articles)
    response = client.get("/articles/?skip=6&limit=3", headers=org_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2

def test_get_article_by_id(client, user_headers, test_articles):
    # Get a free article as a free user
    free_article_id = test_articles[0].id
    response = client.get(f"/articles/{free_article_id}", headers=user_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Free Article"
    assert data["access_tier"] == "free"

def test_get_premium_article_as_free_user(client, user_headers, test_articles):
    # Try to get a premium article as a free user
    premium_article_id = test_articles[1].id
    response = client.get(f"/articles/{premium_article_id}", headers=user_headers)
    assert response.status_code == 403
    assert "Premium content requires a paid subscription" in response.json()["detail"]

def test_get_premium_article_as_premium_user(client, premium_headers, test_articles):
    # Get a premium article as a premium user
    premium_article_id = test_articles[1].id
    response = client.get(f"/articles/{premium_article_id}", headers=premium_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Premium Article"
    assert data["access_tier"] == "premium"

def test_get_org_article_as_org_user(client, org_headers, test_articles):
    # Get an organization article as an org user
    org_article_id = test_articles[2].id
    response = client.get(f"/articles/{org_article_id}", headers=org_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Organization Article"
    assert data["access_tier"] == "organization"

def test_get_nonexistent_article(client, user_headers):
    response = client.get("/articles/nonexistent-id", headers=user_headers)
    assert response.status_code == 404
    assert "Article not found" in response.json()["detail"]

def test_create_article(client, user_headers):
    response = client.post(
        "/articles/",
        headers=user_headers,
        json={
            "title": "New Article",
            "content": "This is a new article content.",
            "summary": "New article summary",
            "source": "Test Source",
            "source_url": "https://example.com/new",
            "author": "Test Author",
            "categories": ["news", "technology"],
            "access_tier": "free"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "New Article"
    assert data["content"] == "This is a new article content."
    assert data["access_tier"] == "free"
    assert "id" in data
    assert "published_at" in data

def test_create_article_invalid_tier(client, user_headers):
    response = client.post(
        "/articles/",
        headers=user_headers,
        json={
            "title": "Invalid Tier Article",
            "content": "This article has an invalid tier.",
            "summary": "Invalid tier summary",
            "source": "Test Source",
            "source_url": "https://example.com/invalid",
            "author": "Test Author",
            "categories": ["news"],
            "access_tier": "invalid"  # Invalid tier
        }
    )
    assert response.status_code == 400
    assert "Invalid access tier" in response.json()["detail"]

def test_update_article(client, user_headers, test_articles):
    article_id = test_articles[0].id
    response = client.put(
        f"/articles/{article_id}",
        headers=user_headers,
        json={
            "title": "Updated Article",
            "content": "This is updated content.",
            "categories": ["updated", "news"]
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Article"
    assert data["content"] == "This is updated content."
    assert data["categories"] == ["updated", "news"]
    # Fields not included in the update should remain unchanged
    assert data["summary"] == "Free article summary"
    assert data["access_tier"] == "free"

def test_update_nonexistent_article(client, user_headers):
    response = client.put(
        "/articles/nonexistent-id",
        headers=user_headers,
        json={"title": "Updated Title"}
    )
    assert response.status_code == 404
    assert "Article not found" in response.json()["detail"]

def test_update_article_invalid_tier(client, user_headers, test_articles):
    article_id = test_articles[0].id
    response = client.put(
        f"/articles/{article_id}",
        headers=user_headers,
        json={"access_tier": "invalid"}
    )
    assert response.status_code == 400
    assert "Invalid access tier" in response.json()["detail"]

def test_delete_article(client, user_headers, test_articles, db_session):
    article_id = test_articles[0].id
    response = client.delete(f"/articles/{article_id}", headers=user_headers)
    assert response.status_code == 204
    
    # Verify it's gone from the database
    from app.models.article import Article
    article = db_session.query(Article).filter(Article.id == article_id).first()
    assert article is None

def test_delete_nonexistent_article(client, user_headers):
    response = client.delete("/articles/nonexistent-id", headers=user_headers)
    assert response.status_code == 404
    assert "Article not found" in response.json()["detail"]

