# GIFT LEDGER SPECIFICATION

## 1. Double-Entry Gifting Ledger Mechanics

```
Sender Diamond Balance (Before): 500,000 Diamonds
Host Coin Earning (Before): 15,000 Coins
             ↓
Atomic Gift Transaction (1x Galaxy Rocket: Cost 2,000 Diamonds -> Earns 1,400 Coins)
             ↓
Sender Diamond Balance (After): 498,000 Diamonds
Host Coin Earning (After): 16,400 Coins
             ↓
Wallet Ledger Entry 1: { userId: SenderID, type: "DEBIT", amount: 2000, currency: "DIAMOND", description: "Sent 1x 🚀 Galaxy Space Rocket to Host @Dimple" }
Wallet Ledger Entry 2: { userId: HostID, type: "CREDIT", amount: 1400, currency: "COIN", description: "Earned 1400 Coins from 1x 🚀 Galaxy Space Rocket sent by @Ahmed Khokhar" }
```
