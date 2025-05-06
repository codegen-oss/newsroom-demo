from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import uuid
from typing import List

from models import Organization, OrganizationMember, User
from schemas import OrganizationCreate, OrganizationUpdate

class OrganizationService:
    @staticmethod
    def create_organization(db: Session, organization_create: OrganizationCreate, creator_id: uuid.UUID):
        """Create a new organization and add creator as admin"""
        # Check if user exists
        user = db.query(User).filter(User.id == creator_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Create organization
        org_id = str(uuid.uuid4())
        db_organization = Organization(
            id=org_id,
            name=organization_create.name,
            subscription=organization_create.subscription
        )
        
        db.add(db_organization)
        
        # Add creator as admin
        db_member = OrganizationMember(
            id=str(uuid.uuid4()),
            organization_id=org_id,
            user_id=creator_id,
            role="admin"
        )
        
        db.add(db_member)
        db.commit()
        db.refresh(db_organization)
        
        return db_organization
    
    @staticmethod
    def get_organization_by_id(db: Session, organization_id: uuid.UUID):
        """Get an organization by ID"""
        organization = db.query(Organization).filter(Organization.id == organization_id).first()
        
        if not organization:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found"
            )
            
        return organization
    
    @staticmethod
    def get_organizations(db: Session, skip: int = 0, limit: int = 100):
        """Get all organizations"""
        return db.query(Organization).offset(skip).limit(limit).all()
    
    @staticmethod
    def update_organization(db: Session, organization_id: uuid.UUID, organization_update: OrganizationUpdate):
        """Update an organization"""
        db_organization = db.query(Organization).filter(Organization.id == organization_id).first()
        
        if not db_organization:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found"
            )
        
        # Update fields if provided
        if organization_update.name is not None:
            db_organization.name = organization_update.name
        if organization_update.subscription is not None:
            db_organization.subscription = organization_update.subscription
        
        db.commit()
        db.refresh(db_organization)
        
        return db_organization
    
    @staticmethod
    def delete_organization(db: Session, organization_id: uuid.UUID):
        """Delete an organization"""
        db_organization = db.query(Organization).filter(Organization.id == organization_id).first()
        
        if not db_organization:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found"
            )
            
        # Delete all members first (due to foreign key constraints)
        db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == organization_id
        ).delete()
        
        # Delete organization
        db.delete(db_organization)
        db.commit()
        
        return {"message": "Organization deleted successfully"}
    
    @staticmethod
    def add_organization_member(db: Session, organization_id: uuid.UUID, user_id: uuid.UUID, role: str = "member"):
        """Add a member to an organization"""
        # Check if organization exists
        organization = db.query(Organization).filter(Organization.id == organization_id).first()
        if not organization:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found"
            )
        
        # Check if user exists
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Check if user is already a member
        existing_member = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == organization_id,
            OrganizationMember.user_id == user_id
        ).first()
        
        if existing_member:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is already a member of this organization"
            )
        
        # Add member
        db_member = OrganizationMember(
            id=str(uuid.uuid4()),
            organization_id=organization_id,
            user_id=user_id,
            role=role
        )
        
        db.add(db_member)
        db.commit()
        db.refresh(db_member)
        
        return db_member
    
    @staticmethod
    def remove_organization_member(db: Session, organization_id: uuid.UUID, user_id: uuid.UUID):
        """Remove a member from an organization"""
        # Check if member exists
        db_member = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == organization_id,
            OrganizationMember.user_id == user_id
        ).first()
        
        if not db_member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Member not found in organization"
            )
        
        # Check if member is the last admin
        if db_member.role == "admin":
            admin_count = db.query(OrganizationMember).filter(
                OrganizationMember.organization_id == organization_id,
                OrganizationMember.role == "admin"
            ).count()
            
            if admin_count <= 1:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cannot remove the last admin from an organization"
                )
        
        # Remove member
        db.delete(db_member)
        db.commit()
        
        return {"message": "Member removed successfully"}
    
    @staticmethod
    def get_organization_members(db: Session, organization_id: uuid.UUID):
        """Get all members of an organization"""
        # Check if organization exists
        organization = db.query(Organization).filter(Organization.id == organization_id).first()
        if not organization:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found"
            )
        
        # Get members
        members = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == organization_id
        ).all()
        
        return members
    
    @staticmethod
    def update_member_role(db: Session, organization_id: uuid.UUID, user_id: uuid.UUID, new_role: str):
        """Update a member's role in an organization"""
        # Check if member exists
        db_member = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == organization_id,
            OrganizationMember.user_id == user_id
        ).first()
        
        if not db_member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Member not found in organization"
            )
        
        # Check if member is the last admin and being demoted
        if db_member.role == "admin" and new_role != "admin":
            admin_count = db.query(OrganizationMember).filter(
                OrganizationMember.organization_id == organization_id,
                OrganizationMember.role == "admin"
            ).count()
            
            if admin_count <= 1:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cannot demote the last admin of an organization"
                )
        
        # Update role
        db_member.role = new_role
        db.commit()
        db.refresh(db_member)
        
        return db_member

