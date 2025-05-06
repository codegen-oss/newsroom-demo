# News Room Application

A news aggregation platform focusing on geopolitics, economy, and technology with tiered access levels and a futuristic design aesthetic.

## Features

- News feed with pagination and filtering
- Article detail view with access tier control
- Category and tag management
- Article search functionality
- Admin interface for article management
- Mock user authentication with tiered access

## Project Structure

The project is divided into two main parts:

### Backend (FastAPI)

- API endpoints for article management
- Database models for articles, categories, and tags
- Access tier control
- Search and filtering functionality

### Frontend (Next.js)

- Responsive news feed UI
- Article detail view
- Admin interface for article management
- Authentication context for user management
- Client-side filtering and search

## Setup Instructions

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed the database with mock data
python utils/seed_data.py

# Run development server
uvicorn main:app --reload
```

The backend API will be available at http://localhost:8000

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend application will be available at http://localhost:3000

## Demo Accounts

The application includes three demo accounts with different access tiers:

- **Free Tier**: user@example.com / password123
- **Premium Tier**: premium@example.com / password123
- **Organization Tier**: org@example.com / password123

## API Documentation

Once the backend server is running, you can access the API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

