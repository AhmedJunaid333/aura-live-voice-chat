import { WalletLedgerService } from '../../../packages/wallet/src/index.js';
import { PaymentService } from '../src/modules/payment/payment.service.js';

async function runPaymentTests() {
  console.log('🧪 Starting Test: Multi-Provider Payments & Webhook Verification...');

  const walletService = new WalletLedgerService();
  const paymentService = new PaymentService(walletService);

  // Step 1: Create Payment Order
  const order = await paymentService.createOrder({
    userId: 'u-payer-1',
    amountUsd: 20.00,
    coinsGranted: BigInt(2000),
    provider: 'EASYPAISA'
  });

  console.assert(order.status === 'PENDING', 'Initial order status should be PENDING');

  // Step 2: Process Webhook -> Ledger Credit
  const completed = await paymentService.processWebhookPayment(order.transactionRef);
  console.assert(completed.status === 'COMPLETED', 'Order status after webhook should be COMPLETED');

  // Step 3: Verify Ledger Balance (50,000 initial + 2,000 recharge)
  const coinAcc = walletService.getAccount('u-payer-1', 'COIN');
  console.assert(coinAcc.balance === BigInt(52000), `Coin balance mismatch: expected 52000, got ${coinAcc.balance}`);

  console.log('✅ Multi-Provider Payments & Webhook Verification Tests PASSED!\n');
}

runPaymentTests().catch(console.error);
