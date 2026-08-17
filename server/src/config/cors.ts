import cors from 'cors';
import { ENV } from './env.js';

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (
      ENV.NODE_ENV === 'development' ||
      ENV.CORS_ORIGINS.indexOf(origin) !== -1 ||
      origin.includes('web.app') ||
      origin.includes('firebaseapp.com') ||
      origin.includes('onrender.com') ||
      origin.includes('localhost')
    ) {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS policy'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});
