# RISK RULES SPECIFICATION

| Rule Key | Rule Name | Category | Threshold Condition | Severity |
| :--- | :--- | :--- | :--- | :--- |
| `VELOCITY_DIAMOND_TRANSFER` | Rapid Diamond Transfer Velocity | `DIAMOND` | > 10 transfers in < 5 mins | `HIGH` |
| `LOGIN_FAILED_ATTEMPTS` | Credential Stuffing & Takeover | `AUTH` | > 30 failed logins in < 1 min | `CRITICAL` |
| `RESELLER_ALLOCATION_SPIKE` | Reseller Allocation Spike | `RESELLER` | > 200,000 diamonds allocated in 1 session | `MEDIUM` |
| `RECHARGE_GATEWAY_SPIKE` | Recharge Gateway Chargeback Spike | `RECHARGE` | > 3 failed card recharge attempts | `HIGH` |
