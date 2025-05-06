# News Room Demo

A full-stack application for managing and displaying news articles with different access tiers.

## Features

### Backend
- CRUD operations for articles
- Article filtering by category, access tier, and date
- Article search functionality
- Pagination for article listings
- Access control based on user subscription tier
- Mock data for initial testing

## Project Structure

- `/backend` - FastAPI backend with SQLAlchemy ORM
- `/frontend` - (Coming soon) Frontend application

## Getting Started

### Backend

See the [backend README](backend/README.md) for detailed instructions.

Quick start:
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Initialize database with mock data
python -m app.init_db

# Run the application
python run.py
```

### Using Docker

You can also run the application using Docker:

```bash
# Build and start the containers
docker-compose up -d

# Access the API at http://localhost:8000
```

## API Documentation

When the backend is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
