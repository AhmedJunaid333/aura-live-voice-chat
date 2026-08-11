# RESELLER SECURITY TEST REPORT

| Security Test Case | Test Description | Expected Result | Actual Result | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| **Insufficient Inventory** | Reseller attempting to sell 1,000,000 Diamonds with 500,000 balance | Request Rejected (HTTP 400) | HTTP 400 Insufficient Inventory | **PASSED** |
| **Non-Reseller Role Bypass** | Normal user calling `/resellers/sell-diamonds` | Request Rejected (HTTP 403) | HTTP 403 Forbidden | **PASSED** |
| **Atomic Balance Delivery** | Selling 5,000 Diamonds to `@Ayesha_Singer` (UID 100002) | Reseller debited (-5000) & Customer credited (+5000) | Verified in SQLite DB | **PASSED** |
| **Wholesale Allocation** | Allocating 50,000 Diamonds to `@Ahmed Khokhar` | Reseller balance updated & Audit Logged | Verified & Audit Logged | **PASSED** |
