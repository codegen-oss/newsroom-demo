from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database.database import get_db
from ..models.organization import Organization
from ..models.organization_member import OrganizationMember
from ..models.user import User
from ..models.subscription import Subscription
from ..schemas.organization import (
    OrganizationCreate, 
    OrganizationUpdate, 
    OrganizationResponse,
    OrganizationMemberCreate,
    OrganizationMemberUpdate,
    OrganizationMemberResponse,
    OrganizationWithMembers,
    OrganizationMemberInvite,
    SubscriptionCreate,
    SubscriptionUpdate,
    SubscriptionResponse
)
from ..auth.auth import get_current_user
import uuid
from datetime import datetime, timedelta

router = APIRouter()

# Organization endpoints
@router.get("/", response_model=List[OrganizationResponse])
async def get_organizations(
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get organizations where the user is a member
    member_orgs = db.query(OrganizationMember).filter(
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.is_active == True
    ).all()
    org_ids = [member.organization_id for member in member_orgs]
    
    organizations = db.query(Organization).filter(Organization.id.in_(org_ids)).offset(skip).limit(limit).all()
    return organizations

@router.get("/{org_id}", response_model=OrganizationWithMembers)
async def get_organization(
    org_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is a member of this organization
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.is_active == True
    ).first()
    
    if not member:
        raise HTTPException(status_code=403, detail="You are not a member of this organization")
    
    organization = db.query(Organization).filter(Organization.id == org_id).first()
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    # Get all members
    members = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.is_active == True
    ).all()
    
    # Create response with members
    response = OrganizationWithMembers(
        id=organization.id,
        name=organization.name,
        subscription=organization.subscription,
        created_at=organization.created_at,
        members=members
    )
    
    return response

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
        role="admin",
        is_active=True
    )
    
    db.add(member)
    db.commit()
    
    # Create default subscription
    subscription = Subscription(
        organization_id=new_org.id,
        tier="basic",
        status="active",
        payment_details={},
        price=0.0,
        expires_at=datetime.utcnow() + timedelta(days=30)
    )
    
    db.add(subscription)
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
        OrganizationMember.role == "admin",
        OrganizationMember.is_active == True
    ).first()
    
    if not member:
        raise HTTPException(status_code=403, detail="You must be an admin to update this organization")
    
    organization = db.query(Organization).filter(Organization.id == org_id).first()
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    # Update fields if provided
    for field, value in org_update.dict(exclude_unset=True).items():
        setattr(organization, field, value)
    
    organization.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(organization)
    return organization

@router.delete("/{org_id}")
async def delete_organization(
    org_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is an admin of this organization
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == "admin",
        OrganizationMember.is_active == True
    ).first()
    
    if not member:
        raise HTTPException(status_code=403, detail="You must be an admin to delete this organization")
    
    organization = db.query(Organization).filter(Organization.id == org_id).first()
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    # Delete organization (this will cascade to members due to relationship)
    db.delete(organization)
    db.commit()
    
    return {"message": "Organization deleted successfully"}

# Member management endpoints
@router.get("/{org_id}/members", response_model=List[OrganizationMemberResponse])
async def get_organization_members(
    org_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is a member of this organization
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.is_active == True
    ).first()
    
    if not member:
        raise HTTPException(status_code=403, detail="You are not a member of this organization")
    
    members = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.is_active == True
    ).all()
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
        OrganizationMember.role == "admin",
        OrganizationMember.is_active == True
    ).first()
    
    if not admin:
        raise HTTPException(status_code=403, detail="You must be an admin to add members")
    
    # Check if user already exists in the organization
    existing_member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == member_data.user_id
    ).first()
    
    if existing_member:
        if existing_member.is_active:
            raise HTTPException(status_code=400, detail="User is already a member of this organization")
        else:
            # Reactivate the member
            existing_member.is_active = True
            existing_member.role = member_data.role
            existing_member.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(existing_member)
            return existing_member
    
    # Add new member
    new_member = OrganizationMember(
        organization_id=org_id,
        user_id=member_data.user_id,
        role=member_data.role,
        is_active=True
    )
    
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member

@router.post("/{org_id}/invite", response_model=dict)
async def invite_member(
    org_id: str,
    invite_data: OrganizationMemberInvite,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is an admin of this organization
    admin = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == "admin",
        OrganizationMember.is_active == True
    ).first()
    
    if not admin:
        raise HTTPException(status_code=403, detail="You must be an admin to invite members")
    
    # Check if user with this email exists
    user = db.query(User).filter(User.email == invite_data.email).first()
    
    if user:
        # Check if user is already a member
        existing_member = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.user_id == user.id
        ).first()
        
        if existing_member and existing_member.is_active:
            raise HTTPException(status_code=400, detail="User is already a member of this organization")
        
        if existing_member:
            # Reactivate the member
            existing_member.is_active = True
            existing_member.role = invite_data.role
            existing_member.updated_at = datetime.utcnow()
            db.commit()
        else:
            # Add user as a member
            new_member = OrganizationMember(
                organization_id=org_id,
                user_id=user.id,
                role=invite_data.role,
                is_active=True
            )
            db.add(new_member)
            db.commit()
        
        # In a real app, we would send an email notification here
        # background_tasks.add_task(send_invitation_email, invite_data.email, org_id)
        
        return {"message": "User added to organization"}
    else:
        # In a real app, we would create an invitation record and send an email
        # background_tasks.add_task(send_invitation_email, invite_data.email, org_id)
        
        return {"message": "Invitation sent to user"}

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
        OrganizationMember.role == "admin",
        OrganizationMember.is_active == True
    ).first()
    
    if not admin:
        raise HTTPException(status_code=403, detail="You must be an admin to update member roles")
    
    # Get the member to update
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == user_id,
        OrganizationMember.is_active == True
    ).first()
    
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Update role
    if member_update.role is not None:
        member.role = member_update.role
    
    member.updated_at = datetime.utcnow()
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
        OrganizationMember.role == "admin",
        OrganizationMember.is_active == True
    ).first()
    
    if not admin:
        raise HTTPException(status_code=403, detail="You must be an admin to remove members")
    
    # Get the member to remove
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == user_id,
        OrganizationMember.is_active == True
    ).first()
    
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Don't allow removing the last admin
    if member.role == "admin":
        admin_count = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.role == "admin",
            OrganizationMember.is_active == True
        ).count()
        
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot remove the last admin")
    
    # Instead of deleting, mark as inactive
    member.is_active = False
    member.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Member removed successfully"}

# Subscription management endpoints
@router.get("/{org_id}/subscription", response_model=SubscriptionResponse)
async def get_organization_subscription(
    org_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is a member of this organization
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.is_active == True
    ).first()
    
    if not member:
        raise HTTPException(status_code=403, detail="You are not a member of this organization")
    
    subscription = db.query(Subscription).filter(Subscription.organization_id == org_id).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    return subscription

@router.post("/{org_id}/subscription", response_model=SubscriptionResponse)
async def create_organization_subscription(
    org_id: str,
    subscription_data: SubscriptionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is an admin of this organization
    admin = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == "admin",
        OrganizationMember.is_active == True
    ).first()
    
    if not admin:
        raise HTTPException(status_code=403, detail="You must be an admin to manage subscriptions")
    
    # Check if subscription already exists
    existing_subscription = db.query(Subscription).filter(Subscription.organization_id == org_id).first()
    
    if existing_subscription:
        raise HTTPException(status_code=400, detail="Subscription already exists. Use PUT to update.")
    
    # Set price based on tier
    price = 0.0
    if subscription_data.tier == "basic":
        price = 9.99
    elif subscription_data.tier == "premium":
        price = 29.99
    elif subscription_data.tier == "enterprise":
        price = 99.99
    
    # Create new subscription
    new_subscription = Subscription(
        organization_id=org_id,
        tier=subscription_data.tier,
        status="active",
        payment_details=subscription_data.payment_method,
        price=price,
        expires_at=datetime.utcnow() + timedelta(days=30)
    )
    
    db.add(new_subscription)
    db.commit()
    db.refresh(new_subscription)
    
    # Update organization subscription info
    organization = db.query(Organization).filter(Organization.id == org_id).first()
    organization.subscription = {
        "tier": subscription_data.tier,
        "status": "active",
        "price": price,
        "features": get_tier_features(subscription_data.tier)
    }
    db.commit()
    
    return new_subscription

@router.put("/{org_id}/subscription", response_model=SubscriptionResponse)
async def update_organization_subscription(
    org_id: str,
    subscription_update: SubscriptionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is an admin of this organization
    admin = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == "admin",
        OrganizationMember.is_active == True
    ).first()
    
    if not admin:
        raise HTTPException(status_code=403, detail="You must be an admin to manage subscriptions")
    
    # Get existing subscription
    subscription = db.query(Subscription).filter(Subscription.organization_id == org_id).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    # Update fields
    update_data = subscription_update.dict(exclude_unset=True)
    
    # If tier is updated, update price
    if "tier" in update_data:
        tier = update_data["tier"]
        if tier == "basic":
            update_data["price"] = 9.99
        elif tier == "premium":
            update_data["price"] = 29.99
        elif tier == "enterprise":
            update_data["price"] = 99.99
    
    for field, value in update_data.items():
        setattr(subscription, field, value)
    
    subscription.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(subscription)
    
    # Update organization subscription info if tier changed
    if "tier" in update_data:
        organization = db.query(Organization).filter(Organization.id == org_id).first()
        organization.subscription = {
            "tier": subscription.tier,
            "status": subscription.status,
            "price": subscription.price,
            "features": get_tier_features(subscription.tier)
        }
        db.commit()
    
    return subscription

@router.delete("/{org_id}/subscription")
async def cancel_organization_subscription(
    org_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is an admin of this organization
    admin = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.role == "admin",
        OrganizationMember.is_active == True
    ).first()
    
    if not admin:
        raise HTTPException(status_code=403, detail="You must be an admin to manage subscriptions")
    
    # Get existing subscription
    subscription = db.query(Subscription).filter(Subscription.organization_id == org_id).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    # Mark as cancelled
    subscription.status = "cancelled"
    subscription.updated_at = datetime.utcnow()
    db.commit()
    
    # Update organization subscription info
    organization = db.query(Organization).filter(Organization.id == org_id).first()
    organization.subscription = {
        "tier": "basic",
        "status": "cancelled",
        "price": 0.0,
        "features": get_tier_features("basic")
    }
    db.commit()
    
    return {"message": "Subscription cancelled successfully"}

# Helper function to get features for a subscription tier
def get_tier_features(tier: str) -> List[str]:
    if tier == "basic":
        return [
            "Up to 5 members",
            "Basic content access",
            "Standard support"
        ]
    elif tier == "premium":
        return [
            "Up to 20 members",
            "Premium content access",
            "Priority support",
            "Custom branding"
        ]
    elif tier == "enterprise":
        return [
            "Unlimited members",
            "All content access",
            "24/7 dedicated support",
            "Custom branding",
            "API access",
            "Advanced analytics"
        ]
    else:
        return []
