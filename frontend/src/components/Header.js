import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Header component for the application.
 * Contains the site title and navigation links.
 */
function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="site-title">
          <Link to="/">News Room</Link>
        </div>
        <nav className="main-nav">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/articles">Articles</Link>
            </li>
            <li>
              <Link to="/categories">Categories</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;

