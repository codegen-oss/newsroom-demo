# News Room Backend

This directory contains the FastAPI backend for the News Room application.

## Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Create mock data (optional)
python scripts/create_mock_data.py

# Run development server
uvicorn main:app --reload
```

## API Documentation

Once the server is running, you can access the API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Structure

- `api/` - API routes and endpoints
- `models/` - Database models
- `schemas/` - Pydantic schemas for request/response validation
- `services/` - Business logic
- `utils/` - Utility functions and helpers
- `db/` - Database configuration
- `migrations/` - Alembic migrations
- `tests/` - Unit tests
- `scripts/` - Utility scripts

## Authentication

The API uses JWT token-based authentication. To authenticate:

1. Register a user at `/api/auth/register`
2. Get a token at `/api/auth/token` using the registered email and password
3. Include the token in the Authorization header for protected endpoints:
   `Authorization: Bearer <token>`

## Running Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_auth.py

# Run with coverage report
pytest --cov=.
```

## Database

The application uses SQLite for local development. The database file is created at `./newsroom.db` when the application is first run.

For production, you would want to configure a more robust database like PostgreSQL.

