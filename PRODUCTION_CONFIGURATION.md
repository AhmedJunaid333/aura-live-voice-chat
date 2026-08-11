# PRODUCTION CONFIGURATION SPECIFICATION

## 1. Environment Variable Architecture

| Component Domain | Environment Variable | Staging Default | Production Configuration Requirement |
| :--- | :--- | :--- | :--- |
| **PostgreSQL Database** | `DATABASE_URL` | `postgresql://...` | Connection Pool Max 50, Timeout 10s |
| **PostgreSQL Migration** | `DIRECT_DATABASE_URL` | `postgresql://...` | Direct non-pooled connection for Prisma migrations |
| **Agora RTC Audio** | `AGORA_APP_ID` | Configured | Agora Developer Portal App ID |
| **Agora RTC Certificate** | `AGORA_APP_CERTIFICATE` | Configured | App Certificate for Server-side Token Signing |
| **Firebase Cloud Messaging** | `FIREBASE_SERVICE_ACCOUNT_JSON` | Configured | Service Account JSON Key for FCM Push Notifications |
| **Google OAuth** | `GOOGLE_CLIENT_ID` | Configured | Google OAuth Web & Android App Credentials |
| **Cloud Storage** | `S3_BUCKET_NAME` / `AWS_KEY` | Configured | AWS S3 or Cloudflare R2 Bucket for Media |
