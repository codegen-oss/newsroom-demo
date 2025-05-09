from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

from ...utils.auth.jwt import get_current_user, TokenData, has_role
from ...utils.database import mongo_db
from ...models.organization.organization_model import (
    OrganizationCreate,
    OrganizationUpdate,
    OrganizationResponse,
    OrganizationMemberCreate,
    OrganizationMemberUpdate,
    OrganizationMemberResponse
)

router = APIRouter()


@router.post("/", response_model=OrganizationResponse)
async def create_organization(
    org_data: OrganizationCreate,
    current_user: TokenData = Depends(get_current_user)
):
    # Check if user has the right subscription tier
    if current_user.subscription_tier != "organization":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Organization creation requires organization subscription tier",
        )
    
    # Convert organization data to dict
    org_dict = org_data.dict()
    org_dict["created_at"] = datetime.utcnow()
    org_dict["updated_at"] = datetime.utcnow()
    
    # Insert organization into database
    result = await mongo_db.organizations.insert_one(org_dict)
    
    # Create organization member entry for the creator (as admin)
    member_data = {
        "organization_id": str(result.inserted_id),
        "user_id": current_user.user_id,
        "role": "admin",
        "joined_at": datetime.utcnow(),
        "invited_by": current_user.user_id
    }
    await mongo_db.organization_members.insert_one(member_data)
    
    # Get the created organization
    created_org = await mongo_db.organizations.find_one({"_id": result.inserted_id})
    
    # Convert MongoDB _id to string for the response
    created_org["id"] = str(created_org["_id"])
    del created_org["_id"]
    
    return created_org


@router.get("/", response_model=List[OrganizationResponse])
async def get_user_organizations(current_user: TokenData = Depends(get_current_user)):
    # Get organizations where the user is a member
    member_entries = await mongo_db.organization_members.find(
        {"user_id": current_user.user_id}
    ).to_list(length=100)
    
    if not member_entries:
        return []
    
    # Get organization IDs
    org_ids = [ObjectId(entry["organization_id"]) for entry in member_entries]
    
    # Get organizations
    organizations = await mongo_db.organizations.find(
        {"_id": {"$in": org_ids}}
    ).to_list(length=100)
    
    # Convert MongoDB _id to string for each organization
    for org in organizations:
        org["id"] = str(org["_id"])
        del org["_id"]
    
    return organizations


@router.get("/{org_id}", response_model=OrganizationResponse)
async def get_organization(
    org_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    # Check if user is a member of the organization
    member = await mongo_db.organization_members.find_one({
        "organization_id": org_id,
        "user_id": current_user.user_id
    })
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this organization",
        )
    
    # Get organization
    organization = await mongo_db.organizations.find_one({"_id": ObjectId(org_id)})
    
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    
    # Convert MongoDB _id to string for the response
    organization["id"] = str(organization["_id"])
    del organization["_id"]
    
    return organization


@router.put("/{org_id}", response_model=OrganizationResponse)
async def update_organization(
    org_id: str,
    org_update: OrganizationUpdate,
    current_user: TokenData = Depends(get_current_user)
):
    # Check if user is an admin of the organization
    member = await mongo_db.organization_members.find_one({
        "organization_id": org_id,
        "user_id": current_user.user_id
    })
    
    if not member or member["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be an admin to update the organization",
        )
    
    # Convert update data to dict and remove None values
    update_data = {k: v for k, v in org_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    if update_data:
        # Update organization in database
        result = await mongo_db.organizations.update_one(
            {"_id": ObjectId(org_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found",
            )
    
    # Get updated organization
    updated_org = await mongo_db.organizations.find_one({"_id": ObjectId(org_id)})
    
    # Convert MongoDB _id to string for the response
    updated_org["id"] = str(updated_org["_id"])
    del updated_org["_id"]
    
    return updated_org


@router.get("/{org_id}/members", response_model=List[OrganizationMemberResponse])
async def get_organization_members(
    org_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    # Check if user is a member of the organization
    member = await mongo_db.organization_members.find_one({
        "organization_id": org_id,
        "user_id": current_user.user_id
    })
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this organization",
        )
    
    # Get organization members
    members = await mongo_db.organization_members.find(
        {"organization_id": org_id}
    ).to_list(length=100)
    
    # Convert MongoDB _id to string for each member
    for m in members:
        m["id"] = str(m["_id"])
        del m["_id"]
    
    return members


@router.post("/{org_id}/members", response_model=OrganizationMemberResponse)
async def add_organization_member(
    org_id: str,
    member_data: OrganizationMemberCreate,
    current_user: TokenData = Depends(get_current_user)
):
    # Check if user is an admin of the organization
    admin_check = await mongo_db.organization_members.find_one({
        "organization_id": org_id,
        "user_id": current_user.user_id,
        "role": "admin"
    })
    
    if not admin_check:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be an admin to add members",
        )
    
    # Check if the user exists
    user = await mongo_db.users.find_one({"_id": ObjectId(member_data.user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Check if the user is already a member
    existing_member = await mongo_db.organization_members.find_one({
        "organization_id": org_id,
        "user_id": member_data.user_id
    })
    
    if existing_member:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a member of this organization",
        )
    
    # Create member data
    new_member = {
        "organization_id": org_id,
        "user_id": member_data.user_id,
        "role": member_data.role,
        "joined_at": datetime.utcnow(),
        "invited_by": current_user.user_id
    }
    
    # Insert member into database
    result = await mongo_db.organization_members.insert_one(new_member)
    
    # Get the created member
    created_member = await mongo_db.organization_members.find_one({"_id": result.inserted_id})
    
    # Convert MongoDB _id to string for the response
    created_member["id"] = str(created_member["_id"])
    del created_member["_id"]
    
    return created_member


@router.put("/{org_id}/members/{member_id}", response_model=OrganizationMemberResponse)
async def update_organization_member(
    org_id: str,
    member_id: str,
    member_update: OrganizationMemberUpdate,
    current_user: TokenData = Depends(get_current_user)
):
    # Check if user is an admin of the organization
    admin_check = await mongo_db.organization_members.find_one({
        "organization_id": org_id,
        "user_id": current_user.user_id,
        "role": "admin"
    })
    
    if not admin_check:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be an admin to update members",
        )
    
    # Get the member to update
    member = await mongo_db.organization_members.find_one({
        "_id": ObjectId(member_id),
        "organization_id": org_id
    })
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found",
        )
    
    # Prevent removing the last admin
    if member["role"] == "admin" and member_update.role != "admin":
        # Count admins
        admin_count = await mongo_db.organization_members.count_documents({
            "organization_id": org_id,
            "role": "admin"
        })
        
        if admin_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot remove the last admin of the organization",
            )
    
    # Update member in database
    result = await mongo_db.organization_members.update_one(
        {"_id": ObjectId(member_id)},
        {"$set": {"role": member_update.role}}
    )
    
    # Get updated member
    updated_member = await mongo_db.organization_members.find_one({"_id": ObjectId(member_id)})
    
    # Convert MongoDB _id to string for the response
    updated_member["id"] = str(updated_member["_id"])
    del updated_member["_id"]
    
    return updated_member


@router.delete("/{org_id}/members/{member_id}")
async def remove_organization_member(
    org_id: str,
    member_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    # Check if user is an admin of the organization
    admin_check = await mongo_db.organization_members.find_one({
        "organization_id": org_id,
        "user_id": current_user.user_id,
        "role": "admin"
    })
    
    if not admin_check:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be an admin to remove members",
        )
    
    # Get the member to remove
    member = await mongo_db.organization_members.find_one({
        "_id": ObjectId(member_id),
        "organization_id": org_id
    })
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found",
        )
    
    # Prevent removing the last admin
    if member["role"] == "admin":
        # Count admins
        admin_count = await mongo_db.organization_members.count_documents({
            "organization_id": org_id,
            "role": "admin"
        })
        
        if admin_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot remove the last admin of the organization",
            )
    
    # Remove member from database
    result = await mongo_db.organization_members.delete_one({"_id": ObjectId(member_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found",
        )
    
    return {"detail": "Member removed successfully"}

