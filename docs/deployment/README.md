# News Room Deployment Guide

This guide provides instructions for deploying the News Room Web App in various environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development Deployment](#local-development-deployment)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Monitoring and Logging](#monitoring-and-logging)
- [Backup and Recovery](#backup-and-recovery)
- [Scaling](#scaling)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying the News Room Web App, ensure you have the following:

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn
- Git
- Database (SQLite for development, PostgreSQL for production)
- Web server (Nginx or Apache for production)

## Local Development Deployment

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/codegen-oss/newsroom-demo.git
   cd newsroom-demo
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

4. Run the development server:
   ```bash
   cd backend
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. The API will be available at `http://localhost:8000`

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. The frontend will be available at `http://localhost:3000`

## Production Deployment

### Backend Production Deployment

1. Set up a production server with Python 3.8+ installed

2. Clone the repository:
   ```bash
   git clone https://github.com/codegen-oss/newsroom-demo.git
   cd newsroom-demo
   ```

3. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

4. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

5. Set up environment variables (see [Environment Variables](#environment-variables))

6. Set up a production database (see [Database Setup](#database-setup))

7. Install Gunicorn:
   ```bash
   pip install gunicorn
   ```

8. Create a systemd service file `/etc/systemd/system/newsroom-api.service`:
   ```
   [Unit]
   Description=News Room API
   After=network.target

   [Service]
   User=www-data
   Group=www-data
   WorkingDirectory=/path/to/newsroom-demo/backend
   Environment="PATH=/path/to/newsroom-demo/venv/bin"
   ExecStart=/path/to/newsroom-demo/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

9. Start and enable the service:
   ```bash
   sudo systemctl start newsroom-api
   sudo systemctl enable newsroom-api
   ```

10. Set up Nginx as a reverse proxy:
    ```
    server {
        listen 80;
        server_name api.newsroom.example.com;

        location / {
            proxy_pass http://localhost:8000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```

11. Restart Nginx:
    ```bash
    sudo systemctl restart nginx
    ```

### Frontend Production Deployment

1. Set up a production server with Node.js 16+ installed

2. Clone the repository:
   ```bash
   git clone https://github.com/codegen-oss/newsroom-demo.git
   cd newsroom-demo/frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables (see [Environment Variables](#environment-variables))

5. Build the application:
   ```bash
   npm run build
   ```

6. Install PM2 for process management:
   ```bash
   npm install -g pm2
   ```

7. Start the application with PM2:
   ```bash
   pm2 start npm --name "newsroom-frontend" -- start
   ```

8. Set up PM2 to start on boot:
   ```bash
   pm2 startup
   pm2 save
   ```

9. Set up Nginx as a reverse proxy:
    ```
    server {
        listen 80;
        server_name newsroom.example.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```

10. Restart Nginx:
    ```bash
    sudo systemctl restart nginx
    ```

11. Set up SSL with Let's Encrypt:
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d newsroom.example.com -d api.newsroom.example.com
    ```

## Docker Deployment

### Docker Compose Setup

1. Create a `docker-compose.yml` file in the project root:
   ```yaml
   version: '3'

   services:
     backend:
       build:
         context: ./backend
         dockerfile: Dockerfile
       ports:
         - "8000:8000"
       environment:
         - DATABASE_URL=postgresql://postgres:postgres@db:5432/newsroom
         - SECRET_KEY=your-secret-key
         - ALGORITHM=HS256
         - ACCESS_TOKEN_EXPIRE_MINUTES=30
       depends_on:
         - db
       restart: always

     frontend:
       build:
         context: ./frontend
         dockerfile: Dockerfile
       ports:
         - "3000:3000"
       environment:
         - NEXT_PUBLIC_API_URL=http://localhost:8000
       depends_on:
         - backend
       restart: always

     db:
       image: postgres:13
       volumes:
         - postgres_data:/var/lib/postgresql/data
       environment:
         - POSTGRES_PASSWORD=postgres
         - POSTGRES_USER=postgres
         - POSTGRES_DB=newsroom
       ports:
         - "5432:5432"
       restart: always

   volumes:
     postgres_data:
   ```

2. Create a `Dockerfile` for the backend in the `backend` directory:
   ```dockerfile
   FROM python:3.9-slim

   WORKDIR /app

   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt

   COPY . .

   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

3. Create a `Dockerfile` for the frontend in the `frontend` directory:
   ```dockerfile
   FROM node:16-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm install

   COPY . .

   RUN npm run build

   CMD ["npm", "start"]
   ```

4. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

5. The application will be available at:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000`

## Environment Variables

### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | Database connection string | `sqlite:///./newsroom.db` | No |
| `SECRET_KEY` | Secret key for JWT encoding | None | Yes |
| `ALGORITHM` | Algorithm for JWT encoding | `HS256` | No |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token expiration time in minutes | `30` | No |
| `CORS_ORIGINS` | Comma-separated list of allowed origins for CORS | `http://localhost:3000` | No |

### Frontend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | URL of the backend API | `http://localhost:8000` | Yes |

## Database Setup

### SQLite (Development)

SQLite is used by default for development and requires no additional setup.

### PostgreSQL (Production)

1. Install PostgreSQL:
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```

2. Create a database and user:
   ```bash
   sudo -u postgres psql
   ```

   ```sql
   CREATE DATABASE newsroom;
   CREATE USER newsroom_user WITH ENCRYPTED PASSWORD 'your-password';
   GRANT ALL PRIVILEGES ON DATABASE newsroom TO newsroom_user;
   \q
   ```

3. Update the `DATABASE_URL` environment variable:
   ```
   DATABASE_URL=postgresql://newsroom_user:your-password@localhost:5432/newsroom
   ```

4. Run migrations:
   ```bash
   cd backend
   alembic upgrade head
   ```

## Monitoring and Logging

### Backend Logging

1. Set up logging in `backend/app/main.py`:
   ```python
   import logging
   from logging.config import dictConfig

   logging_config = {
       "version": 1,
       "disable_existing_loggers": False,
       "formatters": {
           "default": {
               "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
           },
       },
       "handlers": {
           "console": {
               "class": "logging.StreamHandler",
               "level": "INFO",
               "formatter": "default",
           },
           "file": {
               "class": "logging.handlers.RotatingFileHandler",
               "filename": "newsroom-api.log",
               "maxBytes": 10485760,  # 10 MB
               "backupCount": 5,
               "formatter": "default",
           },
       },
       "root": {"level": "INFO", "handlers": ["console", "file"]},
   }

   dictConfig(logging_config)
   logger = logging.getLogger(__name__)
   ```

2. Use the logger in your code:
   ```python
   logger.info("API started")
   logger.error("An error occurred", exc_info=True)
   ```

### Frontend Logging

1. Set up a logging service in `frontend/lib/logger.ts`:
   ```typescript
   export const logger = {
     info: (message: string, data?: any) => {
       console.log(`[INFO] ${message}`, data);
       // In production, send logs to a service like Sentry
     },
     error: (message: string, error?: any) => {
       console.error(`[ERROR] ${message}`, error);
       // In production, send errors to a service like Sentry
     },
     warn: (message: string, data?: any) => {
       console.warn(`[WARN] ${message}`, data);
       // In production, send warnings to a service like Sentry
     },
   };
   ```

2. Use the logger in your code:
   ```typescript
   import { logger } from '../lib/logger';

   try {
     // Some code
     logger.info('Operation successful');
   } catch (error) {
     logger.error('Operation failed', error);
   }
   ```

### Monitoring with Prometheus and Grafana

1. Install Prometheus and Grafana:
   ```bash
   sudo apt update
   sudo apt install prometheus grafana
   ```

2. Configure Prometheus to scrape metrics from your application

3. Set up Grafana dashboards to visualize the metrics

## Backup and Recovery

### Database Backup

1. For PostgreSQL, create a backup script:
   ```bash
   #!/bin/bash
   BACKUP_DIR="/path/to/backups"
   TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
   BACKUP_FILE="$BACKUP_DIR/newsroom_$TIMESTAMP.sql"

   # Create backup
   pg_dump -U newsroom_user -d newsroom -f $BACKUP_FILE

   # Compress backup
   gzip $BACKUP_FILE

   # Remove backups older than 30 days
   find $BACKUP_DIR -name "newsroom_*.sql.gz" -mtime +30 -delete
   ```

2. Schedule the script with cron:
   ```bash
   0 2 * * * /path/to/backup_script.sh
   ```

### Database Recovery

1. To restore a PostgreSQL backup:
   ```bash
   gunzip -c /path/to/backups/newsroom_20231015_020000.sql.gz | psql -U newsroom_user -d newsroom
   ```

## Scaling

### Horizontal Scaling

1. Deploy multiple instances of the backend behind a load balancer

2. Use a shared database for all instances

3. Use a shared cache (Redis) for session management

### Vertical Scaling

1. Increase resources (CPU, RAM) for the backend and database servers

2. Optimize database queries and add indexes

3. Implement caching for frequently accessed data

## Troubleshooting

### Common Issues

#### Backend Issues

1. **Database Connection Errors**:
   - Check the `DATABASE_URL` environment variable
   - Verify that the database server is running
   - Check network connectivity between the application and database

2. **Authentication Issues**:
   - Verify the `SECRET_KEY` environment variable
   - Check that the JWT token is being sent correctly in the Authorization header
   - Verify that the token has not expired

#### Frontend Issues

1. **API Connection Errors**:
   - Check the `NEXT_PUBLIC_API_URL` environment variable
   - Verify that the backend API is running
   - Check CORS configuration on the backend

2. **Build Errors**:
   - Clear the `.next` directory and rebuild
   - Check for TypeScript errors
   - Verify that all dependencies are installed

### Logs and Diagnostics

1. Check backend logs:
   ```bash
   tail -f newsroom-api.log
   ```

2. Check frontend logs:
   ```bash
   pm2 logs newsroom-frontend
   ```

3. Check Nginx logs:
   ```bash
   tail -f /var/log/nginx/access.log
   tail -f /var/log/nginx/error.log
   ```

4. Check system logs:
   ```bash
   journalctl -u newsroom-api.service
   ```

### Getting Help

If you encounter issues that are not covered in this guide, please:

1. Check the GitHub repository issues
2. Consult the developer documentation
3. Contact the development team at dev@newsroom.example.com

