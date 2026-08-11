# TRUST & SAFETY SECURITY SPECIFICATION

## 1. Security & Privacy Protection

1. **Data Minimization**:
   - Moderators can only access data required for safety evaluation. User authentication credentials and payment secrets are strictly excluded.
2. **Immutable Audit Logs**:
   - Every moderation enforcement action and appeal resolution is written append-only to `prisma.auditLog`.
