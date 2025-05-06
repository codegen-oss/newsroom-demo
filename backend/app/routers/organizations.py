from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Organization, OrganizationMember, User
from app.schemas import (
    OrganizationCreate,
    OrganizationUpdate,
    OrganizationResponse,
    OrganizationMemberCreate,
    OrganizationMemberUpdate,
    OrganizationMemberResponse,
    RoleEnum
)
from app.auth.utils import get_current_user

router = APIRouter()

@router.post("/", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
def create_organization(
    organization: OrganizationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if user has the right subscription tier
    if current_user.subscription_tier != "organization":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Organization subscription required to create an organization"
        )
    
    db_organization = Organization(
        name=organization.name,
        subscription=organization.subscription
    )
    
    db.add(db_organization)
    db.commit()
    db.refresh(db_organization)
    
    # Add the current user as an admin of the organization
    db_member = OrganizationMember(
        organization_id=db_organization.id,
        user_id=current_user.id,
        role="admin"
    )
    
    db.add(db_member)
    db.commit()
    
    return db_organization

@router.get("/", response_model=List[OrganizationResponse])
def read_organizations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get organizations where the user is a member
    member_orgs = db.query(OrganizationMember).filter(
        OrganizationMember.user_id == current_user.id
    ).all()
    
    org_ids = [member.organization_id for member in member_orgs]
    
    organizations = db.query(Organization).filter(
        Organization.id.in_(org_ids)
    ).offset(skip).limit(limit).all()
    
    return organizations

@router.get("/{organization_id}", response_model=OrganizationResponse)
def read_organization(
    organization_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if user is a member of the organization
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this organization"
        )
    
    organization = db.query(Organization).filter(Organization.id == organization_id).first()
    
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    return organization

@router.put("/{organization_id}", response_model=OrganizationResponse)
def update_organization(
    organization_id: str,
    organization_update: OrganizationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if user is an admin of the organization
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == "admin"
    ).first()
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin role required to update organization"
        )
    
    organization = db.query(Organization).filter(Organization.id == organization_id).first()
    
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Update fields if provided
    if organization_update.name is not None:
        organization.name = organization_update.name
    if organization_update.subscription is not None:
        organization.subscription = organization_update.subscription
    
    db.commit()
    db.refresh(organization)
    return organization

# Organization members endpoints
@router.post("/members", response_model=OrganizationMemberResponse, status_code=status.HTTP_201_CREATED)
def add_organization_member(
    member: OrganizationMemberCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if current user is an admin of the organization
    admin_check = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == member.organization_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == "admin"
    ).first()
    
    if not admin_check:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin role required to add members"
        )
    
    # Check if user exists
    user = db.query(User).filter(User.id == member.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if user is already a member
    existing_member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == member.organization_id,
        OrganizationMember.user_id == member.user_id
    ).first()
    
    if existing_member:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a member of this organization"
        )
    
    db_member = OrganizationMember(
        organization_id=member.organization_id,
        user_id=member.user_id,
        role=member.role
    )
    
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

@router.get("/{organization_id}/members", response_model=List[OrganizationMemberResponse])
def read_organization_members(
    organization_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if user is a member of the organization
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this organization"
        )
    
    members = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id
    ).all()
    
    return members

@router.put("/members/{member_id}", response_model=OrganizationMemberResponse)
def update_organization_member(
    member_id: str,
    member_update: OrganizationMemberUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get the member to update
    db_member = db.query(OrganizationMember).filter(OrganizationMember.id == member_id).first()
    
    if not db_member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found"
        )
    
    # Check if current user is an admin of the organization
    admin_check = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == db_member.organization_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == "admin"
    ).first()
    
    if not admin_check:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin role required to update members"
        )
    
    # Update role if provided
    if member_update.role is not None:
        db_member.role = member_update.role
    
    db.commit()
    db.refresh(db_member)
    return db_member

