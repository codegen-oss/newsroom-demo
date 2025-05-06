from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from database import get_db
from models import User, Organization, OrganizationMember
from schemas.organization import (
    OrganizationCreate, OrganizationUpdate, OrganizationResponse, OrganizationWithMembers,
    OrganizationMemberCreate, OrganizationMemberUpdate, OrganizationMemberResponse
)
from auth import get_current_user

router = APIRouter(
    prefix="/organizations",
    tags=["organizations"],
)

# Helper function to check if user is an admin of the organization
def check_admin_permission(db: Session, user_id: UUID, org_id: UUID):
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.user_id == user_id,
        OrganizationMember.organization_id == org_id,
        OrganizationMember.role == "admin"
    ).first()
    
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to perform this action"
        )
    return True

# Organization endpoints
@router.post("/", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
def create_organization(
    org: OrganizationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if organization with the same name exists
    db_org = db.query(Organization).filter(Organization.name == org.name).first()
    if db_org:
        raise HTTPException(status_code=400, detail="Organization with this name already exists")
    
    # Create the organization
    db_org = Organization(
        name=org.name,
        description=org.description,
        subscription=org.subscription
    )
    db.add(db_org)
    db.commit()
    db.refresh(db_org)
    
    # Add the current user as an admin
    db_member = OrganizationMember(
        organization_id=db_org.id,
        user_id=current_user.id,
        role="admin"
    )
    db.add(db_member)
    db.commit()
    
    return db_org

@router.get("/", response_model=List[OrganizationResponse])
def read_organizations(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get organizations where the user is a member
    memberships = db.query(OrganizationMember).filter(
        OrganizationMember.user_id == current_user.id
    ).all()
    
    org_ids = [membership.organization_id for membership in memberships]
    organizations = db.query(Organization).filter(
        Organization.id.in_(org_ids)
    ).offset(skip).limit(limit).all()
    
    return organizations

@router.get("/{org_id}", response_model=OrganizationWithMembers)
def read_organization(
    org_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is a member of the organization
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.organization_id == org_id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=404, detail="Organization not found or you don't have access")
    
    organization = db.query(Organization).filter(Organization.id == org_id).first()
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    return organization

@router.put("/{org_id}", response_model=OrganizationResponse)
def update_organization(
    org_id: UUID,
    org_update: OrganizationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check admin permission
    check_admin_permission(db, current_user.id, org_id)
    
    organization = db.query(Organization).filter(Organization.id == org_id).first()
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    if org_update.name is not None:
        organization.name = org_update.name
    if org_update.description is not None:
        organization.description = org_update.description
    if org_update.subscription is not None:
        organization.subscription = org_update.subscription
    
    db.commit()
    db.refresh(organization)
    return organization

@router.delete("/{org_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_organization(
    org_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check admin permission
    check_admin_permission(db, current_user.id, org_id)
    
    organization = db.query(Organization).filter(Organization.id == org_id).first()
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    db.delete(organization)
    db.commit()
    return {"detail": "Organization deleted successfully"}

# Organization membership endpoints
@router.post("/{org_id}/members", response_model=OrganizationMemberResponse)
def add_organization_member(
    org_id: UUID,
    member: OrganizationMemberCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check admin permission
    check_admin_permission(db, current_user.id, org_id)
    
    # Check if user exists
    user = db.query(User).filter(User.id == member.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if membership already exists
    existing_membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == member.user_id
    ).first()
    
    if existing_membership:
        raise HTTPException(status_code=400, detail="User is already a member of this organization")
    
    # Create membership
    db_member = OrganizationMember(
        organization_id=org_id,
        user_id=member.user_id,
        role=member.role
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    
    return db_member

@router.get("/{org_id}/members", response_model=List[OrganizationMemberResponse])
def read_organization_members(
    org_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is a member of the organization
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.organization_id == org_id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=404, detail="Organization not found or you don't have access")
    
    members = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id
    ).all()
    
    return members

@router.put("/{org_id}/members/{user_id}", response_model=OrganizationMemberResponse)
def update_organization_member(
    org_id: UUID,
    user_id: UUID,
    member_update: OrganizationMemberUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check admin permission
    check_admin_permission(db, current_user.id, org_id)
    
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == user_id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=404, detail="Member not found in this organization")
    
    if member_update.role is not None:
        membership.role = member_update.role
    
    db.commit()
    db.refresh(membership)
    return membership

@router.delete("/{org_id}/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_organization_member(
    org_id: UUID,
    user_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check admin permission (unless removing self)
    if current_user.id != user_id:
        check_admin_permission(db, current_user.id, org_id)
    
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == user_id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=404, detail="Member not found in this organization")
    
    # Check if this is the last admin
    if membership.role == "admin":
        admin_count = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.role == "admin"
        ).count()
        
        if admin_count <= 1:
            raise HTTPException(
                status_code=400,
                detail="Cannot remove the last admin from the organization"
            )
    
    db.delete(membership)
    db.commit()
    return {"detail": "Member removed successfully"}

