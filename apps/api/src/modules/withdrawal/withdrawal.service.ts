import { WalletLedgerService } from '../../../../packages/wallet/src/index.js';

export type WithdrawalRequestStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface WithdrawalRequestRecord {
  id: string;
  userId: string;
  diamondAmount: bigint;
  usdAmount: number;
  paymentMethod: string;
  accountDetails: Record<string, any>;
  status: WithdrawalRequestStatus;
  riskScore: number;
  reviewedById?: string;
  rejectionReason?: string;
  createdAt: Date;
}

export class WithdrawalService {
  private requests: Map<string, WithdrawalRequestRecord> = new Map();

  constructor(private walletService: WalletLedgerService) {}

  async requestWithdrawal(params: {
    userId: string;
    diamondAmount: bigint;
    usdAmount: number;
    paymentMethod: string;
    accountDetails: Record<string, any>;
  }): Promise<WithdrawalRequestRecord> {
    // 1. Verify user diamond balance
    const diamondAccount = this.walletService.getAccount(params.userId, 'DIAMOND');
    if (diamondAccount.balance < params.diamondAmount) {
      throw new Error(`Insufficient diamond balance. Available: ${diamondAccount.balance}, Requested: ${params.diamondAmount}`);
    }

    const id = `req-wth-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const record: WithdrawalRequestRecord = {
      id,
      userId: params.userId,
      diamondAmount: params.diamondAmount,
      usdAmount: params.usdAmount,
      paymentMethod: params.paymentMethod,
      accountDetails: params.accountDetails,
      status: 'PENDING',
      riskScore: params.diamondAmount > BigInt(100000) ? 75 : 10,
      createdAt: new Date()
    };

    this.requests.set(id, record);
    return record;
  }

  async reviewWithdrawal(params: {
    requestId: string;
    reviewerAdminId: string;
    approve: boolean;
    rejectionReason?: string;
  }): Promise<WithdrawalRequestRecord> {
    const record = this.requests.get(params.requestId);
    if (!record || record.status !== 'PENDING') {
      throw new Error('Invalid or non-pending withdrawal request');
    }

    record.reviewedById = params.reviewerAdminId;

    if (!params.approve) {
      record.status = 'REJECTED';
      record.rejectionReason = params.rejectionReason || 'Failed finance risk assessment';
      return record;
    }

    // 2. Finance Approval -> Settle via Ledger Entry ONLY (No direct balance mutation)
    record.status = 'APPROVED';
    await this.walletService.recordLedgerEntry({
      userId: record.userId,
      currencyType: 'DIAMOND',
      amount: -record.diamondAmount,
      type: 'WITHDRAW',
      referenceType: 'WITHDRAWAL',
      referenceId: record.id,
      description: `Approved Creator Payout: $${record.usdAmount} USD (${record.diamondAmount} Diamonds)`
    });

    record.status = 'PAID';
    return record;
  }

  getRequests(): WithdrawalRequestRecord[] {
    return Array.from(this.requests.values());
  }
}
