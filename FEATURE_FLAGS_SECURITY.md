# FEATURE FLAGS SECURITY SPECIFICATION

## 1. Security & Server-Side Enforcement

1. **Backend Server Authority**:
   - Client-side feature flag toggles only hide UI elements; Express API endpoints independently verify permissions and reject unauthorized operations even if client flags are tampered with.
2. **Immutable Audit History**:
   - Flag creation, toggle actions, and version rollbacks write append-only records to `prisma.auditLog`.
