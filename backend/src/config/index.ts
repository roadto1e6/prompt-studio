import 'dotenv/config';

// Validate required environment variables in production
function validateEnv() {
  const requiredInProd = ['JWT_SECRET', 'DATABASE_URL'];

  if (process.env.NODE_ENV === 'production') {
    for (const key of requiredInProd) {
      if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
      }
    }

    // Warn if using default JWT secret
    if (process.env.JWT_SECRET === 'default-secret-change-me') {
      console.warn('WARNING: Using default JWT secret in production!');
    }
  }
}

validateEnv();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3001', 10),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',

  // JWT - Flattened for easier access
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',

  // JWT - Nested for backward compatibility
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },

  // OAuth - Google
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
  },

  // OAuth - GitHub
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackUrl: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3001/api/auth/github/callback',
  },

  // Frontend
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Redis (optional)
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || '',
  },
};

export default config;
