# GIFT TRANSACTION TEST REPORT

| Security Test Case | Test Description | Expected Result | Actual Result | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| **Insufficient Diamond Balance** | Sender with 10 Diamonds attempting to send 2000 Diamond Rocket | Request Rejected (HTTP 400) | HTTP 400 Insufficient Balance | **PASSED** |
| **Client Lucky Multiplier Manipulation** | Client sending `multiplier = 500x` parameter | Overwritten by Server RNG | Server RNG Executed Safely | **PASSED** |
| **Atomic Live Gift Delivery** | Sending 1x Galaxy Rocket to Host `@Dimple` (UID 100003) | Sender debited (-2000) & Host credited (+1400 Coins) | Verified in SQLite DB | **PASSED** |
| **Server-Side Lucky Draw** | Playing 100 Diamond Lucky Draw | Server RNG Multiplier Calculated & Audit Logged | Verified & Audit Logged | **PASSED** |
