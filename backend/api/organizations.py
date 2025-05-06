from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session
from typing import List
import uuid

from db import get_db
from models import User, OrganizationMember
from schemas import (
    OrganizationCreate, 
    OrganizationUpdate, 
    OrganizationResponse,
    OrganizationMemberResponse
)
from services import OrganizationService
from utils.auth import get_current_active_user

router = APIRouter()

@router.post("/", response_model=OrganizationResponse)
def create_organization(
    organization_create: OrganizationCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new organization"""
    return OrganizationService.create_organization(db, organization_create, current_user.id)

@router.get("/", response_model=List[OrganizationResponse])
def read_organizations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all organizations"""
    return OrganizationService.get_organizations(db, skip, limit)

@router.get("/{organization_id}", response_model=OrganizationResponse)
def read_organization(
    organization_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """Get an organization by ID"""
    return OrganizationService.get_organization_by_id(db, organization_id)

@router.put("/{organization_id}", response_model=OrganizationResponse)
def update_organization(
    organization_id: uuid.UUID,
    organization_update: OrganizationUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update an organization (admin only)"""
    # Check if user is an admin of the organization
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == "admin"
    ).first()
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this organization"
        )
    
    return OrganizationService.update_organization(db, organization_id, organization_update)

@router.delete("/{organization_id}")
def delete_organization(
    organization_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete an organization (admin only)"""
    # Check if user is an admin of the organization
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == "admin"
    ).first()
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this organization"
        )
    
    return OrganizationService.delete_organization(db, organization_id)

@router.post("/{organization_id}/members/{user_id}", response_model=OrganizationMemberResponse)
def add_organization_member(
    organization_id: uuid.UUID,
    user_id: uuid.UUID,
    role: str = "member",
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add a member to an organization (admin only)"""
    # Check if user is an admin of the organization
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == "admin"
    ).first()
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to add members to this organization"
        )
    
    return OrganizationService.add_organization_member(db, organization_id, user_id, role)

@router.delete("/{organization_id}/members/{user_id}")
def remove_organization_member(
    organization_id: uuid.UUID,
    user_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Remove a member from an organization (admin only)"""
    # Check if user is an admin of the organization or removing themselves
    if current_user.id != user_id:
        member = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == organization_id,
            OrganizationMember.user_id == current_user.id,
            OrganizationMember.role == "admin"
        ).first()
        
        if not member:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to remove members from this organization"
            )
    
    return OrganizationService.remove_organization_member(db, organization_id, user_id)

@router.get("/{organization_id}/members", response_model=List[OrganizationMemberResponse])
def get_organization_members(
    organization_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all members of an organization"""
    # Check if user is a member of the organization
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view members of this organization"
        )
    
    return OrganizationService.get_organization_members(db, organization_id)

@router.put("/{organization_id}/members/{user_id}/role", response_model=OrganizationMemberResponse)
def update_member_role(
    organization_id: uuid.UUID,
    user_id: uuid.UUID,
    role: str = Path(..., description="New role (admin or member)"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a member's role in an organization (admin only)"""
    # Check if user is an admin of the organization
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == "admin"
    ).first()
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update member roles in this organization"
        )
    
    return OrganizationService.update_member_role(db, organization_id, user_id, role)

