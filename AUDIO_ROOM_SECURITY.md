# AUDIO ROOM SECURITY SPECIFICATION

## 1. Security & Token Protection

1. **Agora RTC Token Isolation**:
   - RTC App Certificate and Signing Secrets are never sent to client apps; tokens expire automatically in 24 hours.
2. **Server-Enforced Moderation**:
   - Mute, Kick, Ban, and Room Lock actions are validated server-side and recorded in immutable `prisma.auditLog`.
