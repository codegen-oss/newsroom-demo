import pytest
from fastapi import status

def test_read_categories(client, test_category):
    """
    Test getting all categories.
    """
    response = client.get("/categories")
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    
    category = data[0]
    assert category["id"] == test_category.id
    assert category["name"] == test_category.name
    assert category["description"] == test_category.description

def test_read_category(client, test_category):
    """
    Test getting a specific category by ID.
    """
    response = client.get(f"/categories/{test_category.id}")
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert data["id"] == test_category.id
    assert data["name"] == test_category.name
    assert data["description"] == test_category.description

def test_read_category_not_found(client):
    """
    Test getting a non-existent category.
    """
    response = client.get("/categories/999")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    
    data = response.json()
    assert "detail" in data
    assert data["detail"] == "Category not found"

def test_create_category(client):
    """
    Test creating a new category.
    """
    category_data = {
        "name": "New Category",
        "description": "New Category Description"
    }
    
    response = client.post("/categories", json=category_data)
    assert response.status_code == status.HTTP_201_CREATED
    
    data = response.json()
    assert data["name"] == category_data["name"]
    assert data["description"] == category_data["description"]

def test_create_category_duplicate_name(client, test_category):
    """
    Test creating a category with a duplicate name.
    """
    category_data = {
        "name": test_category.name,
        "description": "Another Description"
    }
    
    response = client.post("/categories", json=category_data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    data = response.json()
    assert "detail" in data
    assert f"Category with name '{test_category.name}' already exists" in data["detail"]

def test_get_category_articles(client, test_article, test_category):
    """
    Test getting articles in a category.
    """
    response = client.get(f"/categories/{test_category.id}/articles")
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    
    article = data[0]
    assert article["id"] == test_article.id
    assert article["title"] == test_article.title
    
    # Verify category is included in the response
    assert isinstance(article["categories"], list)
    assert len(article["categories"]) == 1
    assert article["categories"][0]["id"] == test_category.id
    assert article["categories"][0]["name"] == test_category.name

def test_get_category_articles_empty(client, test_db):
    """
    Test getting articles in a category with no articles.
    """
    # Create a new category with no articles
    from app.models import Category
    empty_category = Category(name="Empty Category", description="No Articles")
    test_db.add(empty_category)
    test_db.commit()
    test_db.refresh(empty_category)
    
    response = client.get(f"/categories/{empty_category.id}/articles")
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0

def test_get_category_articles_not_found(client):
    """
    Test getting articles in a non-existent category.
    """
    response = client.get("/categories/999/articles")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    
    data = response.json()
    assert "detail" in data
    assert data["detail"] == "Category not found"

