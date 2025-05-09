from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Organization, OrganizationMember, User, UserRole
from app.schemas import Organization as OrganizationSchema, OrganizationCreate, OrganizationUpdate
from app.schemas import OrganizationMember as OrganizationMemberSchema, OrganizationMemberCreate, OrganizationMemberUpdate
from app.auth.auth import get_current_active_user

router = APIRouter(
    prefix="/organizations",
    tags=["organizations"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=OrganizationSchema)
def create_organization(
    organization: OrganizationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if user has organization tier subscription
    if current_user.subscription_tier != "organization":
        raise HTTPException(status_code=403, detail="Only organization tier users can create organizations")
    
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
        role=UserRole.admin
    )
    db.add(db_member)
    db.commit()
    
    return db_organization

@router.get("/", response_model=List[OrganizationSchema])
def read_organizations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get organizations where user is a member
    member_orgs = db.query(OrganizationMember).filter(OrganizationMember.user_id == current_user.id).all()
    org_ids = [member.organization_id for member in member_orgs]
    
    organizations = db.query(Organization).filter(Organization.id.in_(org_ids)).offset(skip).limit(limit).all()
    return organizations

@router.get("/{organization_id}", response_model=OrganizationSchema)
def read_organization(
    organization_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if user is a member of the organization
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    
    if not member:
        raise HTTPException(status_code=403, detail="Not a member of this organization")
    
    organization = db.query(Organization).filter(Organization.id == organization_id).first()
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    return organization

@router.put("/{organization_id}", response_model=OrganizationSchema)
def update_organization(
    organization_id: str,
    organization: OrganizationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if user is an admin of the organization
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == UserRole.admin
    ).first()
    
    if not member:
        raise HTTPException(status_code=403, detail="Not authorized to update this organization")
    
    db_organization = db.query(Organization).filter(Organization.id == organization_id).first()
    if not db_organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    # Update organization fields
    for key, value in organization.dict(exclude_unset=True).items():
        setattr(db_organization, key, value)
    
    db.commit()
    db.refresh(db_organization)
    return db_organization

@router.delete("/{organization_id}")
def delete_organization(
    organization_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if user is an admin of the organization
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == UserRole.admin
    ).first()
    
    if not member:
        raise HTTPException(status_code=403, detail="Not authorized to delete this organization")
    
    db_organization = db.query(Organization).filter(Organization.id == organization_id).first()
    if not db_organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    # Delete all members first
    db.query(OrganizationMember).filter(OrganizationMember.organization_id == organization_id).delete()
    
    # Delete organization
    db.delete(db_organization)
    db.commit()
    return {"detail": "Organization deleted"}

# Organization Members endpoints
@router.post("/members", response_model=OrganizationMemberSchema)
def create_organization_member(
    member: OrganizationMemberCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if user is an admin of the organization
    admin_check = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == member.organization_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == UserRole.admin
    ).first()
    
    if not admin_check:
        raise HTTPException(status_code=403, detail="Not authorized to add members to this organization")
    
    # Check if user exists
    user = db.query(User).filter(User.id == member.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if user is already a member
    existing_member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == member.organization_id,
        OrganizationMember.user_id == member.user_id
    ).first()
    
    if existing_member:
        raise HTTPException(status_code=400, detail="User is already a member of this organization")
    
    # Create member
    db_member = OrganizationMember(
        organization_id=member.organization_id,
        user_id=member.user_id,
        role=member.role
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

@router.get("/members/{organization_id}", response_model=List[OrganizationMemberSchema])
def read_organization_members(
    organization_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if user is a member of the organization
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    
    if not member:
        raise HTTPException(status_code=403, detail="Not a member of this organization")
    
    members = db.query(OrganizationMember).filter(OrganizationMember.organization_id == organization_id).all()
    return members

@router.put("/members/{member_id}", response_model=OrganizationMemberSchema)
def update_organization_member(
    member_id: str,
    member_update: OrganizationMemberUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_member = db.query(OrganizationMember).filter(OrganizationMember.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Check if user is an admin of the organization
    admin_check = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == db_member.organization_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == UserRole.admin
    ).first()
    
    if not admin_check:
        raise HTTPException(status_code=403, detail="Not authorized to update members in this organization")
    
    # Update member role
    db_member.role = member_update.role
    
    db.commit()
    db.refresh(db_member)
    return db_member

@router.delete("/members/{member_id}")
def delete_organization_member(
    member_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_member = db.query(OrganizationMember).filter(OrganizationMember.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Check if user is an admin of the organization
    admin_check = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == db_member.organization_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == UserRole.admin
    ).first()
    
    if not admin_check:
        raise HTTPException(status_code=403, detail="Not authorized to remove members from this organization")
    
    # Prevent removing the last admin
    if db_member.role == UserRole.admin:
        admin_count = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == db_member.organization_id,
            OrganizationMember.role == UserRole.admin
        ).count()
        
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot remove the last admin from the organization")
    
    db.delete(db_member)
    db.commit()
    return {"detail": "Member removed from organization"}

