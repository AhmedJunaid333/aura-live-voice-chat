# GIFT REALTIME EVENTS SPECIFICATION

| Socket.IO Event Name | Payload Data | Target Audience |
| :--- | :--- | :--- |
| `gift.sent` | `{ sender, receiver, giftName, quantity, animationType, timestamp }` | All Live Room Participants |
| `wallet.credited` | `{ coinsEarned, newBalance, message }` | Receiver Host Session |
| `diamond.credited` | `{ totalDiamonds, multiplier, rewardDiamonds }` | Lucky Draw Player Session |
