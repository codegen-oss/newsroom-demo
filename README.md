# News Room Application

A news aggregation platform focusing on geopolitics, economy, and technology with tiered access levels and a futuristic design aesthetic.

## Project Structure

The project is divided into two main parts:

1. **Backend**: FastAPI-based API server
2. **Frontend**: Next.js-based web application

## Authentication System

This project implements a complete authentication system including:

- User registration and login
- JWT token-based authentication
- Password hashing with passlib
- Protected routes and API endpoints
- User profile management

## Getting Started

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
   pip install -r requirements.txt
   ```

4. Initialize the database:
   ```
   python init_db.py
   ```

5. Start the backend server:
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

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/token` - Login and get access token

### User Profile

- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update current user profile
- `GET /users/me/interests` - Get current user interests
- `POST /users/me/interests` - Create a new interest
- `PUT /users/me/interests/{interest_id}` - Update an interest
- `DELETE /users/me/interests/{interest_id}` - Delete an interest

## Frontend Pages

- `/login` - User login page
- `/register` - User registration page
- `/dashboard` - Main dashboard (protected)
- `/profile` - User profile management (protected)

## Default User

After initializing the database, you can log in with the following credentials:

- Email: user@example.com
- Password: password123

