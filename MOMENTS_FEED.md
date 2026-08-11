# MOMENTS FEED SPECIFICATION

## 1. User Moments Feed Rules

1. **Author Verification**:
   - Every moment references a valid registered user ID in `prisma.user`.
2. **Status Filtering**:
   - Only `PUBLISHED` moments are eligible for public feed distribution. `RESTRICTED` or `REMOVED` moments are excluded automatically.
