import { WalletLedgerService } from '../../../packages/wallet/src/index.js';
import { WithdrawalService } from '../src/modules/withdrawal/withdrawal.service.js';

async function runWithdrawalTests() {
  console.log('🧪 Starting Test: Creator Withdrawal Pipeline & Finance Review...');

  const walletService = new WalletLedgerService();
  const withdrawalService = new WithdrawalService(walletService);

  // Creator earns 5,000 diamonds
  await walletService.recordLedgerEntry({
    userId: 'u-creator-99',
    currencyType: 'DIAMOND',
    amount: BigInt(5000),
    type: 'RECEIVE_GIFT',
    referenceType: 'GIFT_TRANSACTION',
    description: 'Gift earnings'
  });

  // Step 1: Request Withdrawal
  const req = await withdrawalService.requestWithdrawal({
    userId: 'u-creator-99',
    diamondAmount: BigInt(2000),
    usdAmount: 100.00,
    paymentMethod: 'PAYONEER',
    accountDetails: { email: 'creator@auralive.app' }
  });

  console.assert(req.status === 'PENDING', 'Withdrawal initial status must be PENDING');

  // Step 2: Finance Review Approval -> Triggers Ledger Entry Settlement
  const reviewed = await withdrawalService.reviewWithdrawal({
    requestId: req.id,
    reviewerAdminId: 'adm-finance-1',
    approve: true
  });

  console.assert(reviewed.status === 'PAID', 'Approved withdrawal status should be PAID');

  // Step 3: Verify Ledger Entry
  const diamondAcc = walletService.getAccount('u-creator-99', 'DIAMOND');
  console.assert(diamondAcc.balance === BigInt(3000), 'Diamond balance debit mismatch after payout approval');

  console.log('✅ Creator Withdrawal Pipeline Tests PASSED!\n');
}

runWithdrawalTests().catch(console.error);
