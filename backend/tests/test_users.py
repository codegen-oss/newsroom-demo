import pytest
from fastapi.testclient import TestClient

def test_read_users_me(client, user_headers, test_user):
    response = client.get("/users/me", headers=user_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user.email
    assert data["display_name"] == test_user.display_name
    assert data["subscription_tier"] == test_user.subscription_tier

def test_read_users_me_unauthorized(client):
    response = client.get("/users/me")
    assert response.status_code == 401

def test_update_user(client, user_headers, test_user, db_session):
    response = client.put(
        "/users/me",
        headers=user_headers,
        json={
            "display_name": "Updated Name",
            "subscription_tier": "individual",
            "preferences": {"theme": "dark", "notifications": True}
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["display_name"] == "Updated Name"
    assert data["subscription_tier"] == "individual"
    assert data["preferences"] == {"theme": "dark", "notifications": True}
    
    # Verify the changes in the database
    db_user = db_session.query(test_user.__class__).filter_by(id=test_user.id).first()
    assert db_user.display_name == "Updated Name"
    assert db_user.subscription_tier == "individual"
    assert db_user.preferences == {"theme": "dark", "notifications": True}

def test_update_user_invalid_tier(client, user_headers):
    response = client.put(
        "/users/me",
        headers=user_headers,
        json={"subscription_tier": "invalid"}
    )
    assert response.status_code == 400
    assert "Invalid subscription tier" in response.json()["detail"]

def test_create_user_interests(client, user_headers, test_user, db_session):
    response = client.post(
        "/users/interests",
        headers=user_headers,
        json={
            "user_id": test_user.id,
            "categories": ["technology", "science"],
            "regions": ["US", "EU"],
            "topics": ["AI", "Space"]
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["user_id"] == test_user.id
    assert data["categories"] == ["technology", "science"]
    assert data["regions"] == ["US", "EU"]
    assert data["topics"] == ["AI", "Space"]

def test_create_user_interests_duplicate(client, user_headers, test_user, db_session):
    # First create interests
    client.post(
        "/users/interests",
        headers=user_headers,
        json={
            "user_id": test_user.id,
            "categories": ["technology"],
            "regions": ["US"],
            "topics": ["AI"]
        }
    )
    
    # Try to create again
    response = client.post(
        "/users/interests",
        headers=user_headers,
        json={
            "user_id": test_user.id,
            "categories": ["science"],
            "regions": ["EU"],
            "topics": ["Space"]
        }
    )
    assert response.status_code == 400
    assert "User interests already exist" in response.json()["detail"]

def test_get_user_interests(client, user_headers, test_user, db_session):
    # First create interests
    client.post(
        "/users/interests",
        headers=user_headers,
        json={
            "user_id": test_user.id,
            "categories": ["technology", "science"],
            "regions": ["US", "EU"],
            "topics": ["AI", "Space"]
        }
    )
    
    # Get interests
    response = client.get("/users/interests", headers=user_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == test_user.id
    assert data["categories"] == ["technology", "science"]
    assert data["regions"] == ["US", "EU"]
    assert data["topics"] == ["AI", "Space"]

def test_get_user_interests_not_found(client, user_headers):
    response = client.get("/users/interests", headers=user_headers)
    assert response.status_code == 404
    assert "User interests not found" in response.json()["detail"]

def test_update_user_interests(client, user_headers, test_user, db_session):
    # First create interests
    client.post(
        "/users/interests",
        headers=user_headers,
        json={
            "user_id": test_user.id,
            "categories": ["technology"],
            "regions": ["US"],
            "topics": ["AI"]
        }
    )
    
    # Update interests
    response = client.put(
        "/users/interests",
        headers=user_headers,
        json={
            "categories": ["science", "health"],
            "regions": ["EU", "Asia"],
            "topics": ["Space", "Medicine"]
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["categories"] == ["science", "health"]
    assert data["regions"] == ["EU", "Asia"]
    assert data["topics"] == ["Space", "Medicine"]

def test_update_user_interests_not_found(client, user_headers):
    response = client.put(
        "/users/interests",
        headers=user_headers,
        json={"categories": ["science"]}
    )
    assert response.status_code == 404
    assert "User interests not found" in response.json()["detail"]

def test_delete_user_interests(client, user_headers, test_user, db_session):
    # First create interests
    client.post(
        "/users/interests",
        headers=user_headers,
        json={
            "user_id": test_user.id,
            "categories": ["technology"],
            "regions": ["US"],
            "topics": ["AI"]
        }
    )
    
    # Delete interests
    response = client.delete("/users/interests", headers=user_headers)
    assert response.status_code == 204
    
    # Verify they're gone
    get_response = client.get("/users/interests", headers=user_headers)
    assert get_response.status_code == 404

