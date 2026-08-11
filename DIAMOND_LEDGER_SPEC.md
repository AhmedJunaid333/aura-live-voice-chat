# DIAMOND LEDGER SPECIFICATION

## 1. Double-Entry Reseller Ledger Mechanics

```
Reseller Inventory (Before): 500,000 Diamonds
Customer Wallet (Before): 25,000 Diamonds
             ↓
Atomic Transaction (-5,000 Reseller / +5,000 Customer)
             ↓
Reseller Inventory (After): 495,000 Diamonds
Customer Wallet (After): 30,000 Diamonds
             ↓
Wallet Ledger Entry 1: { userId: ResellerID, type: "DEBIT", amount: 5000, currency: "DIAMOND" }
Wallet Ledger Entry 2: { userId: CustomerID, type: "CREDIT", amount: 5000, currency: "DIAMOND" }
```
