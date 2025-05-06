from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.models.models import User, Article, Organization, OrganizationMember, OrganizationRole
from app.schemas.articles import Article as ArticleSchema, ArticleCreate, ArticleUpdate
from app.utils.access_control import get_current_user, is_organization_member, has_organization_role

router = APIRouter()

# Create a new article
@router.post("/", response_model=ArticleSchema, status_code=status.HTTP_201_CREATED)
def create_article(
    article: ArticleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if organization exists
    organization = db.query(Organization).filter(Organization.id == article.organization_id).first()
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Check if user is a member of the organization with appropriate role
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == article.organization_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    
    if not member or member.role not in [OrganizationRole.OWNER, OrganizationRole.ADMIN, OrganizationRole.EDITOR]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User does not have permission to create articles in this organization"
        )
    
    # Create the article
    db_article = Article(
        **article.dict(),
        author_id=current_user.id
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    
    return db_article

# Get all articles for an organization
@router.get("/organization/{organization_id}", response_model=List[ArticleSchema])
def get_organization_articles(
    organization_id: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _: OrganizationMember = Depends(lambda: is_organization_member(organization_id))
):
    articles = (
        db.query(Article)
        .filter(Article.organization_id == organization_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return articles

# Get a specific article by ID
@router.get("/{article_id}", response_model=ArticleSchema)
def get_article(
    article_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Check if user is a member of the organization
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == article.organization_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User does not have access to this article"
        )
    
    return article

# Update an article
@router.put("/{article_id}", response_model=ArticleSchema)
def update_article(
    article_id: str,
    article_update: ArticleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Check if user is the author or has admin/owner role
    if db_article.author_id != current_user.id:
        member = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == db_article.organization_id,
            OrganizationMember.user_id == current_user.id
        ).first()
        
        if not member or member.role not in [OrganizationRole.OWNER, OrganizationRole.ADMIN]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User does not have permission to update this article"
            )
    
    # Update article fields
    update_data = article_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_article, field, value)
    
    db.commit()
    db.refresh(db_article)
    return db_article

# Delete an article
@router.delete("/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_article(
    article_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Check if user is the author or has admin/owner role
    if db_article.author_id != current_user.id:
        member = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == db_article.organization_id,
            OrganizationMember.user_id == current_user.id
        ).first()
        
        if not member or member.role not in [OrganizationRole.OWNER, OrganizationRole.ADMIN]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User does not have permission to delete this article"
            )
    
    db.delete(db_article)
    db.commit()
    return None

