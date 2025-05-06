# News Room Application

A news aggregation platform focusing on geopolitics, economy, and technology with tiered access levels and a futuristic design aesthetic.

## Features

- User preferences management
- Subscription tier management (free/individual/organization)
- Organization management
- Team member management with role-based access

## Project Structure

The project is divided into two main parts:

### Backend (FastAPI)

- User authentication and authorization
- User preferences management
- Organization management
- Database models and migrations

### Frontend (Next.js)

- User interface for preferences management
- Organization management dashboard
- Subscription tier selection
- Authentication flows

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install fastapi uvicorn sqlalchemy pydantic python-jose passlib python-multipart alembic
   ```

4. Run database migrations:
   ```
   alembic upgrade head
   ```

5. (Optional) Seed the database with sample data:
   ```
   python seed_data.py
   ```

6. Start the backend server:
   ```
   uvicorn main:app --reload
   ```

The API will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The frontend will be available at http://localhost:3000

## API Documentation

Once the backend is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## User Roles and Permissions

- **Free User**: Basic access to news articles
- **Individual User**: Premium access with personalized preferences
- **Organization Member**: Access to organization-specific content
- **Organization Admin**: Can manage organization settings and members

