# GAME SECURITY TEST REPORT

| Security Test Case | Test Description | Expected Result | Actual Result | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| **Insufficient Entry Balance** | Player with 10 Diamonds attempting to enter 500 Diamond Ludo | Request Rejected (HTTP 400) | HTTP 400 Insufficient Balance | **PASSED** |
| **Client Score Manipulation** | Client sending `score = 999999` parameter | Overwritten by Server Game Engine | Server Engine Executed Safely | **PASSED** |
| **Atomic Gameplay Execution** | Playing Ludo Live Arena (Entry: 500 💎) | Player debited (-500 💎) & Victory credited (+1500 💎) | Verified in SQLite DB | **PASSED** |
| **Tournament Event Scheduling** | Scheduling `Aura Royal Carrom Cup` | Tournament Created & Audit Logged | Verified & Audit Logged | **PASSED** |
