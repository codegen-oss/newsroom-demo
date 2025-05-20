from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db.session import get_db
from app.models.organization import Organization, OrganizationMember
from app.models.user import User
from app.models.enums import OrganizationRole
from app.schemas.organization import (
    Organization as OrganizationSchema,
    OrganizationCreate,
    OrganizationUpdate,
    OrganizationMember as OrganizationMemberSchema,
    OrganizationMemberCreate,
    OrganizationMemberUpdate,
)

router = APIRouter()

@router.get("/", response_model=List[OrganizationSchema])
def read_organizations(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Retrieve organizations.
    """
    # Get organizations where the user is a member
    user_org_memberships = db.query(OrganizationMember).filter(
        OrganizationMember.user_id == current_user.id
    ).all()
    
    org_ids = [membership.organization_id for membership in user_org_memberships]
    organizations = db.query(Organization).filter(
        Organization.id.in_(org_ids)
    ).offset(skip).limit(limit).all()
    
    return organizations

@router.post("/", response_model=OrganizationSchema)
def create_organization(
    *,
    db: Session = Depends(get_db),
    organization_in: OrganizationCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create new organization.
    """
    organization = Organization(
        name=organization_in.name,
        subscription=organization_in.subscription or {},
    )
    db.add(organization)
    db.commit()
    db.refresh(organization)
    
    # Add current user as admin
    org_member = OrganizationMember(
        organization_id=organization.id,
        user_id=current_user.id,
        role=OrganizationRole.ADMIN,
    )
    db.add(org_member)
    db.commit()
    
    return organization

@router.get("/{organization_id}", response_model=OrganizationSchema)
def read_organization(
    *,
    organization_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get organization by ID.
    """
    # Check if user is a member of this organization
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id,
    ).first()
    
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this organization",
        )
    
    organization = db.query(Organization).filter(Organization.id == organization_id).first()
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    
    return organization

@router.put("/{organization_id}", response_model=OrganizationSchema)
def update_organization(
    *,
    organization_id: str,
    db: Session = Depends(get_db),
    organization_in: OrganizationUpdate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update an organization.
    """
    # Check if user is an admin of this organization
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == OrganizationRole.ADMIN,
    ).first()
    
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not an admin of this organization",
        )
    
    organization = db.query(Organization).filter(Organization.id == organization_id).first()
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    
    # Update organization fields
    if organization_in.name is not None:
        organization.name = organization_in.name
    if organization_in.subscription is not None:
        organization.subscription = organization_in.subscription
    
    db.add(organization)
    db.commit()
    db.refresh(organization)
    return organization

@router.get("/{organization_id}/members", response_model=List[OrganizationMemberSchema])
def read_organization_members(
    *,
    organization_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get all members of an organization.
    """
    # Check if user is a member of this organization
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id,
    ).first()
    
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this organization",
        )
    
    members = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id
    ).all()
    
    return members

@router.post("/{organization_id}/members", response_model=OrganizationMemberSchema)
def add_organization_member(
    *,
    organization_id: str,
    db: Session = Depends(get_db),
    member_in: OrganizationMemberCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Add a member to an organization.
    """
    # Check if user is an admin of this organization
    admin_membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == OrganizationRole.ADMIN,
    ).first()
    
    if not admin_membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not an admin of this organization",
        )
    
    # Check if user exists
    user = db.query(User).filter(User.id == member_in.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Check if user is already a member
    existing_membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == member_in.user_id,
    ).first()
    
    if existing_membership:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a member of this organization",
        )
    
    # Add user as member
    member = OrganizationMember(
        organization_id=organization_id,
        user_id=member_in.user_id,
        role=member_in.role,
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    
    return member

@router.put("/{organization_id}/members/{member_id}", response_model=OrganizationMemberSchema)
def update_organization_member(
    *,
    organization_id: str,
    member_id: str,
    db: Session = Depends(get_db),
    member_in: OrganizationMemberUpdate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update a member's role in an organization.
    """
    # Check if user is an admin of this organization
    admin_membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == OrganizationRole.ADMIN,
    ).first()
    
    if not admin_membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not an admin of this organization",
        )
    
    # Get the member to update
    member = db.query(OrganizationMember).filter(
        OrganizationMember.id == member_id,
        OrganizationMember.organization_id == organization_id,
    ).first()
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found",
        )
    
    # Update member role
    if member_in.role is not None:
        member.role = member_in.role
    
    db.add(member)
    db.commit()
    db.refresh(member)
    
    return member

@router.delete("/{organization_id}/members/{user_id}", response_model=OrganizationMemberSchema)
def remove_organization_member(
    *,
    organization_id: str,
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Remove a member from an organization.
    """
    # Check if user is an admin of this organization
    admin_membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == OrganizationRole.ADMIN,
    ).first()
    
    if not admin_membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not an admin of this organization",
        )
    
    # Get the member to remove
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == user_id,
    ).first()
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found",
        )
    
    # Prevent removing the last admin
    if member.role == OrganizationRole.ADMIN:
        admin_count = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == organization_id,
            OrganizationMember.role == OrganizationRole.ADMIN,
        ).count()
        
        if admin_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot remove the last admin of the organization",
            )
    
    # Remove the member
    db.delete(member)
    db.commit()
    
    return member

