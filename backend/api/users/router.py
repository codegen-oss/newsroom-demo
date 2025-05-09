from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from bson import ObjectId

from ...utils.auth.jwt import get_current_user, TokenData
from ...utils.database import mongo_db
from ...models.user.user_model import UserUpdate, UserResponse, UserPreferences

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: TokenData = Depends(get_current_user)):
    user = await mongo_db.users.find_one({"_id": ObjectId(current_user.user_id)})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Convert MongoDB _id to string for the response
    user["id"] = str(user["_id"])
    del user["_id"]
    del user["password_hash"]
    
    return user


@router.put("/me", response_model=UserResponse)
async def update_user_info(
    user_update: UserUpdate,
    current_user: TokenData = Depends(get_current_user)
):
    # Create update data dictionary
    update_data = {}
    
    # Only include fields that are provided
    if user_update.display_name is not None:
        update_data["display_name"] = user_update.display_name
    
    if user_update.profile_image is not None:
        update_data["profile_image"] = user_update.profile_image
    
    if user_update.preferences is not None:
        update_data["preferences"] = user_update.preferences.dict()
    
    # Update user in database
    if update_data:
        result = await mongo_db.users.update_one(
            {"_id": ObjectId(current_user.user_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
    
    # Get updated user
    updated_user = await mongo_db.users.find_one({"_id": ObjectId(current_user.user_id)})
    
    # Convert MongoDB _id to string for the response
    updated_user["id"] = str(updated_user["_id"])
    del updated_user["_id"]
    del updated_user["password_hash"]
    
    return updated_user


@router.get("/me/interests")
async def get_user_interests(current_user: TokenData = Depends(get_current_user)):
    user_interests = await mongo_db.user_interests.find_one({"user_id": current_user.user_id})
    
    if not user_interests:
        # Return default empty interests if none exist
        return {
            "user_id": current_user.user_id,
            "categories": [],
            "regions": [],
            "topics": [],
            "sources": [],
            "followed_authors": [],
        }
    
    # Convert MongoDB _id to string for the response
    user_interests["id"] = str(user_interests["_id"])
    del user_interests["_id"]
    
    return user_interests


@router.put("/me/interests")
async def update_user_interests(
    interests: dict,
    current_user: TokenData = Depends(get_current_user)
):
    # Ensure user_id is set correctly
    interests["user_id"] = current_user.user_id
    
    # Update or insert user interests
    result = await mongo_db.user_interests.update_one(
        {"user_id": current_user.user_id},
        {"$set": interests},
        upsert=True
    )
    
    # Get updated interests
    updated_interests = await mongo_db.user_interests.find_one({"user_id": current_user.user_id})
    
    # Convert MongoDB _id to string for the response
    updated_interests["id"] = str(updated_interests["_id"])
    del updated_interests["_id"]
    
    return updated_interests


@router.get("/me/history")
async def get_user_history(
    current_user: TokenData = Depends(get_current_user),
    limit: int = 10,
    skip: int = 0
):
    # Get user history with pagination
    cursor = mongo_db.user_history.find(
        {"user_id": current_user.user_id}
    ).sort("read_at", -1).skip(skip).limit(limit)
    
    history_items = await cursor.to_list(length=limit)
    
    # Convert MongoDB _id to string for each item
    for item in history_items:
        item["id"] = str(item["_id"])
        del item["_id"]
    
    # Get total count for pagination
    total_count = await mongo_db.user_history.count_documents({"user_id": current_user.user_id})
    
    return {
        "items": history_items,
        "total": total_count,
        "limit": limit,
        "skip": skip
    }


@router.delete("/me/history/{article_id}")
async def delete_history_item(
    article_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    result = await mongo_db.user_history.delete_one({
        "user_id": current_user.user_id,
        "article_id": article_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="History item not found",
        )
    
    return {"detail": "History item deleted successfully"}

