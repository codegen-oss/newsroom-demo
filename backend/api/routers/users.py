from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter()

@router.get("/me")
async def get_current_user():
    """Get current user information"""
    return {"message": "Current user endpoint"}

@router.put("/me")
async def update_user():
    """Update current user information"""
    return {"message": "Update user endpoint"}

@router.get("/me/interests")
async def get_user_interests():
    """Get current user interests"""
    return {"message": "User interests endpoint"}

@router.put("/me/interests")
async def update_user_interests():
    """Update current user interests"""
    return {"message": "Update user interests endpoint"}

@router.get("/me/history")
async def get_user_history():
    """Get current user reading history"""
    return {"message": "User history endpoint"}

@router.delete("/me/history/{article_id}")
async def delete_user_history(article_id: str):
    """Delete an article from user history"""
    return {"message": f"Delete article {article_id} from history endpoint"}

