import pytest
from fastapi import HTTPException

from app.models.organization import Organization
from app.models.organization_member import OrganizationMember
from app.schemas.organization import OrganizationCreate, OrganizationUpdate

@pytest.fixture
def test_organization(db_session):
    """Create a test organization in the database."""
    organization = Organization(
        name="Test Organization",
        subscription={"plan": "enterprise", "seats": 10}
    )
    db_session.add(organization)
    db_session.commit()
    db_session.refresh(organization)
    return organization

@pytest.fixture
def test_organization_membership(db_session, test_organization, organization_user):
    """Create a test organization membership in the database."""
    membership = OrganizationMember(
        organization_id=test_organization.id,
        user_id=organization_user.id,
        role="admin"
    )
    db_session.add(membership)
    db_session.commit()
    db_session.refresh(membership)
    return membership

def test_get_organizations(authorized_client, test_organization):
    """Test retrieving a list of organizations."""
    response = authorized_client.get("/organizations/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1
    
    # Test pagination
    response = authorized_client.get("/organizations/?skip=0&limit=1")
    assert response.status_code == 200
    assert len(response.json()) == 1

def test_get_organization_by_id(authorized_client, test_organization):
    """Test retrieving an organization by ID."""
    response = authorized_client.get(f"/organizations/{test_organization.id}")
    assert response.status_code == 200
    assert response.json()["name"] == test_organization.name
    
    # Test with non-existent organization ID
    response = authorized_client.get("/organizations/999999")
    assert response.status_code == 404

def test_create_organization(authorized_client):
    """Test creating a new organization."""
    organization_data = {
        "name": "New Organization",
        "subscription": {"plan": "basic", "seats": 5}
    }
    
    response = authorized_client.post("/organizations/", json=organization_data)
    assert response.status_code == 200
    assert response.json()["name"] == organization_data["name"]
    assert response.json()["subscription"] == organization_data["subscription"]

def test_update_organization(authorized_client, test_organization):
    """Test updating an organization."""
    update_data = {
        "name": "Updated Organization",
        "subscription": {"plan": "premium", "seats": 20}
    }
    
    response = authorized_client.put(f"/organizations/{test_organization.id}", json=update_data)
    assert response.status_code == 200
    assert response.json()["name"] == update_data["name"]
    assert response.json()["subscription"] == update_data["subscription"]
    
    # Test updating a non-existent organization
    response = authorized_client.put("/organizations/999999", json=update_data)
    assert response.status_code == 404

def test_delete_organization(authorized_client, test_organization, db_session):
    """Test deleting an organization."""
    response = authorized_client.delete(f"/organizations/{test_organization.id}")
    assert response.status_code == 200
    
    # Verify that the organization was deleted
    organization = db_session.query(Organization).filter(Organization.id == test_organization.id).first()
    assert organization is None
    
    # Test deleting a non-existent organization
    response = authorized_client.delete("/organizations/999999")
    assert response.status_code == 404

def test_get_organization_members(organization_client, test_organization, test_organization_membership):
    """Test retrieving organization members."""
    response = organization_client.get(f"/organizations/{test_organization.id}/members")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1
    
    # Test with non-existent organization ID
    response = organization_client.get("/organizations/999999/members")
    assert response.status_code == 404

def test_add_organization_member(organization_client, test_organization, test_user):
    """Test adding a member to an organization."""
    member_data = {
        "user_id": test_user.id,
        "role": "member"
    }
    
    response = organization_client.post(f"/organizations/{test_organization.id}/members", json=member_data)
    assert response.status_code == 200
    assert response.json()["user_id"] == member_data["user_id"]
    assert response.json()["role"] == member_data["role"]
    
    # Test with non-existent organization ID
    response = organization_client.post("/organizations/999999/members", json=member_data)
    assert response.status_code == 404
    
    # Test with non-existent user ID
    invalid_member_data = {
        "user_id": "999999",
        "role": "member"
    }
    response = organization_client.post(f"/organizations/{test_organization.id}/members", json=invalid_member_data)
    assert response.status_code == 404

def test_remove_organization_member(organization_client, test_organization, test_organization_membership):
    """Test removing a member from an organization."""
    response = organization_client.delete(f"/organizations/{test_organization.id}/members/{test_organization_membership.user_id}")
    assert response.status_code == 200
    
    # Verify that the membership was deleted
    membership = (
        organization_client.db_session.query(OrganizationMember)
        .filter(
            OrganizationMember.organization_id == test_organization.id,
            OrganizationMember.user_id == test_organization_membership.user_id
        )
        .first()
    )
    assert membership is None
    
    # Test with non-existent organization ID
    response = organization_client.delete(f"/organizations/999999/members/{test_organization_membership.user_id}")
    assert response.status_code == 404
    
    # Test with non-existent user ID
    response = organization_client.delete(f"/organizations/{test_organization.id}/members/999999")
    assert response.status_code == 404

