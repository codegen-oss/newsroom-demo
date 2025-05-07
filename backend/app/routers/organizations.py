from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
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
from ..auth.auth import get_current_user, get_current_active_user
from sqlalchemy.exc import SQLAlchemyError

router = APIRouter()

@router.get("/", response_model=List[OrganizationResponse])
async def get_organizations(
    skip: int = Query(0, ge=0, description="Number of organizations to skip"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of organizations to return"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get a list of organizations where the current user is a member.
    Results are paginated using skip and limit parameters.
    """
    try:
        # Get organizations where the user is a member
        member_orgs = db.query(OrganizationMember).filter(OrganizationMember.user_id == current_user.id).all()
        org_ids = [member.organization_id for member in member_orgs]
        
        organizations = db.query(Organization).filter(Organization.id.in_(org_ids)).offset(skip).limit(limit).all()
        return organizations
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@router.get("/{org_id}", response_model=OrganizationResponse)
async def get_organization(
    org_id: str = Path(..., description="The ID of the organization to retrieve"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific organization by its ID.
    User must be a member of the organization to access it.
    """
    try:
        # Check if user is a member of this organization
        member = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.user_id == current_user.id
        ).first()
        
        if not member:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="You are not a member of this organization"
            )
        
        organization = db.query(Organization).filter(Organization.id == org_id).first()
        if not organization:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Organization not found"
            )
        
        return organization
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@router.post("/", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
async def create_organization(
    org: OrganizationCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new organization.
    The current user will automatically be added as an admin.
    """
    # Validate organization name
    if not org.name or len(org.name.strip()) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organization name cannot be empty"
        )
    
    try:
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
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create organization: {str(e)}"
        )

@router.put("/{org_id}", response_model=OrganizationResponse)
async def update_organization(
    org_id: str = Path(..., description="The ID of the organization to update"),
    org_update: OrganizationUpdate = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update an existing organization.
    User must be an admin of the organization to update it.
    """
    try:
        # Check if user is an admin of this organization
        member = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.user_id == current_user.id,
            OrganizationMember.role == "admin"
        ).first()
        
        if not member:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="You must be an admin to update this organization"
            )
        
        organization = db.query(Organization).filter(Organization.id == org_id).first()
        if not organization:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Organization not found"
            )
        
        # Validate organization name if provided
        if org_update.name is not None and len(org_update.name.strip()) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Organization name cannot be empty"
            )
        
        # Update fields if provided
        for field, value in org_update.dict(exclude_unset=True).items():
            setattr(organization, field, value)
        
        db.commit()
        db.refresh(organization)
        return organization
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update organization: {str(e)}"
        )

@router.delete("/{org_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_organization(
    org_id: str = Path(..., description="The ID of the organization to delete"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete an organization.
    User must be an admin of the organization to delete it.
    """
    try:
        # Check if user is an admin of this organization
        member = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.user_id == current_user.id,
            OrganizationMember.role == "admin"
        ).first()
        
        if not member:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="You must be an admin to delete this organization"
            )
        
        organization = db.query(Organization).filter(Organization.id == org_id).first()
        if not organization:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Organization not found"
            )
        
        # Delete all members first (to avoid foreign key constraints)
        db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == org_id
        ).delete()
        
        # Delete the organization
        db.delete(organization)
        db.commit()
        return None
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete organization: {str(e)}"
        )

@router.get("/{org_id}/members", response_model=List[OrganizationMemberResponse])
async def get_organization_members(
    org_id: str = Path(..., description="The ID of the organization"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get a list of all members in an organization.
    User must be a member of the organization to access this information.
    """
    try:
        # Check if user is a member of this organization
        member = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.user_id == current_user.id
        ).first()
        
        if not member:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="You are not a member of this organization"
            )
        
        members = db.query(OrganizationMember).filter(OrganizationMember.organization_id == org_id).all()
        return members
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@router.post("/{org_id}/members", response_model=OrganizationMemberResponse, status_code=status.HTTP_201_CREATED)
async def add_organization_member(
    org_id: str = Path(..., description="The ID of the organization"),
    member_data: OrganizationMemberCreate = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Add a new member to an organization.
    User must be an admin of the organization to add members.
    """
    # Validate role
    valid_roles = ["admin", "member"]
    if member_data.role not in valid_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}"
        )
    
    try:
        # Check if user is an admin of this organization
        admin = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.user_id == current_user.id,
            OrganizationMember.role == "admin"
        ).first()
        
        if not admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="You must be an admin to add members"
            )
        
        # Check if organization exists
        org = db.query(Organization).filter(Organization.id == org_id).first()
        if not org:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Organization not found"
            )
        
        # Check if user exists
        user = db.query(User).filter(User.id == member_data.user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="User not found"
            )
        
        # Check if user already exists in the organization
        existing_member = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.user_id == member_data.user_id
        ).first()
        
        if existing_member:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="User is already a member of this organization"
            )
        
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
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add member: {str(e)}"
        )

@router.put("/{org_id}/members/{user_id}", response_model=OrganizationMemberResponse)
async def update_member_role(
    org_id: str = Path(..., description="The ID of the organization"),
    user_id: str = Path(..., description="The ID of the user to update"),
    member_update: OrganizationMemberUpdate = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update a member's role in an organization.
    User must be an admin of the organization to update member roles.
    """
    # Validate role if provided
    if member_update.role is not None:
        valid_roles = ["admin", "member"]
        if member_update.role not in valid_roles:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}"
            )
    
    try:
        # Check if current user is an admin
        admin = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.user_id == current_user.id,
            OrganizationMember.role == "admin"
        ).first()
        
        if not admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="You must be an admin to update member roles"
            )
        
        # Get the member to update
        member = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.user_id == user_id
        ).first()
        
        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Member not found"
            )
        
        # Update role
        if member_update.role is not None:
            member.role = member_update.role
        
        db.commit()
        db.refresh(member)
        return member
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update member role: {str(e)}"
        )

@router.delete("/{org_id}/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_organization_member(
    org_id: str = Path(..., description="The ID of the organization"),
    user_id: str = Path(..., description="The ID of the user to remove"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Remove a member from an organization.
    User must be an admin of the organization to remove members.
    Cannot remove the last admin of an organization.
    """
    try:
        # Check if current user is an admin
        admin = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.user_id == current_user.id,
            OrganizationMember.role == "admin"
        ).first()
        
        if not admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="You must be an admin to remove members"
            )
        
        # Get the member to remove
        member = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.user_id == user_id
        ).first()
        
        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Member not found"
            )
        
        # Don't allow removing the last admin
        if member.role == "admin":
            admin_count = db.query(OrganizationMember).filter(
                OrganizationMember.organization_id == org_id,
                OrganizationMember.role == "admin"
            ).count()
            
            if admin_count <= 1:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail="Cannot remove the last admin"
                )
        
        db.delete(member)
        db.commit()
        return None
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to remove member: {str(e)}"
        )
