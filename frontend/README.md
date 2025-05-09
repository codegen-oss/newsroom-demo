# NewsRoom Frontend

A Next.js frontend for the NewsRoom application, providing a modern UI for news aggregation with tiered access levels.

## Features

- Modern UI with Tailwind CSS
- Responsive design for all devices
- User authentication with JWT
- Article browsing and filtering
- User profile management
- Subscription tier support

## Setup

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

- `src/app`: Next.js app router pages
- `src/components`: Reusable UI components
- `src/contexts`: React context providers
- `src/lib`: Utility functions and API client

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Authentication

The application uses JWT tokens for authentication, stored in localStorage. The AuthContext provider handles login, logout, and token management.

