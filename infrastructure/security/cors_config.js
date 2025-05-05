// CORS Configuration for News Room API

const corsOptions = {
  // Allowed origins
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'https://newsroom.example.com',
      'https://staging.newsroom.example.com'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  
  // Allow credentials (cookies, authorization headers)
  credentials: true,
  
  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  
  // Allowed HTTP headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-API-Key',
    'Accept',
    'Origin'
  ],
  
  // Exposed headers
  exposedHeaders: ['Content-Length', 'X-Rate-Limit'],
  
  // Preflight request cache time in seconds
  maxAge: 86400,
  
  // Enable CORS preflight
  preflightContinue: false,
  
  // Success status for preflight
  optionsSuccessStatus: 204
};

module.exports = corsOptions;

