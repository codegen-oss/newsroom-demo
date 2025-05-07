import pytest
from fastapi.testclient import TestClient

def test_create_organization(client, org_headers):
    response = client.post(
        "/organizations/",
        headers=org_headers,
        json={
            "name": "New Organization",
            "subscription": {"plan": "basic", "seats": 5}
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "New Organization"
    assert data["subscription"] == {"plan": "basic", "seats": 5}
    assert "id" in data
    assert "created_at" in data

def test_create_organization_empty_name(client, org_headers):
    response = client.post(
        "/organizations/",
        headers=org_headers,
        json={
            "name": "",
            "subscription": {"plan": "basic", "seats": 5}
        }
    )
    assert response.status_code == 400
    assert "Organization name cannot be empty" in response.json()["detail"]

def test_get_organizations(client, org_headers, test_organization):
    response = client.get("/organizations/", headers=org_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == test_organization.name
    assert data[0]["id"] == test_organization.id

def test_get_organization_by_id(client, org_headers, test_organization):
    response = client.get(f"/organizations/{test_organization.id}", headers=org_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == test_organization.name
    assert data["id"] == test_organization.id

def test_get_organization_not_member(client, user_headers, test_organization):
    response = client.get(f"/organizations/{test_organization.id}", headers=user_headers)
    assert response.status_code == 403
    assert "You are not a member of this organization" in response.json()["detail"]

def test_get_nonexistent_organization(client, org_headers):
    response = client.get("/organizations/nonexistent-id", headers=org_headers)
    assert response.status_code == 403  # Not a member of a nonexistent org
    assert "You are not a member of this organization" in response.json()["detail"]

def test_update_organization(client, org_headers, test_organization):
    response = client.put(
        f"/organizations/{test_organization.id}",
        headers=org_headers,
        json={
            "name": "Updated Organization",
            "subscription": {"plan": "premium", "seats": 10}
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Organization"
    assert data["subscription"] == {"plan": "premium", "seats": 10}

def test_update_organization_not_admin(client, user_headers, test_organization, db_session):
    # Add the regular user as a member (not admin)
    from app.models.organization_member import OrganizationMember
    from app.models.user import User
    
    user = db_session.query(User).filter(User.email == "test@example.com").first()
    member = OrganizationMember(
        organization_id=test_organization.id,
        user_id=user.id,
        role="member"
    )
    db_session.add(member)
    db_session.commit()
    
    # Try to update as a regular member
    response = client.put(
        f"/organizations/{test_organization.id}",
        headers=user_headers,
        json={"name": "Unauthorized Update"}
    )
    assert response.status_code == 403
    assert "You must be an admin to update this organization" in response.json()["detail"]

def test_update_organization_empty_name(client, org_headers, test_organization):
    response = client.put(
        f"/organizations/{test_organization.id}",
        headers=org_headers,
        json={"name": ""}
    )
    assert response.status_code == 400
    assert "Organization name cannot be empty" in response.json()["detail"]

def test_delete_organization(client, org_headers, test_organization, db_session):
    response = client.delete(f"/organizations/{test_organization.id}", headers=org_headers)
    assert response.status_code == 204
    
    # Verify it's gone from the database
    from app.models.organization import Organization
    org = db_session.query(Organization).filter(Organization.id == test_organization.id).first()
    assert org is None

def test_delete_organization_not_admin(client, user_headers, test_organization, db_session):
    # Add the regular user as a member (not admin)
    from app.models.organization_member import OrganizationMember
    from app.models.user import User
    
    user = db_session.query(User).filter(User.email == "test@example.com").first()
    member = OrganizationMember(
        organization_id=test_organization.id,
        user_id=user.id,
        role="member"
    )
    db_session.add(member)
    db_session.commit()
    
    # Try to delete as a regular member
    response = client.delete(f"/organizations/{test_organization.id}", headers=user_headers)
    assert response.status_code == 403
    assert "You must be an admin to delete this organization" in response.json()["detail"]

def test_get_organization_members(client, org_headers, test_organization, org_user):
    response = client.get(f"/organizations/{test_organization.id}/members", headers=org_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["user_id"] == org_user.id
    assert data[0]["organization_id"] == test_organization.id
    assert data[0]["role"] == "admin"

def test_add_organization_member(client, org_headers, test_organization, test_user, db_session):
    response = client.post(
        f"/organizations/{test_organization.id}/members",
        headers=org_headers,
        json={
            "organization_id": test_organization.id,
            "user_id": test_user.id,
            "role": "member"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["user_id"] == test_user.id
    assert data["organization_id"] == test_organization.id
    assert data["role"] == "member"

def test_add_organization_member_invalid_role(client, org_headers, test_organization, test_user):
    response = client.post(
        f"/organizations/{test_organization.id}/members",
        headers=org_headers,
        json={
            "organization_id": test_organization.id,
            "user_id": test_user.id,
            "role": "invalid"  # Invalid role
        }
    )
    assert response.status_code == 400
    assert "Invalid role" in response.json()["detail"]

def test_add_organization_member_duplicate(client, org_headers, test_organization, test_user, db_session):
    # First add the member
    client.post(
        f"/organizations/{test_organization.id}/members",
        headers=org_headers,
        json={
            "organization_id": test_organization.id,
            "user_id": test_user.id,
            "role": "member"
        }
    )
    
    # Try to add again
    response = client.post(
        f"/organizations/{test_organization.id}/members",
        headers=org_headers,
        json={
            "organization_id": test_organization.id,
            "user_id": test_user.id,
            "role": "member"
        }
    )
    assert response.status_code == 400
    assert "User is already a member of this organization" in response.json()["detail"]

def test_update_member_role(client, org_headers, test_organization, test_user, db_session):
    # First add the member
    client.post(
        f"/organizations/{test_organization.id}/members",
        headers=org_headers,
        json={
            "organization_id": test_organization.id,
            "user_id": test_user.id,
            "role": "member"
        }
    )
    
    # Update the role
    response = client.put(
        f"/organizations/{test_organization.id}/members/{test_user.id}",
        headers=org_headers,
        json={"role": "admin"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "admin"

def test_update_member_role_invalid(client, org_headers, test_organization, test_user, db_session):
    # First add the member
    client.post(
        f"/organizations/{test_organization.id}/members",
        headers=org_headers,
        json={
            "organization_id": test_organization.id,
            "user_id": test_user.id,
            "role": "member"
        }
    )
    
    # Update with invalid role
    response = client.put(
        f"/organizations/{test_organization.id}/members/{test_user.id}",
        headers=org_headers,
        json={"role": "invalid"}
    )
    assert response.status_code == 400
    assert "Invalid role" in response.json()["detail"]

def test_remove_organization_member(client, org_headers, test_organization, test_user, db_session):
    # First add the member
    client.post(
        f"/organizations/{test_organization.id}/members",
        headers=org_headers,
        json={
            "organization_id": test_organization.id,
            "user_id": test_user.id,
            "role": "member"
        }
    )
    
    # Remove the member
    response = client.delete(
        f"/organizations/{test_organization.id}/members/{test_user.id}",
        headers=org_headers
    )
    assert response.status_code == 204
    
    # Verify they're gone
    from app.models.organization_member import OrganizationMember
    member = db_session.query(OrganizationMember).filter(
        OrganizationMember.organization_id == test_organization.id,
        OrganizationMember.user_id == test_user.id
    ).first()
    assert member is None

def test_remove_last_admin(client, org_headers, test_organization, org_user):
    # Try to remove the only admin
    response = client.delete(
        f"/organizations/{test_organization.id}/members/{org_user.id}",
        headers=org_headers
    )
    assert response.status_code == 400
    assert "Cannot remove the last admin" in response.json()["detail"]

