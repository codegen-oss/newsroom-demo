# News Room Backend

This directory contains the FastAPI backend for the News Room application.

## Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload
```

## Structure

- `api/` - API routes and endpoints
- `models/` - Database models
- `schemas/` - Pydantic schemas for request/response validation
- `services/` - Business logic
- `utils/` - Utility functions and helpers
- `db/` - Database configuration and migrations

