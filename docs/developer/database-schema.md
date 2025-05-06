# Database Schema

This document describes the database schema for the News Room application.

## Overview

The News Room application uses SQLAlchemy as an ORM (Object-Relational Mapper) to interact with the database. The database schema consists of tables for articles, categories, and their relationships.

## Entity-Relationship Diagram

```
+-------------+       +-------------------+       +-------------+
|  Category   |       | article_category  |       |   Article   |
+-------------+       +-------------------+       +-------------+
| id          |<----->| category_id       |<----->| id          |
| name        |       | article_id        |       | title       |
| description |       +-------------------+       | content     |
+-------------+                                   | summary     |
                                                  | author      |
                                                  | published_date |
                                                  | updated_date |
                                                  +-------------+
```

## Tables

### Articles

The `articles` table stores information about news articles.

| Column         | Type         | Constraints       | Description                       |
|----------------|--------------|-------------------|-----------------------------------|
| id             | Integer      | PK, Auto-increment| Unique identifier                 |
| title          | String(255)  | Not null          | Article title                     |
| content        | Text         | Not null          | Full article content              |
| summary        | String(500)  | Nullable          | Brief summary of the article      |
| author         | String(100)  | Nullable          | Author's name                     |
| published_date | DateTime     | Default: now()    | Date and time of publication      |
| updated_date   | DateTime     | Default: now()    | Date and time of last update      |

### Categories

The `categories` table stores information about article categories.

| Column      | Type        | Constraints       | Description                       |
|-------------|-------------|-------------------|-----------------------------------|
| id          | Integer     | PK, Auto-increment| Unique identifier                 |
| name        | String(100) | Not null, Unique  | Category name                     |
| description | String(255) | Nullable          | Category description              |

### Article-Category Association

The `article_category` table is an association table that establishes a many-to-many relationship between articles and categories.

| Column      | Type    | Constraints                | Description                       |
|-------------|---------|----------------------------|-----------------------------------|
| article_id  | Integer | PK, FK -> articles.id     | Reference to an article           |
| category_id | Integer | PK, FK -> categories.id   | Reference to a category           |

## Relationships

- **Articles to Categories**: Many-to-many relationship through the `article_category` association table
  - An article can belong to multiple categories
  - A category can contain multiple articles

## SQLAlchemy Models

The database schema is implemented using SQLAlchemy models in `backend/app/models.py`:

```python
# Association table for many-to-many relationship
article_category = Table(
    "article_category",
    Base.metadata,
    Column("article_id", Integer, ForeignKey("articles.id"), primary_key=True),
    Column("category_id", Integer, ForeignKey("categories.id"), primary_key=True),
)

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    summary = Column(String(500))
    author = Column(String(100))
    published_date = Column(DateTime, default=func.now())
    updated_date = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    categories = relationship(
        "Category", 
        secondary=article_category, 
        back_populates="articles"
    )

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(String(255))
    
    # Relationships
    articles = relationship(
        "Article", 
        secondary=article_category, 
        back_populates="categories"
    )
```

## Indexes

The following indexes are defined:

- Primary key indexes on `id` columns
- Index on `articles.id` for faster lookups
- Index on `categories.id` for faster lookups
- Unique index on `categories.name` to prevent duplicate categories

## Future Schema Enhancements

Planned enhancements to the database schema:

- **Users table**: For user authentication and profiles
- **Comments table**: For article comments
- **Media table**: For images and other media
- **Tags table**: For more granular article tagging
- **Views table**: For tracking article views and popularity

