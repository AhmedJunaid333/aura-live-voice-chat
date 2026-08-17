import dotenv from 'dotenv';
dotenv.config();

const PRODUCTION_NEON_DATABASE_URL =
  'postgresql://neondb_owner:npg_umiWgz9I2CXP@ep-odd-glade-axbcygiw-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

// Ensure process.env.DATABASE_URL is set for Prisma and Node runtime
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '') {
  process.env.DATABASE_URL = PRODUCTION_NEON_DATABASE_URL;
}

export const ENV = {
  PORT: parseInt(process.env.PORT || '10000', 10),
  NODE_ENV: process.env.NODE_ENV || 'production',
  DATABASE_URL: process.env.DATABASE_URL || PRODUCTION_NEON_DATABASE_URL,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'auralive_super_secure_access_secret_key_2026_production_v2_9981247',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'auralive_super_secure_refresh_secret_key_2026_production_v2_1823901',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  CORS_ORIGINS: (process.env.CORS_ORIGINS || 'http://localhost:8443,http://localhost:5173,https://aura-live-voice-chat-1.onrender.com').split(','),
  AGORA_APP_ID: process.env.AGORA_APP_ID || '2be3d44a55ed429ba2cb13ee348a8364',
  AGORA_APP_CERTIFICATE: process.env.AGORA_APP_CERTIFICATE || '6d737e61f25d4d3396e1a30a2faba769',
  GCS_PROJECT_ID: process.env.GCS_PROJECT_ID || '',
  GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME || 'auralive-media-storage',
  ADMIN_INITIAL_EMAIL: process.env.ADMIN_INITIAL_EMAIL || 'admin@auralive.io',
  ADMIN_INITIAL_PASSWORD: process.env.ADMIN_INITIAL_PASSWORD || 'AuraLiveAdmin2026!Secure',
};
