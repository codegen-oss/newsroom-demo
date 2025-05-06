# Frontend Architecture

This document describes the architecture of the News Room frontend application.

## Overview

The News Room frontend is built with React, a JavaScript library for building user interfaces. It uses React Router for navigation and Axios for API communication.

## Directory Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── ArticleCard.js
│   │   └── __tests__/   # Component tests
│   ├── pages/           # Page components
│   │   ├── HomePage.js
│   │   ├── ArticleListPage.js
│   │   ├── ArticleDetailPage.js
│   │   ├── CategoryPage.js
│   │   ├── NotFoundPage.js
│   │   └── __tests__/   # Page tests
│   ├── App.js           # Main React component
│   ├── App.css          # Main styles
│   ├── index.js         # React entry point
│   └── index.css        # Global styles
├── package.json         # Node.js dependencies
└── README.md            # Frontend documentation
```

## Key Components

### App Component (`App.js`)

The main application component that:

- Sets up the router
- Defines the main layout (header, main content, footer)
- Configures routes for different pages

### Header Component (`components/Header.js`)

The application header that:

- Displays the site title
- Provides navigation links
- (Future) Shows user authentication status

### Footer Component (`components/Footer.js`)

The application footer that:

- Displays copyright information
- (Future) Provides additional links and information

### ArticleCard Component (`components/ArticleCard.js`)

A reusable component for displaying article previews:

- Shows article title, summary, author, and date
- Displays category tags
- Links to the full article

### Page Components

- `HomePage.js`: Landing page with featured articles and categories
- `ArticleListPage.js`: Lists all articles with pagination
- `ArticleDetailPage.js`: Displays a single article in full
- `CategoryPage.js`: Shows articles in a specific category
- `NotFoundPage.js`: 404 error page

## Routing

React Router is used for client-side routing:

- `/`: Home page
- `/articles`: Article list page
- `/articles/:id`: Article detail page
- `/categories/:id`: Category page
- `*`: Not found page (404)

## State Management

The application uses React's built-in state management:

- `useState` for component-level state
- `useEffect` for side effects (API calls, etc.)
- (Future) Context API or Redux for global state

## API Communication

Axios is used for API communication:

- API calls are made directly in page components
- Loading and error states are managed at the component level
- The API base URL is configured via proxy in development

## Styling

The application uses CSS for styling:

- Global styles in `index.css`
- Component-specific styles in `App.css`
- (Future) CSS modules or styled-components for component-level styling

## Testing

Jest and React Testing Library are used for testing:

- Unit tests for components
- Integration tests for pages
- Mock API calls using Jest's mocking capabilities

## Build and Deployment

The frontend is built using Create React App's build system:

- Development server with hot reloading
- Production build with optimizations
- Static file output for deployment

## Future Enhancements

Planned enhancements for the frontend:

- User authentication UI
- Advanced search and filtering
- Responsive design improvements
- Accessibility enhancements
- Performance optimizations

