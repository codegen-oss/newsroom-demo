from fastapi import APIRouter

from app.api.endpoints import auth, users, articles, organizations

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(articles.router, prefix="/articles", tags=["articles"])
api_router.include_router(organizations.router, prefix="/organizations", tags=["organizations"])

