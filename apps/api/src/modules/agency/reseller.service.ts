import { WalletLedgerService } from '../../../../packages/wallet/src/index.js';

export class ResellerService {
  private resellerStocks: Map<string, bigint> = new Map();

  constructor(private walletService: WalletLedgerService) {}

  addStock(resellerId: string, coinsCount: bigint) {
    const current = this.resellerStocks.get(resellerId) || BigInt(0);
    this.resellerStocks.set(resellerId, current + coinsCount);
  }

  async transferCoinsToUser(resellerId: string, targetUserId: string, coinsCount: bigint) {
    const currentStock = this.resellerStocks.get(resellerId) || BigInt(0);
    if (currentStock < coinsCount) {
      throw new Error(`Insufficient reseller stock. Available: ${currentStock}, Requested: ${coinsCount}`);
    }

    this.resellerStocks.set(resellerId, currentStock - coinsCount);

    await this.walletService.recordLedgerEntry({
      userId: targetUserId,
      currencyType: 'COIN',
      amount: coinsCount,
      type: 'RESELLER_TRANSFER',
      referenceType: 'RECHARGE_ORDER',
      idempotencyKey: `idemp-reseller-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      description: `Reseller Direct Recharge: ${coinsCount} Coins`
    });

    return { success: true, remainingStock: this.resellerStocks.get(resellerId) };
  }
}
