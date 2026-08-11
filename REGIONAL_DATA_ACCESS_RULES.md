# REGIONAL DATA ACCESS RULES SPECIFICATION

## 1. IDOR & Data Scoping Rules

1. **Territory Isolation**:
   - Queries to user, host, or agency endpoints must filter by `countryCode = req.user.assignedCountry`.
2. **Cross-Territory Blocking**:
   - Explicit attempt by Country Head A (`PK`) to request `/country-head/territories/AE` results in server-side HTTP 403 Forbidden.
3. **Financial Access Restrictions**:
   - Country Heads may view regional revenue totals for performance tracking but cannot directly edit user wallets or execute unapproved diamond minting.
