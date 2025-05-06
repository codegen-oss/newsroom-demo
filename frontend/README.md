# News Room Frontend

This is the frontend application for the News Room project, built with Next.js, React, and Tailwind CSS.

## Features

- User authentication (login, register, logout)
- User profile management
- Protected routes
- Responsive design

## Tech Stack

- **Next.js**: React framework for server-rendered applications
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form validation library
- **Axios**: HTTP client for API requests
- **js-cookie**: Cookie handling

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Build the application for production:

```bash
npm run build
# or
yarn build
```

### Start Production Server

Start the production server:

```bash
npm run start
# or
yarn start
```

## Project Structure

- `/pages`: Next.js pages
- `/components`: Reusable React components
- `/contexts`: React context providers
- `/utils`: Utility functions
- `/styles`: Global styles and Tailwind configuration

## Authentication

The application uses JWT tokens for authentication. Tokens are stored in cookies and included in API requests. The `AuthContext` provides authentication state and methods throughout the application.

## Protected Routes

Routes that require authentication are protected using the `withAuth` higher-order component or the `ProtectedRoute` component. Unauthenticated users are redirected to the login page.

