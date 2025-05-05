"""
Organizations router for the News Room application.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Path, Body, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from ...db.postgres.connection import get_db
from ...db.postgres.models import User, Organization
from ...auth.jwt import get_current_active_user

router = APIRouter()

# Organization schemas
class OrganizationCreate(BaseModel):
    name: str
    description: Optional[str] = None

class OrganizationResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class MemberResponse(BaseModel):
    id: int
    username: str
    full_name: str

# Create organization
@router.post("/", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
async def create_organization(
    org_data: OrganizationCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if organization name already exists
    if db.query(Organization).filter(Organization.name == org_data.name).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organization name already exists"
        )
    
    # Create new organization
    new_org = Organization(
        name=org_data.name,
        description=org_data.description
    )
    
    db.add(new_org)
    db.commit()
    db.refresh(new_org)
    
    # Add current user as a member
    new_org.members.append(current_user)
    db.commit()
    
    return new_org

# Get all organizations for current user
@router.get("/", response_model=List[OrganizationResponse])
async def get_organizations(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return current_user.organizations

# Get organization by ID
@router.get("/{org_id}", response_model=OrganizationResponse)
async def get_organization(
    org_id: int = Path(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Get organization
    org = db.query(Organization).filter(Organization.id == org_id).first()
    
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Check if user is a member
    if current_user not in org.members:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this organization"
        )
    
    return org

# Update organization
@router.put("/{org_id}", response_model=OrganizationResponse)
async def update_organization(
    org_id: int = Path(...),
    org_data: OrganizationUpdate = Body(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Get organization
    org = db.query(Organization).filter(Organization.id == org_id).first()
    
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Check if user is a member
    if current_user not in org.members:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this organization"
        )
    
    # Update organization
    if org_data.name is not None:
        # Check if name already exists
        if db.query(Organization).filter(
            Organization.name == org_data.name,
            Organization.id != org_id
        ).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Organization name already exists"
            )
        org.name = org_data.name
    
    if org_data.description is not None:
        org.description = org_data.description
    
    db.commit()
    db.refresh(org)
    
    return org

# Get organization members
@router.get("/{org_id}/members", response_model=List[MemberResponse])
async def get_organization_members(
    org_id: int = Path(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Get organization
    org = db.query(Organization).filter(Organization.id == org_id).first()
    
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Check if user is a member
    if current_user not in org.members:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this organization"
        )
    
    return org.members

# Add member to organization
@router.post("/{org_id}/members")
async def add_organization_member(
    org_id: int = Path(...),
    username: str = Body(..., embed=True),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Get organization
    org = db.query(Organization).filter(Organization.id == org_id).first()
    
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Check if user is a member
    if current_user not in org.members:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this organization"
        )
    
    # Get user to add
    user_to_add = db.query(User).filter(User.username == username).first()
    
    if not user_to_add:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if user is already a member
    if user_to_add in org.members:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a member of this organization"
        )
    
    # Add user to organization
    org.members.append(user_to_add)
    db.commit()
    
    return {"message": "Member added successfully"}

# Remove member from organization
@router.delete("/{org_id}/members/{username}")
async def remove_organization_member(
    org_id: int = Path(...),
    username: str = Path(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Get organization
    org = db.query(Organization).filter(Organization.id == org_id).first()
    
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Check if user is a member
    if current_user not in org.members:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this organization"
        )
    
    # Get user to remove
    user_to_remove = db.query(User).filter(User.username == username).first()
    
    if not user_to_remove:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if user is a member
    if user_to_remove not in org.members:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not a member of this organization"
        )
    
    # Remove user from organization
    org.members.remove(user_to_remove)
    db.commit()
    
    return {"message": "Member removed successfully"}

