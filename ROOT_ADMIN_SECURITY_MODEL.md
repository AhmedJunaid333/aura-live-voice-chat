# ROOT ADMIN SECURITY MODEL SPECIFICATION

## 1. Security Authorization Flow

```
Admin Request / Action Trigger
             ↓
JWT Token Authentication (`authenticateToken`)
             ↓
Root Role Verification (`requireRoles(['ROOT_SYSTEM_ADMIN', 'SUPER_ADMIN_CEO'])`)
             ↓
Granular Scope Scope Check (`requirePermission`)
             ↓
Backend Action Execution & Prisma DB Update
             ↓
Immutable Audit Record Logged (`prisma.auditLog`)
             ↓
Socket.IO Event Broadcast (`system.status.changed`)
```
