from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.database import get_db
from ..models.organization import Organization
from ..models.organization_member import OrganizationMember
from ..models.user import User
from ..schemas.organization import (
    OrganizationCreate, 
    OrganizationUpdate, 
    OrganizationResponse,
    OrganizationMemberCreate,
    OrganizationMemberUpdate,
    OrganizationMemberResponse
)
from ..auth.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[OrganizationResponse])
async def get_organizations(
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get organizations where the user is a member
    member_orgs = db.query(OrganizationMember).filter(OrganizationMember.user_id == current_user.id).all()
    org_ids = [member.organization_id for member in member_orgs]
    
    organizations = db.query(Organization).filter(Organization.id.in_(org_ids)).offset(skip).limit(limit).all()
    return organizations

@router.get("/{org_id}", response_model=OrganizationResponse)
async def get_organization(
    org_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is a member of this organization
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    
    if not member:
        raise HTTPException(status_code=403, detail="You are not a member of this organization")
    
    organization = db.query(Organization).filter(Organization.id == org_id).first()
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    return organization

@router.post("/", response_model=OrganizationResponse)
async def create_organization(
    org: OrganizationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Create new organization
    new_org = Organization(
        name=org.name,
        subscription=org.subscription
    )
    
    db.add(new_org)
    db.commit()
    db.refresh(new_org)
    
    # Add current user as admin
    member = OrganizationMember(
        organization_id=new_org.id,
        user_id=current_user.id,
        role="admin"
    )
    
    db.add(member)
    db.commit()
    
    return new_org

@router.put("/{org_id}", response_model=OrganizationResponse)
async def update_organization(
    org_id: str,
    org_update: OrganizationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is an admin of this organization
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == "admin"
    ).first()
    
    if not member:
        raise HTTPException(status_code=403, detail="You must be an admin to update this organization")
    
    organization = db.query(Organization).filter(Organization.id == org_id).first()
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    # Update fields if provided
    for field, value in org_update.dict(exclude_unset=True).items():
        setattr(organization, field, value)
    
    db.commit()
    db.refresh(organization)
    return organization

@router.get("/{org_id}/members", response_model=List[OrganizationMemberResponse])
async def get_organization_members(
    org_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is a member of this organization
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    
    if not member:
        raise HTTPException(status_code=403, detail="You are not a member of this organization")
    
    members = db.query(OrganizationMember).filter(OrganizationMember.organization_id == org_id).all()
    return members

@router.post("/{org_id}/members", response_model=OrganizationMemberResponse)
async def add_organization_member(
    org_id: str,
    member_data: OrganizationMemberCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is an admin of this organization
    admin = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == "admin"
    ).first()
    
    if not admin:
        raise HTTPException(status_code=403, detail="You must be an admin to add members")
    
    # Check if user already exists in the organization
    existing_member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == member_data.user_id
    ).first()
    
    if existing_member:
        raise HTTPException(status_code=400, detail="User is already a member of this organization")
    
    # Add new member
    new_member = OrganizationMember(
        organization_id=org_id,
        user_id=member_data.user_id,
        role=member_data.role
    )
    
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member

@router.put("/{org_id}/members/{user_id}", response_model=OrganizationMemberResponse)
async def update_member_role(
    org_id: str,
    user_id: str,
    member_update: OrganizationMemberUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if current user is an admin
    admin = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == "admin"
    ).first()
    
    if not admin:
        raise HTTPException(status_code=403, detail="You must be an admin to update member roles")
    
    # Get the member to update
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == user_id
    ).first()
    
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Update role
    if member_update.role is not None:
        member.role = member_update.role
    
    db.commit()
    db.refresh(member)
    return member

@router.delete("/{org_id}/members/{user_id}")
async def remove_organization_member(
    org_id: str,
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if current user is an admin
    admin = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == "admin"
    ).first()
    
    if not admin:
        raise HTTPException(status_code=403, detail="You must be an admin to remove members")
    
    # Get the member to remove
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == user_id
    ).first()
    
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Don't allow removing the last admin
    if member.role == "admin":
        admin_count = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.role == "admin"
        ).count()
        
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot remove the last admin")
    
    db.delete(member)
    db.commit()
    return {"message": "Member removed successfully"}

