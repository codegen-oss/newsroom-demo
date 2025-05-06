import pytest
from fastapi import status

def test_read_articles(client, test_article):
    """
    Test getting all articles.
    """
    response = client.get("/articles")
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    
    article = data[0]
    assert article["id"] == test_article.id
    assert article["title"] == test_article.title
    assert article["content"] == test_article.content
    assert article["summary"] == test_article.summary
    assert article["author"] == test_article.author
    
    assert isinstance(article["categories"], list)
    assert len(article["categories"]) == 1
    assert article["categories"][0]["name"] == "Test Category"

def test_read_article(client, test_article):
    """
    Test getting a specific article by ID.
    """
    response = client.get(f"/articles/{test_article.id}")
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert data["id"] == test_article.id
    assert data["title"] == test_article.title
    assert data["content"] == test_article.content
    assert data["summary"] == test_article.summary
    assert data["author"] == test_article.author
    
    assert isinstance(data["categories"], list)
    assert len(data["categories"]) == 1
    assert data["categories"][0]["name"] == "Test Category"

def test_read_article_not_found(client):
    """
    Test getting a non-existent article.
    """
    response = client.get("/articles/999")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    
    data = response.json()
    assert "detail" in data
    assert data["detail"] == "Article not found"

def test_create_article(client, test_category):
    """
    Test creating a new article.
    """
    article_data = {
        "title": "New Article",
        "content": "New Article Content",
        "summary": "New Article Summary",
        "author": "New Author",
        "category_ids": [test_category.id]
    }
    
    response = client.post("/articles", json=article_data)
    assert response.status_code == status.HTTP_201_CREATED
    
    data = response.json()
    assert data["title"] == article_data["title"]
    assert data["content"] == article_data["content"]
    assert data["summary"] == article_data["summary"]
    assert data["author"] == article_data["author"]
    
    assert isinstance(data["categories"], list)
    assert len(data["categories"]) == 1
    assert data["categories"][0]["id"] == test_category.id
    assert data["categories"][0]["name"] == test_category.name

def test_create_article_without_categories(client):
    """
    Test creating a new article without categories.
    """
    article_data = {
        "title": "New Article Without Categories",
        "content": "New Article Content",
        "summary": "New Article Summary",
        "author": "New Author"
    }
    
    response = client.post("/articles", json=article_data)
    assert response.status_code == status.HTTP_201_CREATED
    
    data = response.json()
    assert data["title"] == article_data["title"]
    assert data["content"] == article_data["content"]
    assert data["summary"] == article_data["summary"]
    assert data["author"] == article_data["author"]
    
    assert isinstance(data["categories"], list)
    assert len(data["categories"]) == 0

def test_update_article(client, test_article, test_db):
    """
    Test updating an article.
    """
    # Create a new category for testing
    from app.models import Category
    new_category = Category(name="New Category", description="New Category Description")
    test_db.add(new_category)
    test_db.commit()
    test_db.refresh(new_category)
    
    # Update data
    update_data = {
        "title": "Updated Article",
        "content": "Updated Content",
        "summary": "Updated Summary",
        "author": "Updated Author",
        "category_ids": [new_category.id]
    }
    
    response = client.put(f"/articles/{test_article.id}", json=update_data)
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert data["id"] == test_article.id
    assert data["title"] == update_data["title"]
    assert data["content"] == update_data["content"]
    assert data["summary"] == update_data["summary"]
    assert data["author"] == update_data["author"]
    
    assert isinstance(data["categories"], list)
    assert len(data["categories"]) == 1
    assert data["categories"][0]["id"] == new_category.id
    assert data["categories"][0]["name"] == new_category.name

def test_update_article_partial(client, test_article):
    """
    Test partially updating an article.
    """
    # Update only title and author
    update_data = {
        "title": "Partially Updated Article",
        "author": "Partially Updated Author"
    }
    
    response = client.put(f"/articles/{test_article.id}", json=update_data)
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert data["id"] == test_article.id
    assert data["title"] == update_data["title"]
    assert data["content"] == test_article.content  # Unchanged
    assert data["summary"] == test_article.summary  # Unchanged
    assert data["author"] == update_data["author"]
    
    # Categories should remain unchanged
    assert isinstance(data["categories"], list)
    assert len(data["categories"]) == 1
    assert data["categories"][0]["name"] == "Test Category"

def test_update_article_not_found(client):
    """
    Test updating a non-existent article.
    """
    update_data = {
        "title": "Updated Article",
        "content": "Updated Content"
    }
    
    response = client.put("/articles/999", json=update_data)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    
    data = response.json()
    assert "detail" in data
    assert data["detail"] == "Article not found"

def test_delete_article(client, test_article):
    """
    Test deleting an article.
    """
    response = client.delete(f"/articles/{test_article.id}")
    assert response.status_code == status.HTTP_204_NO_CONTENT
    
    # Verify article is deleted
    response = client.get(f"/articles/{test_article.id}")
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_delete_article_not_found(client):
    """
    Test deleting a non-existent article.
    """
    response = client.delete("/articles/999")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    
    data = response.json()
    assert "detail" in data
    assert data["detail"] == "Article not found"

