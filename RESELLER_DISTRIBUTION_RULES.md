# RESELLER DISTRIBUTION RULES SPECIFICATION

## 1. Distribution Scope & Restrictions

1. **Eligible Recipients**: Resellers may deliver diamonds to normal users, broadcaster hosts, VIP users, and family members.
2. **Territory Scope**: Master Resellers are bound to their assigned country code (e.g. `PK`).
3. **Negative Balance Lock**: Resellers cannot deliver diamonds exceeding their current `prisma.user.diamonds` inventory. Simultaneous transfers are guarded by database transactions.
