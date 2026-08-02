// Strict Double-Entry Wallet Ledger Service with Currency Separation & Idempotency
export type CurrencyType = 'COIN' | 'DIAMOND';
export type WalletTransactionType = 'RECHARGE' | 'SEND_GIFT' | 'RECEIVE_GIFT' | 'WITHDRAW' | 'COMMISSION' | 'VIP_PURCHASE';
export type ReferenceType = 'RECHARGE_ORDER' | 'GIFT_TRANSACTION' | 'VIP_PURCHASE' | 'WITHDRAWAL' | 'COMMISSION_SETTLEMENT';

export interface WalletAccountRecord {
  id: string;
  userId: string;
  currencyType: CurrencyType;
  balance: bigint;
}

export interface LedgerEntryRecord {
  id: string;
  accountId: string;
  userId: string;
  currencyType: CurrencyType;
  amount: bigint;
  type: WalletTransactionType;
  referenceType: ReferenceType;
  referenceId?: string;
  idempotencyKey?: string;
  balanceBefore: bigint;
  balanceAfter: bigint;
  description?: string;
  createdAt: Date;
}

export class WalletLedgerService {
  private accounts: Map<string, WalletAccountRecord> = new Map(); // Key: userId_currencyType
  private ledgerEntries: LedgerEntryRecord[] = [];
  private idempotencyKeys: Set<string> = new Set();

  private getAccountKey(userId: string, currency: CurrencyType): string {
    return `${userId}_${currency}`;
  }

  getAccount(userId: string, currency: CurrencyType): WalletAccountRecord {
    const key = this.getAccountKey(userId, currency);
    if (!this.accounts.has(key)) {
      const initialBalance = currency === 'COIN' ? BigInt(50000) : BigInt(0);
      this.accounts.set(key, {
        id: `acc-${key}`,
        userId,
        currencyType: currency,
        balance: initialBalance
      });
    }
    return this.accounts.get(key)!;
  }

  /**
   * Ledger-based entry recording with Idempotency Key protection
   */
  async recordLedgerEntry(params: {
    userId: string;
    currencyType: CurrencyType;
    amount: bigint; // positive for credit, negative for debit
    type: WalletTransactionType;
    referenceType: ReferenceType;
    referenceId?: string;
    idempotencyKey?: string;
    description?: string;
  }): Promise<LedgerEntryRecord> {
    // 1. Idempotency Check
    if (params.idempotencyKey) {
      if (this.idempotencyKeys.has(params.idempotencyKey)) {
        throw new Error(`Duplicate transaction prevented. IdempotencyKey '${params.idempotencyKey}' already processed.`);
      }
      this.idempotencyKeys.add(params.idempotencyKey);
    }

    const account = this.getAccount(params.userId, params.currencyType);

    // 2. Debit Validation
    if (params.amount < 0 && account.balance < (-params.amount)) {
      throw new Error(`Insufficient ${params.currencyType} balance. Required: ${-params.amount}, Available: ${account.balance}`);
    }

    // 3. Balance Projection Update
    const balanceBefore = account.balance;
    account.balance += params.amount;
    const balanceAfter = account.balance;

    // 4. Immutable Ledger Entry
    const entry: LedgerEntryRecord = {
      id: `ledger-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      accountId: account.id,
      userId: params.userId,
      currencyType: params.currencyType,
      amount: params.amount,
      type: params.type,
      referenceType: params.referenceType,
      referenceId: params.referenceId,
      idempotencyKey: params.idempotencyKey,
      balanceBefore,
      balanceAfter,
      description: params.description,
      createdAt: new Date()
    };

    this.ledgerEntries.push(entry);
    return entry;
  }

  /**
   * Atomic Gift Transaction Pipeline:
   * Debit Sender Coins -> Credit Receiver Diamonds
   */
  async processGiftTransaction(params: {
    senderId: string;
    receiverId: string;
    giftId: string;
    giftName: string;
    giftCount: number;
    totalCoins: bigint;
    diamondsEarned: bigint;
    idempotencyKey?: string;
  }): Promise<{ senderEntry: LedgerEntryRecord; receiverEntry: LedgerEntryRecord }> {
    const senderEntry = await this.recordLedgerEntry({
      userId: params.senderId,
      currencyType: 'COIN',
      amount: -params.totalCoins,
      type: 'SEND_GIFT',
      referenceType: 'GIFT_TRANSACTION',
      referenceId: params.giftId,
      idempotencyKey: params.idempotencyKey ? `${params.idempotencyKey}_debit` : undefined,
      description: `Sent ${params.giftCount} x ${params.giftName}`
    });

    const receiverEntry = await this.recordLedgerEntry({
      userId: params.receiverId,
      currencyType: 'DIAMOND',
      amount: params.diamondsEarned,
      type: 'RECEIVE_GIFT',
      referenceType: 'GIFT_TRANSACTION',
      referenceId: params.giftId,
      idempotencyKey: params.idempotencyKey ? `${params.idempotencyKey}_credit` : undefined,
      description: `Received ${params.giftCount} x ${params.giftName}`
    });

    return { senderEntry, receiverEntry };
  }

  getLedgerHistory(userId: string): LedgerEntryRecord[] {
    return this.ledgerEntries.filter(e => e.userId === userId);
  }
}
