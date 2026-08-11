# MASTER RESELLER FLOW SPECIFICATION

## 1. Distribution & Limits

- **Allocation Hierarchy**: Company -> Master Reseller -> Sub-Reseller -> End User.
- **Credit Limits & Risk**: Transfer caps (`system.reseller.min_transfer_diamonds`) and velocity checks prevent unauthorized volume spikes (`RESELLER_ALLOCATION_SPIKE`).
