# News Room Web App

A news aggregation platform focusing on geopolitics, economy, and technology with tiered access levels and a futuristic design aesthetic.

## Project Structure

This project consists of two main components:

- `frontend/`: Next.js React application
- `backend/`: FastAPI Python application

## Getting Started

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## Features

- Basic news feed with focus categories
- Simple user authentication and preferences
- Tiered access simulation (free/paid/organization)
- Local data storage

## Technical Stack

### Frontend
- React with Next.js
- Tailwind CSS
- React Context API
- JWT authentication

### Backend
- Python with FastAPI
- SQLite database
- JWT token authentication

