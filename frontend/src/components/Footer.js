import React from 'react';

/**
 * Footer component for the application.
 * Contains copyright information and optional links.
 */
function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="copyright">
          © {currentYear} News Room. All rights reserved.
        </div>
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

