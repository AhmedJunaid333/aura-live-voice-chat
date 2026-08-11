# ACTION AUDIT LOG SPECIFICATION

## 1. Immutable Audit Logging Standard

Every sensitive administrative action writes an append-only record to `prisma.auditLog`:

```typescript
await prisma.auditLog.create({
  data: {
    actorId: req.user.id,
    actorRole: req.user.role,
    action: 'ACTION_KEY_NAME',
    resource: 'Entity:ID',
    details: 'Human-readable action summary with reason and state diff',
  },
});
```
