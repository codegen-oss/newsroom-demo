# Newsroom Web Application

A web application for managing and displaying news content.

## Modal FastAPI Application

This project uses [Modal](https://modal.com/) to deploy a FastAPI application in the cloud.

### Setup

1. Install Modal:

```bash
pip install modal
```

2. Install development dependencies:

```bash
pip install -r requirements.txt
```

3. Authenticate with Modal:

```bash
modal token new
```

### Development

To run the application locally for development:

```bash
python -m uvicorn app.main:app --reload
```

### Deployment

To deploy the application to Modal:

```bash
modal deploy modal.py
```

### Testing the API

Once deployed, you can access the API at the URL provided by Modal. The API has the following endpoints:

- `/`: Root endpoint that returns a welcome message
- `/health`: Health check endpoint to verify the API is running

### Project Structure

```
.
├── app/
│   ├── api/          # API routes
│   ├── core/         # Core functionality
│   ├── db/           # Database models and connection
│   ├── models/       # Pydantic models
│   ├── schemas/      # Pydantic schemas
│   └── main.py       # FastAPI application
├── modal.py          # Modal configuration
└── requirements.txt  # Project dependencies
```

