import { WalletLedgerService } from '../../../packages/wallet/src/index.js';
import { VipService } from '../src/modules/economy/vip.service.js';

async function runGiftEngineTests() {
  console.log('🧪 Starting Test: Gift Engine & VIP Discounts...');

  const walletService = new WalletLedgerService();
  const vipService = new VipService();

  // User purchases VIP 3 (6% discount)
  vipService.purchaseVip('u-vip-sender', 3);
  const vipInfo = vipService.getUserVip('u-vip-sender');
  console.assert(vipInfo.discount === 6, 'VIP discount calculation mismatch');

  // Process gift transaction with VIP discount applied
  const basePrice = 1000;
  const discountedPrice = Math.floor(basePrice * (1 - vipInfo.discount / 100)); // 940 Coins
  console.assert(discountedPrice === 940, 'Discount price calculation mismatch');

  const giftTx = await walletService.processGiftTransaction({
    senderId: 'u-vip-sender',
    receiverId: 'u-creator',
    giftId: 'g-superstar',
    giftName: 'Superstar Crown',
    giftCount: 1,
    totalCoins: BigInt(discountedPrice),
    diamondsEarned: BigInt(500),
    idempotencyKey: `gift-tx-${Date.now()}`
  });

  console.assert(giftTx.senderEntry.amount === BigInt(-940), 'Gift coin deduction mismatch');
  console.assert(giftTx.receiverEntry.amount === BigInt(500), 'Creator diamond reward mismatch');

  console.log('✅ Gift Engine & VIP Discount Tests PASSED!\n');
}

runGiftEngineTests().catch(console.error);
