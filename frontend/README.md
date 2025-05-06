# News Room Frontend

This is the frontend for the News Room application, built with React.

## Features

- Browse and read news articles
- Filter articles by category
- Responsive design for desktop and mobile
- Comprehensive testing with Jest and React Testing Library

## Getting Started

### Prerequisites

- Node.js 14 or higher
- npm (Node.js package manager)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-organization/newsroom-demo.git
cd newsroom-demo/frontend
```

2. Install dependencies:

```bash
npm install
```

### Running the Development Server

Start the development server:

```bash
npm start
```

The application will run at `http://localhost:3000`.

### Building for Production

Build the application for production:

```bash
npm run build
```

The build files will be in the `build` directory.

## Testing

Run the tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

Run tests with coverage:

```bash
npm test -- --coverage
```

## Project Structure

- `public/`: Static assets
- `src/`: Source code
  - `components/`: Reusable React components
    - `Header.js`: Application header
    - `Footer.js`: Application footer
    - `ArticleCard.js`: Component for displaying article previews
    - `__tests__/`: Component tests
  - `pages/`: Page components
    - `HomePage.js`: Landing page
    - `ArticleListPage.js`: Page for listing all articles
    - `ArticleDetailPage.js`: Page for displaying a single article
    - `CategoryPage.js`: Page for displaying articles in a category
    - `NotFoundPage.js`: 404 error page
    - `__tests__/`: Page tests
  - `App.js`: Main React component
  - `App.css`: Main styles
  - `index.js`: React entry point
  - `index.css`: Global styles

## API Integration

The frontend communicates with the backend API using Axios. In development, API requests are proxied to `http://localhost:8000` (configured in `package.json`).

