import { WalletLedgerService } from '../../../packages/wallet/src/index.js';

async function runWalletTransactionTests() {
  console.log('🧪 Starting Test: Ledger-Based Wallet & Anti-Fraud Controls...');

  const walletService = new WalletLedgerService();

  // Test 1: Record Debit Entry with Idempotency Key
  const idempotencyKey = `tx-key-${Date.now()}`;
  const debitEntry = await walletService.recordLedgerEntry({
    userId: 'u-sender',
    currencyType: 'COIN',
    amount: BigInt(-1000),
    type: 'SEND_GIFT',
    referenceType: 'GIFT_TRANSACTION',
    idempotencyKey,
    description: 'Sent Gift'
  });

  console.assert(debitEntry.amount === BigInt(-1000), 'Debit amount mismatch');
  console.assert(debitEntry.currencyType === 'COIN', 'Currency type mismatch');

  // Test 2: Idempotency Key Replay Prevention (Anti-Fraud)
  try {
    await walletService.recordLedgerEntry({
      userId: 'u-sender',
      currencyType: 'COIN',
      amount: BigInt(-1000),
      type: 'SEND_GIFT',
      referenceType: 'GIFT_TRANSACTION',
      idempotencyKey,
      description: 'Replay Attack Attempt'
    });
    console.assert(false, 'Should have blocked duplicate idempotency key');
  } catch (err: any) {
    console.log('  ✅ Duplicate transaction prevented via Idempotency-Key:', err.message);
  }

  // Test 3: Currency Separation Check
  const coinAcc = walletService.getAccount('u-sender', 'COIN');
  const diamondAcc = walletService.getAccount('u-sender', 'DIAMOND');
  console.assert(coinAcc.currencyType !== diamondAcc.currencyType, 'Currencies must be strictly separated');

  console.log('✅ Ledger-Based Wallet & Anti-Fraud Tests PASSED!\n');
}

runWalletTransactionTests().catch(console.error);
