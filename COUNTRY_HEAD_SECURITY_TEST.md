# COUNTRY HEAD SECURITY TEST REPORT

| Security Test Case | Test Description | Expected Result | Actual Result | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| **Cross-Territory IDOR** | Country Head PK requesting UAE data (`/country-head/AE`) | HTTP 403 Forbidden | HTTP 403 Forbidden | **PASSED** |
| **Global Role Escalation** | Country Head attempting self-promotion to `ROOT_SYSTEM_ADMIN` | HTTP 403 Forbidden | HTTP 403 Forbidden | **PASSED** |
| **Unapproved Wallet Modification** | Country Head attempting direct wallet balance edit | HTTP 403 Forbidden | HTTP 403 Forbidden | **PASSED** |
| **Regional Agency Approval** | Approving agency in assigned territory (`PK`) | Audit Log + Socket.IO | Verified & Audit Logged | **PASSED** |
