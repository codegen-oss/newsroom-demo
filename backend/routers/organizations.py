"""
Organization router for the News Room API.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from database import get_db, Organization, OrganizationMember, User
from database.schema import OrganizationRole, SubscriptionTier
from backend.models.organizations import (
    OrganizationCreate, OrganizationResponse, OrganizationUpdate,
    OrganizationMemberCreate, OrganizationMemberResponse, OrganizationMemberUpdate
)
from backend.routers.auth import get_current_user

router = APIRouter()

def check_organization_admin(db: Session, organization_id: str, user_id: str):
    """Check if a user is an admin of an organization."""
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == user_id,
        OrganizationMember.role == OrganizationRole.ADMIN
    ).first()
    return member is not None

@router.post("/organizations", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
async def create_organization(
    organization: OrganizationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user has organization subscription
    if current_user.subscription_tier != SubscriptionTier.ORGANIZATION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You need an organization subscription to create an organization"
        )
    
    # Create organization
    db_organization = Organization(
        name=organization.name,
        subscription=organization.subscription
    )
    db.add(db_organization)
    db.commit()
    db.refresh(db_organization)
    
    # Add current user as admin
    db_member = OrganizationMember(
        organization_id=db_organization.id,
        user_id=current_user.id,
        role=OrganizationRole.ADMIN
    )
    db.add(db_member)
    db.commit()
    
    return db_organization

@router.get("/organizations", response_model=List[OrganizationResponse])
async def read_organizations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get organizations where the user is a member
    memberships = db.query(OrganizationMember).filter(
        OrganizationMember.user_id == current_user.id
    ).all()
    
    organization_ids = [membership.organization_id for membership in memberships]
    organizations = db.query(Organization).filter(
        Organization.id.in_(organization_ids)
    ).all()
    
    return organizations

@router.get("/organizations/{organization_id}", response_model=OrganizationResponse)
async def read_organization(
    organization_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is a member of the organization
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    
    if membership is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this organization"
        )
    
    organization = db.query(Organization).filter(
        Organization.id == organization_id
    ).first()
    
    if organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    return organization

@router.put("/organizations/{organization_id}", response_model=OrganizationResponse)
async def update_organization(
    organization_id: str,
    organization_update: OrganizationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is an admin of the organization
    if not check_organization_admin(db, organization_id, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be an admin to update the organization"
        )
    
    organization = db.query(Organization).filter(
        Organization.id == organization_id
    ).first()
    
    if organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    # Update organization fields if provided
    if organization_update.name is not None:
        organization.name = organization_update.name
    if organization_update.subscription is not None:
        organization.subscription = organization_update.subscription
    
    db.commit()
    db.refresh(organization)
    return organization

@router.delete("/organizations/{organization_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_organization(
    organization_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is an admin of the organization
    if not check_organization_admin(db, organization_id, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be an admin to delete the organization"
        )
    
    organization = db.query(Organization).filter(
        Organization.id == organization_id
    ).first()
    
    if organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    # Delete all members first (due to foreign key constraints)
    db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id
    ).delete()
    
    # Delete the organization
    db.delete(organization)
    db.commit()
    return None

@router.get("/organizations/{organization_id}/members", response_model=List[OrganizationMemberResponse])
async def read_organization_members(
    organization_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is a member of the organization
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    
    if membership is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this organization"
        )
    
    members = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id
    ).all()
    
    return members

@router.post("/organizations/{organization_id}/members", response_model=OrganizationMemberResponse)
async def add_organization_member(
    organization_id: str,
    member: OrganizationMemberCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is an admin of the organization
    if not check_organization_admin(db, organization_id, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be an admin to add members"
        )
    
    # Check if the user exists
    user = db.query(User).filter(User.id == member.user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if the user is already a member
    existing_member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == member.user_id
    ).first()
    
    if existing_member is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a member of this organization"
        )
    
    # Add the user as a member
    db_member = OrganizationMember(
        organization_id=organization_id,
        user_id=member.user_id,
        role=member.role
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    
    return db_member

@router.put("/organizations/{organization_id}/members/{member_id}", response_model=OrganizationMemberResponse)
async def update_organization_member(
    organization_id: str,
    member_id: str,
    member_update: OrganizationMemberUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is an admin of the organization
    if not check_organization_admin(db, organization_id, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be an admin to update members"
        )
    
    # Get the member
    member = db.query(OrganizationMember).filter(
        OrganizationMember.id == member_id,
        OrganizationMember.organization_id == organization_id
    ).first()
    
    if member is None:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Update member role
    if member_update.role is not None:
        member.role = member_update.role
    
    db.commit()
    db.refresh(member)
    return member

@router.delete("/organizations/{organization_id}/members/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_organization_member(
    organization_id: str,
    member_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is an admin of the organization
    if not check_organization_admin(db, organization_id, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be an admin to remove members"
        )
    
    # Get the member
    member = db.query(OrganizationMember).filter(
        OrganizationMember.id == member_id,
        OrganizationMember.organization_id == organization_id
    ).first()
    
    if member is None:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Don't allow removing the last admin
    if member.role == OrganizationRole.ADMIN:
        admin_count = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == organization_id,
            OrganizationMember.role == OrganizationRole.ADMIN
        ).count()
        
        if admin_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot remove the last admin of the organization"
            )
    
    db.delete(member)
    db.commit()
    return None

