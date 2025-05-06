from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.session import get_db
from app.models.models import User, Organization, OrganizationMember, OrganizationRole
from app.schemas.organizations import (
    Organization as OrganizationSchema,
    OrganizationCreate,
    OrganizationUpdate,
    OrganizationBasic,
    OrganizationMember as OrganizationMemberSchema,
    OrganizationMemberCreate,
    OrganizationMemberUpdate,
    OrganizationMemberBasic
)
from app.utils.access_control import (
    get_current_user,
    get_current_superuser,
    is_organization_member,
    is_organization_admin,
    is_organization_owner
)

router = APIRouter()

# Create a new organization
@router.post("/", response_model=OrganizationSchema, status_code=status.HTTP_201_CREATED)
def create_organization(
    organization: OrganizationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Create the organization
    db_organization = Organization(**organization.dict())
    db.add(db_organization)
    db.flush()  # Flush to get the organization ID
    
    # Add the current user as the owner
    db_member = OrganizationMember(
        user_id=current_user.id,
        organization_id=db_organization.id,
        role=OrganizationRole.OWNER
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_organization)
    
    return db_organization

# Get all organizations (admin only)
@router.get("/admin/all", response_model=List[OrganizationBasic])
def get_all_organizations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
):
    organizations = db.query(Organization).offset(skip).limit(limit).all()
    return organizations

# Get organizations for current user
@router.get("/", response_model=List[OrganizationBasic])
def get_user_organizations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get all organizations where the user is a member
    organizations = (
        db.query(Organization)
        .join(OrganizationMember)
        .filter(OrganizationMember.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return organizations

# Get a specific organization by ID
@router.get("/{organization_id}", response_model=OrganizationSchema)
def get_organization(
    organization_id: str,
    db: Session = Depends(get_db),
    _: OrganizationMember = Depends(lambda: is_organization_member(organization_id))
):
    organization = db.query(Organization).filter(Organization.id == organization_id).first()
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    return organization

# Update an organization
@router.put("/{organization_id}", response_model=OrganizationSchema)
def update_organization(
    organization_id: str,
    organization_update: OrganizationUpdate,
    db: Session = Depends(get_db),
    _: OrganizationMember = Depends(lambda: is_organization_admin(organization_id))
):
    db_organization = db.query(Organization).filter(Organization.id == organization_id).first()
    if not db_organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Update organization fields
    update_data = organization_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_organization, field, value)
    
    db.commit()
    db.refresh(db_organization)
    return db_organization

# Delete an organization
@router.delete("/{organization_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_organization(
    organization_id: str,
    db: Session = Depends(get_db),
    _: OrganizationMember = Depends(lambda: is_organization_owner(organization_id))
):
    db_organization = db.query(Organization).filter(Organization.id == organization_id).first()
    if not db_organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    db.delete(db_organization)
    db.commit()
    return None

# Add a member to an organization
@router.post("/{organization_id}/members", response_model=OrganizationMemberSchema)
def add_organization_member(
    organization_id: str,
    member: OrganizationMemberCreate,
    db: Session = Depends(get_db),
    _: OrganizationMember = Depends(lambda: is_organization_admin(organization_id))
):
    # Check if the user exists
    user = db.query(User).filter(User.id == member.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if the user is already a member
    existing_member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == member.user_id
    ).first()
    
    if existing_member:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a member of this organization"
        )
    
    # Add the user as a member
    db_member = OrganizationMember(
        user_id=member.user_id,
        organization_id=organization_id,
        role=member.role
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    
    return db_member

# Get all members of an organization
@router.get("/{organization_id}/members", response_model=List[OrganizationMemberSchema])
def get_organization_members(
    organization_id: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _: OrganizationMember = Depends(lambda: is_organization_member(organization_id))
):
    members = (
        db.query(OrganizationMember)
        .filter(OrganizationMember.organization_id == organization_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return members

# Update a member's role in an organization
@router.put("/{organization_id}/members/{member_id}", response_model=OrganizationMemberSchema)
def update_organization_member(
    organization_id: str,
    member_id: str,
    member_update: OrganizationMemberUpdate,
    db: Session = Depends(get_db),
    current_user_member: OrganizationMember = Depends(lambda: is_organization_admin(organization_id))
):
    # Get the member to update
    db_member = db.query(OrganizationMember).filter(
        OrganizationMember.id == member_id,
        OrganizationMember.organization_id == organization_id
    ).first()
    
    if not db_member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found in this organization"
        )
    
    # Check if trying to update an owner
    if db_member.role == OrganizationRole.OWNER:
        # Only owners can update other owners
        if current_user_member.role != OrganizationRole.OWNER:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only owners can update the role of other owners"
            )
    
    # Update the member's role
    db_member.role = member_update.role
    db.commit()
    db.refresh(db_member)
    
    return db_member

# Remove a member from an organization
@router.delete("/{organization_id}/members/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_organization_member(
    organization_id: str,
    member_id: str,
    db: Session = Depends(get_db),
    current_user_member: OrganizationMember = Depends(lambda: is_organization_admin(organization_id))
):
    # Get the member to remove
    db_member = db.query(OrganizationMember).filter(
        OrganizationMember.id == member_id,
        OrganizationMember.organization_id == organization_id
    ).first()
    
    if not db_member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found in this organization"
        )
    
    # Check if trying to remove an owner
    if db_member.role == OrganizationRole.OWNER:
        # Only owners can remove other owners
        if current_user_member.role != OrganizationRole.OWNER:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only owners can remove owners from an organization"
            )
        
        # Check if this is the last owner
        owners_count = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == organization_id,
            OrganizationMember.role == OrganizationRole.OWNER
        ).count()
        
        if owners_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot remove the last owner of an organization"
            )
    
    # Remove the member
    db.delete(db_member)
    db.commit()
    
    return None

