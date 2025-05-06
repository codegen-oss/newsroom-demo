from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import uuid
from typing import List, Optional

from models import Article
from schemas import ArticleCreate, ArticleUpdate

class ArticleService:
    @staticmethod
    def create_article(db: Session, article_create: ArticleCreate):
        """Create a new article"""
        db_article = Article(
            id=str(uuid.uuid4()),
            title=article_create.title,
            content=article_create.content,
            summary=article_create.summary,
            source=article_create.source,
            source_url=article_create.source_url,
            author=article_create.author,
            published_at=article_create.published_at,
            categories=article_create.categories,
            access_tier=article_create.access_tier,
            featured_image=article_create.featured_image
        )
        
        db.add(db_article)
        db.commit()
        db.refresh(db_article)
        
        return db_article
    
    @staticmethod
    def get_article_by_id(db: Session, article_id: uuid.UUID):
        """Get an article by ID"""
        article = db.query(Article).filter(Article.id == article_id).first()
        
        if not article:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Article not found"
            )
            
        return article
    
    @staticmethod
    def get_articles(
        db: Session, 
        skip: int = 0, 
        limit: int = 100, 
        access_tier: Optional[str] = None,
        category: Optional[str] = None
    ):
        """Get articles with optional filtering"""
        query = db.query(Article)
        
        # Apply filters if provided
        if access_tier:
            query = query.filter(Article.access_tier == access_tier)
            
        if category:
            # Filter by category (this is a simplification, as categories is a JSON field)
            # In a real implementation, you might need a more sophisticated approach
            query = query.filter(Article.categories.contains([category]))
            
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def update_article(db: Session, article_id: uuid.UUID, article_update: ArticleUpdate):
        """Update an article"""
        db_article = db.query(Article).filter(Article.id == article_id).first()
        
        if not db_article:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Article not found"
            )
        
        # Update fields if provided
        if article_update.title is not None:
            db_article.title = article_update.title
        if article_update.content is not None:
            db_article.content = article_update.content
        if article_update.summary is not None:
            db_article.summary = article_update.summary
        if article_update.source is not None:
            db_article.source = article_update.source
        if article_update.source_url is not None:
            db_article.source_url = article_update.source_url
        if article_update.author is not None:
            db_article.author = article_update.author
        if article_update.published_at is not None:
            db_article.published_at = article_update.published_at
        if article_update.categories is not None:
            db_article.categories = article_update.categories
        if article_update.access_tier is not None:
            db_article.access_tier = article_update.access_tier
        if article_update.featured_image is not None:
            db_article.featured_image = article_update.featured_image
        
        db.commit()
        db.refresh(db_article)
        
        return db_article
    
    @staticmethod
    def delete_article(db: Session, article_id: uuid.UUID):
        """Delete an article"""
        db_article = db.query(Article).filter(Article.id == article_id).first()
        
        if not db_article:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Article not found"
            )
            
        db.delete(db_article)
        db.commit()
        
        return {"message": "Article deleted successfully"}

