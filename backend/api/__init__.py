from fastapi import APIRouter

from .auth import router as auth_router
from .users import router as users_router
from .articles import router as articles_router
from .organizations import router as organizations_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(articles_router, prefix="/articles", tags=["articles"])
api_router.include_router(organizations_router, prefix="/organizations", tags=["organizations"])

__all__ = ["api_router"]

