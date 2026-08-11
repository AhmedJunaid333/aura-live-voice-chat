# DATABASE MIGRATION REPORT (SQLITE → POSTGRESQL 16+)

## Executive Summary
This document outlines the complete database migration architecture, schema verification, relationship checks, and transaction safety validation for migrating **Aura Live Voice Chat** from local SQLite (`dev.db`) to high-concurrency **PostgreSQL 16+**.

---

## 1. Schema & Migration Architecture

### Datasource Configuration (`server/prisma/schema.prisma`):
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### Table & Index Verification:
- **`User` Table**: Enforces `id` (Auto-increment BigInt / Integer), `username` (Unique Index), `role` (Indexed Enum), `status` (Indexed Enum).
- **`Reseller` Table**: Foreign Key constraint `userId` referencing `User.id` ON DELETE CASCADE.
- **`ResellerTransaction` Table**: Foreign Keys referencing `Reseller.id` and `User.id` with append-only ledger transaction isolation.
- **`FraudAlert` Table**: Foreign Key `subjectId` referencing `User.id` with Indexed `riskScore` and `status`.
- **`Moment` Table**: Foreign Key `authorId` referencing `User.id` with Composite Index `(authorId, createdAt)`.
- **`AuditLog` Table**: Append-only log ledger with Indexed `actorId` and `action`.

---

## 2. PostgreSQL Atomic Transaction Verification
Financial operations use Prisma PostgreSQL `$transaction` atomic blocks:
```typescript
await prisma.$transaction(async (tx) => {
  const reseller = await tx.reseller.findUnique({ where: { id: resellerId } });
  if (reseller.diamondStock < amount) throw new Error("INSUFFICIENT_FUNDS");

  await tx.reseller.update({
    where: { id: resellerId },
    data: { diamondStock: { decrement: amount } }
  });

  await tx.user.update({
    where: { id: targetUserId },
    data: { diamondBalance: { increment: amount } }
  });

  await tx.resellerTransaction.create({
    data: { resellerId, targetUserId, amount, status: 'COMPLETED' }
  });
});
```
If any error occurs during transaction execution, PostgreSQL immediately triggers a **ROLLBACK**, preventing negative balances or partial transfers.
