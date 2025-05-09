# NewsRoom Demo

A news aggregation platform focusing on geopolitics, economy, and technology with tiered access levels and a futuristic design aesthetic.

## Project Overview

NewsRoom is a full-stack web application that provides:

- News aggregation with categorization
- User authentication and personalization
- Tiered access levels (free, individual, organization)
- Modern, responsive UI

## Tech Stack

### Frontend
- **Framework**: React with Next.js
- **UI Library**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: JWT tokens

### Backend
- **API**: Python with FastAPI
- **Database**: SQLite (for local development)
- **Authentication**: JWT with OAuth2

## Project Structure

- `/frontend`: Next.js frontend application
- `/backend`: FastAPI backend application

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.8+)
- npm or yarn

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
python seed_data.py  # Populate the database with sample data
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The application will be available at http://localhost:3000

## Features

- **User Authentication**: Register, login, and profile management
- **News Feed**: Browse articles with category filtering
- **Tiered Access**: Different content access based on subscription level
- **User Preferences**: Personalize news feed based on interests
- **Organization Support**: Team-based access for enterprise users

## Sample Users

The seed data includes the following test users:

- **Free Tier**: 
  - Email: free@example.com
  - Password: password123

- **Individual Tier**: 
  - Email: premium@example.com
  - Password: password123

- **Organization Tier**: 
  - Email: org@example.com
  - Password: password123

## API Documentation

FastAPI automatically generates interactive API documentation:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

