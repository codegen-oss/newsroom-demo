from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.models.models import Article

def search_articles(db: Session, query: str, category_id: int = None, access_tier: int = 0):
    """
    Search articles by query string in title and content
    Optionally filter by category and respect access tier
    """
    search = f"%{query}%"
    
    # Base query with access tier filter
    base_query = db.query(Article).filter(Article.access_tier <= access_tier)
    
    # Add category filter if provided
    if category_id is not None:
        base_query = base_query.filter(Article.category_id == category_id)
    
    # Add search conditions
    search_query = base_query.filter(
        or_(
            Article.title.ilike(search),
            Article.content.ilike(search),
            Article.summary.ilike(search)
        )
    )
    
    # Only return published articles
    search_query = search_query.filter(Article.is_published == True)
    
    return search_query

