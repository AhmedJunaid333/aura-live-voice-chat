# ABUSE REPORT SECURITY SPECIFICATION

## 1. Security & Evidence Isolation

1. **Authorization Verification**:
   - Moderator assignment and moderation actions require valid JWT bearer tokens with authorized `reports.moderate_user` / `reports.moderate_room` permissions.
2. **Append-Only Audit Log**:
   - Report creation, moderator assignment, and moderation execution append records directly to `prisma.auditLog`.
