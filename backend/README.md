# NewsRoom Backend

A FastAPI backend for the NewsRoom application, providing API endpoints for news aggregation with tiered access levels.

## Features

- User authentication with JWT tokens
- Article management with tiered access (free, premium, organization)
- User preferences and interests
- Organization management

## Setup

### Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run the Server

```bash
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

### API Documentation

FastAPI automatically generates interactive API documentation:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Seed the Database

To populate the database with sample data:

```bash
python seed_data.py
```

## API Endpoints

- **Authentication**: `/token` (POST)
- **Users**: `/users/`
- **Articles**: `/articles/`
- **Organizations**: `/organizations/`

## Database

The application uses SQLite for local development. The database file will be created automatically when you run the application for the first time.

