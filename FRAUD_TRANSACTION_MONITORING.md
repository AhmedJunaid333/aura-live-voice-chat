# FRAUD TRANSACTION MONITORING SPECIFICATION

| Transaction Category | Monitored Signal | Action Triggered |
| :--- | :--- | :--- |
| **Diamond P2P Transfers** | Rapid repeated transfers (> 10 in 5 mins) | Trigger `VELOCITY_DIAMOND_TRANSFER` Alert |
| **Reseller Diamond Allocation** | Large volume allocation (> 200k diamonds) | Trigger `RESELLER_ALLOCATION_SPIKE` Review |
| **Recharge Gateways** | Multiple failed payment attempts | Trigger `RECHARGE_GATEWAY_SPIKE` Alert |
