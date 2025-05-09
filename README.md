# News Room Web App

A modern news aggregation platform with tiered access (free, individual paid, organization) focusing on geopolitics, economy, and technology with a futuristic, elegant aesthetic.

## Project Overview

### Core Features

* Personalized news feed based on user interests
* Global news coverage with emphasis on geopolitics, economy, and technology
* Multi-tier subscription model
* Organization-level features for team collaboration
* User history tracking and content recommendations

## Technical Architecture

### Frontend

* **Framework**: React with Next.js for server-side rendering and optimized performance
* **UI Library**: Tailwind CSS with a custom design system
* **State Management**: Redux or Context API
* **Authentication**: JWT with refresh tokens
* **Deployment**: Vercel

### Backend

* **API**: Python with FastAPI
* **Serverless Functions**: Modal for scalable, containerized backend
* **Database Structure**:
  * PostgreSQL for relational data
  * MongoDB for content and analytics
  * Redis for caching and session management

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Python (v3.9 or later)
- Docker (for local database setup)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn api.main:app --reload
```

## Project Structure

### Frontend

```
/frontend
  /src
    /app - Next.js App Router pages
    /components - Reusable UI components
    /lib - Utility functions and API clients
    /hooks - Custom React hooks
    /context - React context providers
    /types - TypeScript type definitions
```

### Backend

```
/backend
  /api - FastAPI routes and endpoints
  /models - Data models and schemas
  /services - Business logic
  /utils - Utility functions
  /tests - Unit and integration tests
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

