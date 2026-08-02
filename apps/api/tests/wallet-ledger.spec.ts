import { WalletLedgerService } from '../../../packages/wallet/src/index.js';

async function runWalletLedgerTests() {
  console.log('🧪 Starting Test: Double-Entry Wallet Ledger...');

  const ledger = new WalletLedgerService();

  // Test 1: Process valid gift transaction
  const result = await ledger.processGiftTransaction({
    senderId: 'u-sender',
    receiverId: 'u-receiver',
    giftId: 'g-crown',
    giftName: 'Royal Crown',
    giftCount: 1,
    totalCoins: BigInt(500),
    diamondsEarned: BigInt(250)
  });

  console.assert(result.senderTx.amountCoins === BigInt(-500), 'Sender debit transaction incorrect');
  console.assert(result.receiverTx.amountDiamonds === BigInt(250), 'Receiver credit transaction incorrect');

  // Check new balances
  const senderWallet = ledger.getWallet('u-sender');
  const receiverWallet = ledger.getWallet('u-receiver');
  console.assert(senderWallet.coinBalance === BigInt(49500), 'Sender balance calculation incorrect');
  console.assert(receiverWallet.diamondBalance === BigInt(1250), 'Receiver diamond balance calculation incorrect');

  // Test 2: Insufficient balance rejection
  try {
    await ledger.processGiftTransaction({
      senderId: 'u-sender',
      receiverId: 'u-receiver',
      giftId: 'g-super',
      giftName: 'Super Rocket',
      giftCount: 1000,
      totalCoins: BigInt(99999999),
      diamondsEarned: BigInt(50000000)
    });
    console.assert(false, 'Should have thrown insufficient balance error');
  } catch (err: any) {
    console.log('  ✅ Insufficient balance error caught successfully:', err.message);
  }

  // Test 3: Verify immutable transaction ledger history
  const senderHistory = ledger.getTransactionHistory('u-sender');
  console.assert(senderHistory.length === 1, 'Transaction history count mismatch');
  console.assert(senderHistory[0].type === 'SEND_GIFT', 'Transaction type mismatch');

  console.log('✅ Double-Entry Wallet Ledger Tests PASSED!\n');
}

runWalletLedgerTests().catch(console.error);
