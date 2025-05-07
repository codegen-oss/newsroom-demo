from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database.database import get_db
from ..models.article import Article
from ..models.user import User
from ..schemas.article import ArticleCreate, ArticleUpdate, ArticleResponse
from ..auth.auth import get_current_user, get_current_active_user
from sqlalchemy.exc import SQLAlchemyError

router = APIRouter()

@router.get("/", response_model=List[ArticleResponse])
async def get_articles(
    skip: int = Query(0, ge=0, description="Number of articles to skip"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of articles to return"),
    category: Optional[str] = Query(None, description="Filter articles by category"),
    access_tier: Optional[str] = Query(None, description="Filter articles by access tier"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get a list of articles with optional filtering by category and access tier.
    Results are paginated using skip and limit parameters.
    """
    # Validate access tier if provided
    if access_tier and access_tier not in ["free", "premium", "organization"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid access tier. Must be one of: free, premium, organization"
        )
    
    try:
        # Base query
        query = db.query(Article)
        
        # Apply filters if provided
        if category:
            # Filter by category (this is a simplification, as categories is a JSON field)
            # In a real implementation, you might need a more complex query or a different DB schema
            query = query.filter(Article.categories.contains([category]))
        
        if access_tier:
            # Filter by access tier
            query = query.filter(Article.access_tier == access_tier)
        else:
            # If no specific tier is requested, filter based on user's subscription
            if current_user.subscription_tier == "free":
                query = query.filter(Article.access_tier == "free")
            elif current_user.subscription_tier == "individual":
                query = query.filter(Article.access_tier.in_(["free", "premium"]))
            # Organization users can see all content
        
        # Apply pagination
        articles = query.offset(skip).limit(limit).all()
        return articles
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@router.get("/{article_id}", response_model=ArticleResponse)
async def get_article(
    article_id: str = Path(..., description="The ID of the article to retrieve"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific article by its ID.
    Access is restricted based on the user's subscription tier.
    """
    try:
        article = db.query(Article).filter(Article.id == article_id).first()
        if not article:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Article not found"
            )
        
        # Check if user has access to this article
        if article.access_tier == "premium" and current_user.subscription_tier == "free":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Premium content requires a paid subscription"
            )
        if article.access_tier == "organization" and current_user.subscription_tier not in ["organization"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="This content is only available to organization members"
            )
        
        return article
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@router.post("/", response_model=ArticleResponse, status_code=status.HTTP_201_CREATED)
async def create_article(
    article: ArticleCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new article.
    """
    # Validate access tier
    valid_tiers = ["free", "premium", "organization"]
    if article.access_tier not in valid_tiers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid access tier. Must be one of: {', '.join(valid_tiers)}"
        )
    
    # In a real app, you might want to check if the user has permission to create articles
    # For example, only admins or editors might be allowed to create articles
    
    try:
        new_article = Article(
            title=article.title,
            content=article.content,
            summary=article.summary,
            source=article.source,
            source_url=article.source_url,
            author=article.author,
            categories=article.categories,
            access_tier=article.access_tier,
            featured_image=article.featured_image
        )
        
        db.add(new_article)
        db.commit()
        db.refresh(new_article)
        return new_article
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create article: {str(e)}"
        )

@router.put("/{article_id}", response_model=ArticleResponse)
async def update_article(
    article_id: str = Path(..., description="The ID of the article to update"),
    article_update: ArticleUpdate = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update an existing article.
    """
    # Validate access tier if provided
    if article_update.access_tier is not None:
        valid_tiers = ["free", "premium", "organization"]
        if article_update.access_tier not in valid_tiers:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid access tier. Must be one of: {', '.join(valid_tiers)}"
            )
    
    try:
        # In a real app, you might want to check if the user has permission to update articles
        db_article = db.query(Article).filter(Article.id == article_id).first()
        if not db_article:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Article not found"
            )
        
        # Update fields if provided
        for field, value in article_update.dict(exclude_unset=True).items():
            setattr(db_article, field, value)
        
        db.commit()
        db.refresh(db_article)
        return db_article
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update article: {str(e)}"
        )

@router.delete("/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_article(
    article_id: str = Path(..., description="The ID of the article to delete"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete an article.
    """
    try:
        # In a real app, you might want to check if the user has permission to delete articles
        db_article = db.query(Article).filter(Article.id == article_id).first()
        if not db_article:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Article not found"
            )
        
        db.delete(db_article)
        db.commit()
        return None
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete article: {str(e)}"
        )
