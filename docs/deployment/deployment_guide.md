# News Room Deployment Guide

This guide provides step-by-step instructions for deploying the News Room application to production.

## Prerequisites

- GitHub account with access to the repository
- Vercel account for frontend deployment
- Modal account for backend deployment
- Database services (PostgreSQL, MongoDB, Redis)
- Domain name and DNS access

## Deployment Overview

The News Room application consists of:

1. **Frontend**: React/Next.js application deployed on Vercel
2. **Backend**: Python/FastAPI application deployed on Modal
3. **Databases**: PostgreSQL, MongoDB, and Redis
4. **Monitoring**: Prometheus and Grafana

## Frontend Deployment (Vercel)

### Step 1: Connect Repository to Vercel

1. Log in to your Vercel account
2. Click "Import Project"
3. Select "Import Git Repository"
4. Choose the News Room repository
5. Select the `frontend` directory as the root directory

### Step 2: Configure Environment Variables

Set the following environment variables in the Vercel dashboard:

- `NEXT_PUBLIC_API_URL`: URL of the backend API
- `NEXT_PUBLIC_ANALYTICS_ID`: Analytics service ID

### Step 3: Deploy

1. Click "Deploy"
2. Vercel will build and deploy the frontend application
3. Once deployed, you'll receive a URL for your application

### Step 4: Set Up Custom Domain

1. In the Vercel dashboard, go to your project settings
2. Click on "Domains"
3. Add your custom domain (e.g., `newsroom.example.com`)
4. Follow the instructions to configure DNS settings

## Backend Deployment (Modal)

### Step 1: Set Up Modal CLI

1. Install the Modal CLI:
   ```bash
   pip install modal
   ```

2. Log in to Modal:
   ```bash
   modal token new
   ```

### Step 2: Create Secrets

Create the necessary secrets for your application:

```bash
modal secret create newsroom-db-credentials \
  --env MONGODB_USER=user \
  --env MONGODB_PASSWORD=pass \
  --env POSTGRES_USER=user \
  --env POSTGRES_PASSWORD=pass \
  --env REDIS_USER=user \
  --env REDIS_PASSWORD=pass

modal secret create newsroom-api-keys \
  --env NEWSAPI_KEY=your_key \
  --env OPENAI_API_KEY=your_key

modal secret create newsroom-jwt-secret \
  --env JWT_SECRET_KEY=your_secret_key
```

### Step 3: Deploy Backend

Deploy the backend application to Modal:

```bash
cd backend
modal deploy app.py
```

Modal will provide a URL for your deployed API.

## Database Setup

### PostgreSQL

1. Create a PostgreSQL database (using a cloud provider like AWS RDS, DigitalOcean, or a managed service)
2. Run the setup script:
   ```bash
   psql -U username -h hostname -d newsroom -f infrastructure/database/postgres_setup.sql
   ```

### MongoDB

1. Create a MongoDB database (using MongoDB Atlas or a self-hosted solution)
2. Run the setup script:
   ```bash
   mongo mongodb://username:password@hostname:27017/newsroom infrastructure/database/mongodb_setup.js
   ```

### Redis

1. Set up a Redis instance (using Redis Labs, AWS ElastiCache, or a self-hosted solution)
2. Use the provided configuration file:
   ```bash
   redis-server infrastructure/database/redis_setup.conf
   ```

## Monitoring Setup

### Prometheus and Grafana

1. Set up Prometheus using the provided configuration:
   ```bash
   docker-compose -f infrastructure/monitoring/docker-compose.yml up -d
   ```

2. Access Grafana at `http://your-server:3000` and import the provided dashboard

## CI/CD Setup

The repository includes GitHub Actions workflows for CI/CD:

- `frontend-ci.yml`: Runs tests and builds for the frontend
- `backend-ci.yml`: Runs tests and builds for the backend
- `deploy-frontend.yml`: Deploys the frontend to Vercel
- `deploy-backend.yml`: Deploys the backend to Modal

### GitHub Secrets

Set up the following secrets in your GitHub repository:

- `VERCEL_TOKEN`: Vercel API token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID
- `MODAL_TOKEN_ID`: Modal token ID
- `MODAL_TOKEN_SECRET`: Modal token secret

## Environment-Specific Configurations

### Development

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Databases: Local instances

### Staging

- Frontend: `https://staging.newsroom.example.com`
- Backend: `https://staging-newsroom-api.modal.run`
- Databases: Staging instances

### Production

- Frontend: `https://newsroom.example.com`
- Backend: `https://newsroom-api.modal.run`
- Databases: Production instances

## Post-Deployment Verification

After deployment, verify that:

1. The frontend is accessible at your domain
2. The backend API is responding to requests
3. Authentication is working correctly
4. Database connections are established
5. Monitoring is capturing metrics

## Rollback Procedure

If issues are encountered after deployment:

1. For frontend: Revert to the previous deployment in Vercel
2. For backend: Revert to the previous version in Modal
3. For database changes: Restore from the most recent backup

## Maintenance Tasks

Regular maintenance tasks include:

1. Database backups
2. Log rotation
3. Security updates
4. Performance monitoring
5. Scaling resources as needed

