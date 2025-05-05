// SSL/TLS Configuration for News Room API

const fs = require('fs');
const path = require('path');

/**
 * SSL/TLS Configuration
 * 
 * This module provides SSL/TLS configuration for the News Room API.
 * In production, we recommend using a managed service like Vercel or Modal
 * which handles SSL/TLS for you, or using a reverse proxy like Nginx.
 */

const sslConfig = {
  /**
   * Get HTTPS options for Node.js HTTPS server
   * @param {string} certDir - Directory containing SSL certificates
   * @returns {Object} HTTPS options
   */
  getHttpsOptions: (certDir = process.env.CERT_DIR || './certs') => {
    try {
      return {
        key: fs.readFileSync(path.join(certDir, 'privkey.pem')),
        cert: fs.readFileSync(path.join(certDir, 'fullchain.pem')),
        // Modern secure configuration
        minVersion: 'TLSv1.2',
        // Recommended cipher suites
        ciphers: [
          'TLS_AES_128_GCM_SHA256',
          'TLS_AES_256_GCM_SHA384',
          'TLS_CHACHA20_POLY1305_SHA256',
          'ECDHE-ECDSA-AES128-GCM-SHA256',
          'ECDHE-RSA-AES128-GCM-SHA256',
          'ECDHE-ECDSA-AES256-GCM-SHA384',
          'ECDHE-RSA-AES256-GCM-SHA384',
          'ECDHE-ECDSA-CHACHA20-POLY1305',
          'ECDHE-RSA-CHACHA20-POLY1305',
          'DHE-RSA-AES128-GCM-SHA256',
          'DHE-RSA-AES256-GCM-SHA384'
        ].join(':'),
        // Enable HTTP Strict Transport Security
        honorCipherOrder: true
      };
    } catch (error) {
      console.error('Failed to load SSL certificates:', error);
      return null;
    }
  },
  
  /**
   * Get Helmet.js security headers configuration
   * @returns {Object} Helmet configuration
   */
  getSecurityHeaders: () => {
    return {
      // HTTP Strict Transport Security
      hsts: {
        maxAge: 15552000, // 180 days
        includeSubDomains: true,
        preload: true
      },
      // Content Security Policy
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://analytics.example.com'],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          fontSrc: ["'self'", 'data:'],
          connectSrc: ["'self'", 'https://newsroom-api.modal.run', 'https://analytics.example.com'],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: []
        }
      },
      // X-Frame-Options
      frameguard: {
        action: 'deny'
      },
      // X-Content-Type-Options
      noSniff: true,
      // X-XSS-Protection
      xssFilter: true,
      // Referrer-Policy
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin'
      }
    };
  },
  
  /**
   * Get SSL certificate renewal configuration for Let's Encrypt
   * @returns {Object} Certbot configuration
   */
  getCertbotConfig: () => {
    return {
      email: 'admin@newsroom.example.com',
      domains: ['newsroom.example.com', 'api.newsroom.example.com'],
      webroot: '/var/www/html',
      renewalDays: 30,
      renewCommand: 'certbot renew --quiet --webroot -w /var/www/html',
      postRenewCommand: 'systemctl reload nginx'
    };
  }
};

module.exports = sslConfig;

