import pytest
from fastapi.testclient import TestClient

def test_user_registration_and_login_flow(client):
    """Test the complete user registration and login flow."""
    # Step 1: Register a new user
    user_data = {
        "email": "flow_test@example.com",
        "password": "password123",
        "display_name": "Flow Test User",
        "subscription_tier": "free"
    }
    
    register_response = client.post("/register", json=user_data)
    assert register_response.status_code == 201
    user_id = register_response.json()["id"]
    
    # Step 2: Login with the new user
    login_response = client.post(
        "/token",
        data={
            "username": user_data["email"],
            "password": user_data["password"]
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    
    # Step 3: Access user profile with the token
    profile_response = client.get(
        "/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert profile_response.status_code == 200
    assert profile_response.json()["email"] == user_data["email"]
    
    # Step 4: Update user profile
    update_data = {
        "display_name": "Updated Flow Test User",
        "subscription_tier": "individual"
    }
    
    update_response = client.put(
        f"/users/{user_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert update_response.status_code == 200
    assert update_response.json()["display_name"] == update_data["display_name"]
    
    # Step 5: Verify updated profile
    profile_response = client.get(
        "/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert profile_response.status_code == 200
    assert profile_response.json()["display_name"] == update_data["display_name"]
    assert profile_response.json()["subscription_tier"] == update_data["subscription_tier"]

def test_article_creation_and_access_flow(client, test_user):
    """Test the complete article creation and access flow."""
    # Step 1: Login as a test user
    login_response = client.post(
        "/token",
        data={
            "username": test_user.email,
            "password": "password123"
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    
    # Step 2: Create a new article
    article_data = {
        "title": "Flow Test Article",
        "content": "This is a test article for the flow test.",
        "summary": "Flow test article summary",
        "source": "Flow Test Source",
        "source_url": "https://example.com/flow-test",
        "author": "Flow Test Author",
        "categories": ["flow", "test"],
        "access_tier": "free",
        "featured_image": "https://example.com/flow-test-image.jpg"
    }
    
    create_response = client.post(
        "/articles/",
        json=article_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert create_response.status_code == 200
    article_id = create_response.json()["id"]
    
    # Step 3: Retrieve the created article
    get_response = client.get(
        f"/articles/{article_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert get_response.status_code == 200
    assert get_response.json()["title"] == article_data["title"]
    
    # Step 4: Update the article
    update_data = {
        "title": "Updated Flow Test Article",
        "summary": "Updated flow test article summary"
    }
    
    update_response = client.put(
        f"/articles/{article_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert update_response.status_code == 200
    assert update_response.json()["title"] == update_data["title"]
    
    # Step 5: Verify the updated article
    get_response = client.get(
        f"/articles/{article_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert get_response.status_code == 200
    assert get_response.json()["title"] == update_data["title"]
    assert get_response.json()["summary"] == update_data["summary"]
    
    # Step 6: Delete the article
    delete_response = client.delete(
        f"/articles/{article_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert delete_response.status_code == 200
    
    # Step 7: Verify the article was deleted
    get_response = client.get(
        f"/articles/{article_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert get_response.status_code == 404

def test_organization_and_membership_flow(client, test_user, premium_user):
    """Test the complete organization creation and membership flow."""
    # Step 1: Login as a test user
    login_response = client.post(
        "/token",
        data={
            "username": test_user.email,
            "password": "password123"
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    
    # Step 2: Create a new organization
    org_data = {
        "name": "Flow Test Organization",
        "subscription": {"plan": "enterprise", "seats": 5}
    }
    
    create_response = client.post(
        "/organizations/",
        json=org_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert create_response.status_code == 200
    org_id = create_response.json()["id"]
    
    # Step 3: Add a member to the organization
    member_data = {
        "user_id": premium_user.id,
        "role": "member"
    }
    
    add_member_response = client.post(
        f"/organizations/{org_id}/members",
        json=member_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert add_member_response.status_code == 200
    
    # Step 4: Get organization members
    members_response = client.get(
        f"/organizations/{org_id}/members",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert members_response.status_code == 200
    assert len(members_response.json()) >= 1
    
    # Step 5: Update the organization
    update_data = {
        "name": "Updated Flow Test Organization",
        "subscription": {"plan": "premium", "seats": 10}
    }
    
    update_response = client.put(
        f"/organizations/{org_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert update_response.status_code == 200
    assert update_response.json()["name"] == update_data["name"]
    
    # Step 6: Remove a member from the organization
    remove_member_response = client.delete(
        f"/organizations/{org_id}/members/{premium_user.id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert remove_member_response.status_code == 200
    
    # Step 7: Verify the member was removed
    members_response = client.get(
        f"/organizations/{org_id}/members",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert members_response.status_code == 200
    member_ids = [member["user_id"] for member in members_response.json()]
    assert premium_user.id not in member_ids
    
    # Step 8: Delete the organization
    delete_response = client.delete(
        f"/organizations/{org_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert delete_response.status_code == 200
    
    # Step 9: Verify the organization was deleted
    get_response = client.get(
        f"/organizations/{org_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert get_response.status_code == 404

