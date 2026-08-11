# FRAUD SECURITY SPECIFICATION

## 1. Security & Account Takeover Defense

1. **Credential Attack Detection**:
   - Monitored failed login attempt spikes across IP subnets trigger `LOGIN_FAILED_ATTEMPTS` critical alerts.
2. **Immutable Audit History**:
   - Alert creation, analyst assignment, and case resolution write append-only records to `prisma.auditLog`.
