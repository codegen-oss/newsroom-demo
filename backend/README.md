# News Room Backend

This is the backend for the News Room application, providing an API for article management.

## Features

- CRUD operations for articles
- Article filtering by category, access tier, and date
- Article search functionality
- Pagination for article listings
- Access control based on user subscription tier
- Mock data for initial testing

## Technical Stack

- FastAPI for API development
- SQLAlchemy ORM for database operations
- Pydantic for data validation
- SQLite for database storage

## Getting Started

### Prerequisites

- Python 3.8 or higher

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
pip install -r requirements.txt
```

### Initialize the Database

Run the following command to create the database and populate it with mock data:

```bash
python -m app.init_db
```

### Running the Application

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000

### API Documentation

FastAPI automatically generates interactive API documentation:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Articles

- `GET /api/articles/` - List articles with filtering and pagination
- `POST /api/articles/` - Create a new article
- `GET /api/articles/{article_id}` - Get a specific article
- `PUT /api/articles/{article_id}` - Update an article
- `DELETE /api/articles/{article_id}` - Delete an article
- `GET /api/articles/search/` - Search articles

### Categories

- `GET /api/categories/` - List all categories
- `POST /api/categories/` - Create a new category

## Authentication

The API uses JWT token-based authentication. To access protected endpoints:

1. Obtain a token by sending a POST request to `/api/token` with username and password
2. Include the token in the Authorization header of subsequent requests:
   `Authorization: Bearer {token}`

## Access Control

Articles have three access tiers:
- 0: Free (accessible to all users)
- 1: Basic (requires basic or premium subscription)
- 2: Premium (requires premium subscription)

Users also have subscription tiers that determine which articles they can access.

