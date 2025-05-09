# News Room Web App

A modern news aggregation platform with tiered access (free, individual paid, organization) focusing on geopolitics, economy, and technology with a futuristic, elegant aesthetic.

## Project Overview

The News Room Web App is a comprehensive platform that provides:

- Personalized news feed based on user interests
- Global news coverage with emphasis on geopolitics, economy, and technology
- Multi-tier subscription model
- Organization-level features for team collaboration
- User history tracking and content recommendations

## Technical Architecture

### Frontend

- **Framework**: React with Next.js for server-side rendering and optimized performance
- **UI Library**: Tailwind CSS with a custom design system
- **State Management**: Redux or Context API
- **Authentication**: JWT with refresh tokens
- **Deployment**: Vercel

### Backend

- **API**: Python with FastAPI
- **Serverless Functions**: Modal for scalable, containerized backend
- **Database Structure**:
  - PostgreSQL for relational data
  - MongoDB for content and analytics
  - Redis for caching and session management

### Infrastructure

- **Backend Hosting**: Modal for serverless infrastructure
- **Frontend Hosting**: Vercel
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus and Grafana

## Repository Structure

```
/
├── frontend/           # Next.js frontend application
├── backend/            # FastAPI backend application
│   ├── src/            # Source code
│   │   ├── config/     # Configuration files
│   │   ├── models/     # Database models
│   │   ├── schemas/    # Database schemas
│   │   ├── services/   # Business logic services
│   │   └── utils/      # Utility functions
│   ├── migrations/     # Database migrations
│   └── seeds/          # Seed data
└── docs/               # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- MongoDB
- PostgreSQL
- Redis

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```

4. Run database migrations:
   ```
   npm run migrate
   ```

5. Seed initial data:
   ```
   npm run seed
   ```

6. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

