# Modal Backend Deployment

This directory contains configuration files for deploying the News Room backend to Modal.

## What is Modal?

[Modal](https://modal.com) is a cloud platform for running serverless Python applications. It provides a simple way to deploy and scale your backend services without managing infrastructure.

## Setup Instructions

1. Create a Modal account at [modal.com](https://modal.com)
2. Install the Modal CLI: `pip install modal`
3. Log in to Modal: `modal token new`
4. Create secrets for your application:
   ```
   modal secret create newsroom-db-credentials --env MONGODB_USER=user --env MONGODB_PASSWORD=pass --env POSTGRES_USER=user --env POSTGRES_PASSWORD=pass --env REDIS_USER=user --env REDIS_PASSWORD=pass
   modal secret create newsroom-api-keys --env NEWSAPI_KEY=your_key --env OPENAI_API_KEY=your_key
   modal secret create newsroom-jwt-secret --env JWT_SECRET_KEY=your_secret_key
   ```
5. Deploy your application: `modal deploy infrastructure/modal/modal_config.py`

## Environment Variables

Modal secrets are used to store sensitive environment variables. The following secrets are required:

### newsroom-db-credentials
- MONGODB_USER
- MONGODB_PASSWORD
- POSTGRES_USER
- POSTGRES_PASSWORD
- REDIS_USER
- REDIS_PASSWORD

### newsroom-api-keys
- NEWSAPI_KEY
- OPENAI_API_KEY (if using AI features)

### newsroom-jwt-secret
- JWT_SECRET_KEY

## Deployment Environments

The configuration supports three environments:
- dev
- staging
- production

Each environment has its own database connections and CORS settings.

## Scaling

Modal automatically scales your application based on demand. You can configure:
- `keep_warm`: Number of instances to keep ready
- `concurrency_limit`: Maximum number of concurrent requests per instance
- `memory`: Memory allocation in MB
- `cpu`: CPU allocation in cores

## Monitoring

Modal provides built-in monitoring and logging. Access these features from the Modal dashboard for your application.

