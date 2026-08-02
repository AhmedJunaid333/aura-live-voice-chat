import { WalletLedgerService } from '../../../../packages/wallet/src/index.js';

export type PaymentProvider = 'STRIPE' | 'GOOGLE_PLAY' | 'APPLE_IAP' | 'EASYPAISA' | 'JAZZCASH';

export interface PaymentOrderRecord {
  id: string;
  userId: string;
  amountUsd: number;
  coinsGranted: bigint;
  provider: PaymentProvider;
  transactionRef: string;
  status: 'PENDING' | 'COMPLETED' | 'REFUNDED';
  createdAt: Date;
}

export class PaymentService {
  private orders: Map<string, PaymentOrderRecord> = new Map();

  constructor(private walletService: WalletLedgerService) {}

  async createOrder(params: {
    userId: string;
    amountUsd: number;
    coinsGranted: bigint;
    provider: PaymentProvider;
  }): Promise<PaymentOrderRecord> {
    const transactionRef = `tx-${params.provider}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const order: PaymentOrderRecord = {
      id: `ord-${Date.now()}`,
      userId: params.userId,
      amountUsd: params.amountUsd,
      coinsGranted: params.coinsGranted,
      provider: params.provider,
      transactionRef,
      status: 'PENDING',
      createdAt: new Date()
    };
    this.orders.set(order.id, order);
    return order;
  }

  async processWebhookPayment(transactionRef: string): Promise<PaymentOrderRecord> {
    const order = Array.from(this.orders.values()).find(o => o.transactionRef === transactionRef);
    if (!order || order.status === 'COMPLETED') {
      throw new Error('Invalid or already processed payment transaction');
    }

    // Double-Entry Ledger Credit
    await this.walletService.recordLedgerEntry({
      userId: order.userId,
      currencyType: 'COIN',
      amount: order.coinsGranted,
      type: 'RECHARGE',
      referenceType: 'RECHARGE_ORDER',
      referenceId: order.id,
      idempotencyKey: `idemp-recharge-${order.transactionRef}`,
      description: `Recharge via ${order.provider}: $${order.amountUsd} USD (${order.coinsGranted} Coins)`
    });

    order.status = 'COMPLETED';
    return order;
  }
}
