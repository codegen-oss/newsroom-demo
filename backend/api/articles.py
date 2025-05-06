from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..db.database import get_db
from ..schemas.article import Article, ArticleCreate, ArticleUpdate, ArticleList, Category, CategoryCreate, Tag, TagCreate, AccessTier
from ..services import article as article_service

router = APIRouter()

# Article endpoints
@router.post("/articles/", response_model=Article, status_code=201)
def create_article(article: ArticleCreate, db: Session = Depends(get_db)):
    return article_service.create_article(db=db, article=article)

@router.get("/articles/", response_model=ArticleList)
def read_articles(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    category_id: Optional[str] = None,
    tag_id: Optional[str] = None,
    access_tier: Optional[AccessTier] = None,
    db: Session = Depends(get_db)
):
    return article_service.get_articles(
        db=db, 
        skip=skip, 
        limit=limit,
        search=search,
        category_id=category_id,
        tag_id=tag_id,
        access_tier=access_tier
    )

@router.get("/articles/{article_id}", response_model=Article)
def read_article(article_id: str, db: Session = Depends(get_db)):
    db_article = article_service.get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return db_article

@router.put("/articles/{article_id}", response_model=Article)
def update_article(article_id: str, article: ArticleUpdate, db: Session = Depends(get_db)):
    db_article = article_service.update_article(db, article_id=article_id, article=article)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return db_article

@router.delete("/articles/{article_id}", status_code=204)
def delete_article(article_id: str, db: Session = Depends(get_db)):
    success = article_service.delete_article(db, article_id=article_id)
    if not success:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"detail": "Article deleted successfully"}

# Category endpoints
@router.get("/categories/", response_model=List[Category])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    categories = article_service.get_categories(db, skip=skip, limit=limit)
    return categories

@router.post("/categories/", response_model=Category, status_code=201)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = article_service.get_category_by_name(db, name=category.name)
    if db_category:
        raise HTTPException(status_code=400, detail="Category already exists")
    return article_service.create_category(db=db, name=category.name, description=category.description)

@router.get("/categories/{category_id}", response_model=Category)
def read_category(category_id: str, db: Session = Depends(get_db)):
    db_category = article_service.get_category(db, category_id=category_id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@router.delete("/categories/{category_id}", status_code=204)
def delete_category(category_id: str, db: Session = Depends(get_db)):
    success = article_service.delete_category(db, category_id=category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"detail": "Category deleted successfully"}

# Tag endpoints
@router.get("/tags/", response_model=List[Tag])
def read_tags(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tags = article_service.get_tags(db, skip=skip, limit=limit)
    return tags

@router.post("/tags/", response_model=Tag, status_code=201)
def create_tag(tag: TagCreate, db: Session = Depends(get_db)):
    db_tag = article_service.get_tag_by_name(db, name=tag.name)
    if db_tag:
        raise HTTPException(status_code=400, detail="Tag already exists")
    return article_service.create_tag(db=db, name=tag.name)

@router.get("/tags/{tag_id}", response_model=Tag)
def read_tag(tag_id: str, db: Session = Depends(get_db)):
    db_tag = article_service.get_tag(db, tag_id=tag_id)
    if db_tag is None:
        raise HTTPException(status_code=404, detail="Tag not found")
    return db_tag

@router.delete("/tags/{tag_id}", status_code=204)
def delete_tag(tag_id: str, db: Session = Depends(get_db)):
    success = article_service.delete_tag(db, tag_id=tag_id)
    if not success:
        raise HTTPException(status_code=404, detail="Tag not found")
    return {"detail": "Tag deleted successfully"}

