import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'auralive_default_jwt_access_secret_2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'auralive_default_jwt_refresh_secret_2026',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  CORS_ORIGINS: (process.env.CORS_ORIGINS || 'http://localhost:8443,http://localhost:5173').split(','),
  AGORA_APP_ID: process.env.AGORA_APP_ID || '2be3d44a55ed429ba2cb13ee348a8364',
  AGORA_APP_CERTIFICATE: process.env.AGORA_APP_CERTIFICATE || '6d737e61f25d4d3396e1a30a2faba769',
  GCS_PROJECT_ID: process.env.GCS_PROJECT_ID || '',
  GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME || 'auralive-media-storage',
  ADMIN_INITIAL_EMAIL: process.env.ADMIN_INITIAL_EMAIL || 'admin@auralive.io',
  ADMIN_INITIAL_PASSWORD: process.env.ADMIN_INITIAL_PASSWORD || 'AuraLiveAdmin2026!Secure',
};
