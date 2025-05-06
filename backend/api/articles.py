from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from db import get_db
from models import User
from schemas import ArticleCreate, ArticleUpdate, ArticleResponse
from services import ArticleService
from utils.auth import get_current_active_user

router = APIRouter()

@router.post("/", response_model=ArticleResponse)
def create_article(
    article_create: ArticleCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new article (admin only)"""
    # In a real app, you would check if the user has admin privileges
    # For simplicity, we'll allow any authenticated user to create articles
    return ArticleService.create_article(db, article_create)

@router.get("/", response_model=List[ArticleResponse])
def read_articles(
    skip: int = 0,
    limit: int = 100,
    access_tier: Optional[str] = Query(None, description="Filter by access tier (free, premium, organization)"),
    category: Optional[str] = Query(None, description="Filter by category"),
    db: Session = Depends(get_db)
):
    """Get all articles with optional filtering"""
    return ArticleService.get_articles(db, skip, limit, access_tier, category)

@router.get("/{article_id}", response_model=ArticleResponse)
def read_article(
    article_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """Get an article by ID"""
    return ArticleService.get_article_by_id(db, article_id)

@router.put("/{article_id}", response_model=ArticleResponse)
def update_article(
    article_id: uuid.UUID,
    article_update: ArticleUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update an article (admin only)"""
    # In a real app, you would check if the user has admin privileges
    # For simplicity, we'll allow any authenticated user to update articles
    return ArticleService.update_article(db, article_id, article_update)

@router.delete("/{article_id}")
def delete_article(
    article_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete an article (admin only)"""
    # In a real app, you would check if the user has admin privileges
    # For simplicity, we'll allow any authenticated user to delete articles
    return ArticleService.delete_article(db, article_id)

