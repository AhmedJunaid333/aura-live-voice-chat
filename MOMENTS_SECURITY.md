# MOMENTS SECURITY SPECIFICATION

## 1. Author Verification & Rate Limits

1. **User Ownership Verification**:
   - Backend validates that the `authorId` belongs to an active, authenticated user record. Spoofing author IDs is rejected with HTTP 403.
2. **Rate Limiting**:
   - Posting frequency is rate-limited (`system.upload.max_moments_per_hour`) to block automated spam bots.
