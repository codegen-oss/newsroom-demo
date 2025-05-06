import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NotFoundPage component for displaying a 404 error page.
 */
function NotFoundPage() {
  return (
    <div className="not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="btn">
        Return to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;

