# SYSTEM CONFIGURATION SECURITY SPECIFICATION

## 1. Security & Financial Ledger Separation

1. **Financial Ledger Isolation**:
   - System configurations define business operational limits (e.g. minimum recharge $, reseller transfer thresholds), but NEVER directly mutate user wallet balances, diamond balances, or ledger records.
2. **Immutable Audit Trail**:
   - Setting creation, value updates, and version rollbacks write append-only records to `prisma.auditLog`.
