import { prisma } from '../config/database.js';
import { emitToUser, broadcastGlobal } from '../websocket/socketServer.js';

export interface CreateWithdrawalParams {
  userId: number;
  channel: 'RESELLER' | 'OFFICIAL';
  sellerUserId?: number;
  officialProvider?: string;
  beansAmount: number;
  paymentMethod: string;
  accountTitle: string;
  accountNumber: string;
  bankName?: string;
  iban?: string;
  idempotencyKey?: string;
}

export class WithdrawalService {
  /**
   * 1. Get or seed Withdrawal Configuration
   */
  static async getConfig() {
    let config = await prisma.withdrawalConfig.findUnique({
      where: { id: 'default' },
    });

    if (!config) {
      config = await prisma.withdrawalConfig.create({
        data: {
          id: 'default',
          beansPerUsd: 10000,
          minWithdrawalBeans: 10000,
          maxWithdrawalBeans: 5000000,
          resellerFeePercent: 0.0,
          officialFeePercent: 2.0,
          officialMethods: 'JazzCash,Easypaisa,Bank Transfer,USDT',
          isWithdrawalEnabled: true,
          isResellerWithdrawEnabled: true,
          isOfficialWithdrawEnabled: true,
        },
      });
    }

    return config;
  }

  /**
   * 2. Update Withdrawal Configuration (Admin)
   */
  static async updateConfig(data: {
    beansPerUsd?: number;
    minWithdrawalBeans?: number;
    maxWithdrawalBeans?: number;
    resellerFeePercent?: number;
    officialFeePercent?: number;
    officialMethods?: string;
    isWithdrawalEnabled?: boolean;
    isResellerWithdrawEnabled?: boolean;
    isOfficialWithdrawEnabled?: boolean;
  }) {
    await this.getConfig(); // ensure exists

    return await prisma.withdrawalConfig.update({
      where: { id: 'default' },
      data: {
        ...(data.beansPerUsd !== undefined ? { beansPerUsd: Number(data.beansPerUsd) } : {}),
        ...(data.minWithdrawalBeans !== undefined ? { minWithdrawalBeans: Number(data.minWithdrawalBeans) } : {}),
        ...(data.maxWithdrawalBeans !== undefined ? { maxWithdrawalBeans: Number(data.maxWithdrawalBeans) } : {}),
        ...(data.resellerFeePercent !== undefined ? { resellerFeePercent: Number(data.resellerFeePercent) } : {}),
        ...(data.officialFeePercent !== undefined ? { officialFeePercent: Number(data.officialFeePercent) } : {}),
        ...(data.officialMethods !== undefined ? { officialMethods: data.officialMethods } : {}),
        ...(data.isWithdrawalEnabled !== undefined ? { isWithdrawalEnabled: Boolean(data.isWithdrawalEnabled) } : {}),
        ...(data.isResellerWithdrawEnabled !== undefined ? { isResellerWithdrawEnabled: Boolean(data.isResellerWithdrawEnabled) } : {}),
        ...(data.isOfficialWithdrawEnabled !== undefined ? { isOfficialWithdrawEnabled: Boolean(data.isOfficialWithdrawEnabled) } : {}),
      },
    });
  }

  /**
   * 3. Get Active / Approved Resellers for User Selection
   */
  static async getActiveResellers() {
    // Check both CoinSellerAccount and ResellerAccount
    const coinSellers = await prisma.coinSellerAccount.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: {
          select: {
            id: true,
            numericId: true,
            username: true,
            displayName: true,
            avatar: true,
            phone: true,
            status: true,
          },
        },
      },
    });

    const resellerAccounts = await prisma.resellerAccount.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: {
          select: {
            id: true,
            numericId: true,
            username: true,
            displayName: true,
            avatar: true,
            phone: true,
            status: true,
          },
        },
      },
    });

    const config = await this.getConfig();

    const seenUserIds = new Set<number>();
    const list: any[] = [];

    for (const cs of coinSellers) {
      seenUserIds.add(cs.userId);
      list.push({
        id: cs.id,
        sellerUserId: cs.userId,
        sellerNumericId: cs.user.numericId,
        sellerName: cs.sellerName || cs.user.displayName || cs.user.username,
        username: cs.user.username,
        avatar: cs.user.avatar,
        status: cs.status,
        phone: cs.user.phone || '+923001234567',
        paymentMethods: cs.paymentMethods.split(',').map((s) => s.trim()),
        totalProcessed: cs.totalProcessed,
        startingRate: `${config.beansPerUsd.toLocaleString()} Beans = $1.00 USD`,
        beansPerUsd: config.beansPerUsd,
        feePercent: config.resellerFeePercent,
        isVerified: true,
        available: true,
      });
    }

    for (const ra of resellerAccounts) {
      if (!seenUserIds.has(ra.userId)) {
        seenUserIds.add(ra.userId);
        list.push({
          id: ra.id,
          sellerUserId: ra.userId,
          sellerNumericId: ra.user.numericId,
          sellerName: ra.displayName || ra.user.displayName || ra.user.username,
          username: ra.user.username,
          avatar: ra.user.avatar,
          status: ra.status,
          phone: ra.phone || ra.whatsappNumber || ra.user.phone || '+923001234567',
          paymentMethods: ra.paymentMethods ? ra.paymentMethods.split(',').map((s) => s.trim()) : ['JazzCash', 'Easypaisa', 'Bank Transfer'],
          totalProcessed: ra.diamondsSent || 0,
          startingRate: `${config.beansPerUsd.toLocaleString()} Beans = $1.00 USD`,
          beansPerUsd: config.beansPerUsd,
          feePercent: config.resellerFeePercent,
          isVerified: ra.isVerified,
          available: true,
        });
      }
    }

    return list;
  }

  /**
   * 4. Get Enabled Official Providers
   */
  static async getOfficialProviders() {
    const config = await this.getConfig();
    const methods = config.officialMethods.split(',').map((m) => m.trim());

    return methods.map((method) => {
      let icon = '💳';
      let description = 'Direct transfer within 1-2 business days';

      if (method.toLowerCase().includes('jazz')) {
        icon = '📱';
        description = 'Instant mobile wallet transfer (03XXXXXXXXX)';
      } else if (method.toLowerCase().includes('easy')) {
        icon = '🟢';
        description = 'Instant mobile wallet transfer (03XXXXXXXXX)';
      } else if (method.toLowerCase().includes('bank')) {
        icon = '🏛️';
        description = 'Direct IBAN / Bank account wire transfer';
      } else if (method.toLowerCase().includes('usdt')) {
        icon = '🪙';
        description = 'TRC20 / BEP20 Crypto Wallet address';
      }

      return {
        id: `official_${method.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        name: method,
        icon,
        description,
        feePercent: config.officialFeePercent,
        beansPerUsd: config.beansPerUsd,
        startingRate: `${config.beansPerUsd.toLocaleString()} Beans = $1.00 USD`,
        minBeans: config.minWithdrawalBeans,
        maxBeans: config.maxWithdrawalBeans,
        enabled: config.isOfficialWithdrawEnabled,
      };
    });
  }

  /**
   * 5. Preview Withdrawal Calculation (Server-Side)
   */
  static async previewWithdrawal(params: {
    userId: number;
    beansAmount: number;
    channel: 'RESELLER' | 'OFFICIAL';
    providerId?: string;
  }) {
    const config = await this.getConfig();

    if (!config.isWithdrawalEnabled) {
      throw new Error('Withdrawals are temporarily disabled by administration.');
    }

    if (params.channel === 'RESELLER' && !config.isResellerWithdrawEnabled) {
      throw new Error('Reseller withdrawals are currently disabled.');
    }

    if (params.channel === 'OFFICIAL' && !config.isOfficialWithdrawEnabled) {
      throw new Error('Official withdrawals are currently disabled.');
    }

    const beansAmount = Number(params.beansAmount);
    if (isNaN(beansAmount) || beansAmount <= 0) {
      throw new Error('Valid positive Beans amount is required.');
    }

    const feePercent = params.channel === 'RESELLER' ? config.resellerFeePercent : config.officialFeePercent;
    const grossUsd = parseFloat((beansAmount / config.beansPerUsd).toFixed(2));
    const feeUsd = parseFloat(((grossUsd * feePercent) / 100).toFixed(2));
    const netUsd = parseFloat((grossUsd - feeUsd).toFixed(2));

    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { id: true, numericId: true, username: true, beans: true, beansHeld: true, diamonds: true, walletFrozen: true },
    });

    const effectiveBeans = (user?.beans ?? 0) > 0 ? (user?.beans ?? 0) : (user?.diamonds ?? 0);

    return {
      channel: params.channel,
      beansAmount,
      beansPerUsd: config.beansPerUsd,
      grossUsd,
      feePercent,
      feeUsd,
      netUsd,
      minWithdrawalBeans: config.minWithdrawalBeans,
      maxWithdrawalBeans: config.maxWithdrawalBeans,
      userAvailableBeans: effectiveBeans,
      userHeldBeans: user?.beansHeld || 0,
      isSufficient: effectiveBeans >= beansAmount,
      walletFrozen: user?.walletFrozen || false,
    };
  }

  /**
   * 6. Submit Withdrawal Request (Atomic Balance Reservation & Idempotency)
   */
  static async createWithdrawalRequest(params: CreateWithdrawalParams) {
    const config = await this.getConfig();

    if (!config.isWithdrawalEnabled) {
      throw new Error('Withdrawals are currently disabled by administration.');
    }

    // Idempotency Check
    if (params.idempotencyKey) {
      const existing = await prisma.withdrawalRequest.findUnique({
        where: { idempotencyKey: params.idempotencyKey },
        include: {
          sellerUser: { include: { user: { select: { username: true, numericId: true } } } },
        },
      });
      if (existing) {
        return { isExisting: true, withdrawal: existing };
      }
    }

    const user = await prisma.user.findUnique({ where: { id: params.userId } });
    if (!user) {
      throw new Error('User not found.');
    }

    if (user.walletFrozen) {
      throw new Error('Your wallet has been frozen by administration. Cashouts are blocked.');
    }

    const beansAmount = Number(params.beansAmount);
    if (beansAmount < config.minWithdrawalBeans) {
      throw new Error(`Minimum withdrawal amount is ${config.minWithdrawalBeans.toLocaleString()} Beans ($${(config.minWithdrawalBeans / config.beansPerUsd).toFixed(2)} USD).`);
    }

    if (beansAmount > config.maxWithdrawalBeans) {
      throw new Error(`Maximum withdrawal amount per request is ${config.maxWithdrawalBeans.toLocaleString()} Beans ($${(config.maxWithdrawalBeans / config.beansPerUsd).toFixed(2)} USD).`);
    }

    // Use beans or fallback to diamonds if beans is 0 and diamonds has balance
    const availableBeans = user.beans > 0 ? user.beans : user.diamonds;
    if (availableBeans < beansAmount) {
      throw new Error(`Insufficient Beans balance. Available: ${availableBeans.toLocaleString()} Beans, Requested: ${beansAmount.toLocaleString()} Beans.`);
    }

    // Validate provider
    let sellerUserId: number | null = null;
    let sellerAccount: any = null;

    if (params.channel === 'RESELLER') {
      if (!params.sellerUserId) {
        throw new Error('Target Reseller ID is required for Reseller withdrawal.');
      }

      sellerAccount = await prisma.coinSellerAccount.findFirst({
        where: { userId: params.sellerUserId, status: 'ACTIVE' },
        include: { user: true },
      });

      if (!sellerAccount) {
        const ra = await prisma.resellerAccount.findFirst({
          where: { userId: params.sellerUserId, status: 'ACTIVE' },
          include: { user: true },
        });
        if (ra) {
          sellerAccount = { ...ra, sellerName: ra.displayName || ra.user.username };
        }
      }

      if (!sellerAccount) {
        throw new Error('Selected Reseller is inactive or does not exist.');
      }

      sellerUserId = sellerAccount.userId;
    } else {
      if (!params.officialProvider) {
        throw new Error('Official payment provider is required.');
      }
    }

    // Calculations
    const feePercent = params.channel === 'RESELLER' ? config.resellerFeePercent : config.officialFeePercent;
    const grossUsd = parseFloat((beansAmount / config.beansPerUsd).toFixed(2));
    const feeUsd = parseFloat(((grossUsd * feePercent) / 100).toFixed(2));
    const netUsd = parseFloat((grossUsd - feeUsd).toFixed(2));

    const requestNumber = `WD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const transactionId = `TX-WD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Atomic Prisma Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Move Beans from Available to Held
      const isUsingBeansField = user.beans >= beansAmount;

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: isUsingBeansField
          ? {
              beans: { decrement: beansAmount },
              beansHeld: { increment: beansAmount },
            }
          : {
              diamonds: { decrement: beansAmount },
              beansHeld: { increment: beansAmount },
            },
      });

      // 2. Create Withdrawal Request
      const withdrawal = await tx.withdrawalRequest.create({
        data: {
          requestNumber,
          userId: user.id,
          channel: params.channel,
          sellerUserId: sellerUserId,
          officialProvider: params.officialProvider || null,
          beansAmount,
          amount: beansAmount,
          currency: 'BEAN',
          conversionRate: config.beansPerUsd,
          grossUsd,
          feeUsd,
          netUsd,
          payoutAmount: netUsd,
          paymentMethod: params.paymentMethod,
          accountTitle: params.accountTitle,
          accountNumber: params.accountNumber,
          bankName: params.bankName || null,
          iban: params.iban || null,
          status: 'PENDING',
          transactionId,
          idempotencyKey: params.idempotencyKey || null,
        },
      });

      // 3. Create Wallet Ledger Transaction
      await tx.walletTransaction.create({
        data: {
          userId: user.id,
          type: 'BEANS_WITHDRAWAL_HOLD',
          currency: 'BEAN',
          amount: -beansAmount,
          balanceAfter: updatedUser.beans || updatedUser.diamonds,
          referenceId: transactionId,
          notes: `Withdrawal ${requestNumber} (${params.channel}) placed on HOLD. Gross: $${grossUsd}, Net: $${netUsd} USD.`,
        },
      });

      return { updatedUser, withdrawal };
    });

    // Realtime Socket.IO Dispatches
    emitToUser(user.numericId, 'wallet.updated', {
      transactionId,
      newBeansBalance: result.updatedUser.beans,
      heldBeans: result.updatedUser.beansHeld,
      status: 'PENDING',
    });

    if (sellerAccount && sellerAccount.user) {
      emitToUser(sellerAccount.user.numericId, 'withdrawal.created', {
        requestNumber,
        transactionId,
        userNumericId: user.numericId,
        username: user.username,
        beansAmount,
        netUsd,
        paymentMethod: params.paymentMethod,
      });
    }

    broadcastGlobal('admin.activity', {
      type: 'WITHDRAWAL_CREATED',
      requestNumber,
      userNumericId: user.numericId,
      username: user.username,
      channel: params.channel,
      beansAmount,
      netUsd,
      timestamp: new Date().toISOString(),
    });

    return { isExisting: false, withdrawal: result.withdrawal };
  }

  /**
   * 7. Get My Withdrawal History
   */
  static async getMyWithdrawals(userId: number) {
    const list = await prisma.withdrawalRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        sellerUser: {
          include: {
            user: { select: { numericId: true, username: true, displayName: true, avatar: true } },
          },
        },
      },
    });

    return list.map((w) => ({
      id: w.id,
      requestNumber: w.requestNumber,
      transactionId: w.transactionId,
      channel: w.channel,
      sellerNumericId: w.sellerUser?.user?.numericId,
      sellerUsername: w.sellerUser?.user?.username,
      sellerDisplayName: w.sellerUser?.user?.displayName,
      officialProvider: w.officialProvider,
      beansAmount: w.beansAmount || w.amount,
      conversionRate: w.conversionRate,
      grossUsd: w.grossUsd,
      feeUsd: w.feeUsd,
      netUsd: w.netUsd || w.payoutAmount,
      payoutAmount: w.payoutAmount || w.netUsd,
      paymentMethod: w.paymentMethod,
      accountTitle: w.accountTitle,
      accountNumber: w.accountNumber,
      bankName: w.bankName,
      iban: w.iban,
      status: w.status,
      rejectionReason: w.rejectionReason,
      paymentReference: w.paymentReference,
      processedAt: w.processedAt,
      completedAt: w.completedAt,
      createdAt: w.createdAt.toISOString(),
    }));
  }

  /**
   * 8. Get Single Withdrawal Details
   */
  static async getWithdrawalById(id: string, requesterUserId: number, requesterRole?: string) {
    const w = await prisma.withdrawalRequest.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, numericId: true, username: true, displayName: true, avatar: true, phone: true, email: true } },
        sellerUser: { include: { user: { select: { id: true, numericId: true, username: true, displayName: true, avatar: true } } } },
      },
    });

    if (!w) throw new Error('Withdrawal request not found.');

    const isOwner = w.userId === requesterUserId;
    const isSeller = w.sellerUserId === requesterUserId;
    const isAdmin = requesterRole === 'ADMIN' || requesterRole === 'SUPER_ADMIN';

    if (!isOwner && !isSeller && !isAdmin) {
      throw new Error('Unauthorized to view this withdrawal request.');
    }

    return w;
  }

  /**
   * 9. Reseller Queue: Get assigned withdrawals for logged-in Reseller
   */
  static async getResellerWithdrawals(resellerUserId: number, status?: string) {
    const where: any = {
      sellerUserId: resellerUserId,
      channel: 'RESELLER',
    };

    if (status && status !== 'ALL') {
      where.status = status;
    }

    const list = await prisma.withdrawalRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            numericId: true,
            username: true,
            displayName: true,
            avatar: true,
            phone: true,
          },
        },
      },
    });

    return list;
  }

  /**
   * 10. Reseller Action: Process, Mark Payment Sent, Complete, Reject
   */
  static async processResellerWithdrawal(
    resellerUserId: number,
    requestId: string,
    action: 'PROCESS' | 'PAYMENT_SENT' | 'COMPLETE' | 'REJECT',
    data?: { notes?: string; paymentReference?: string; paymentProof?: string; rejectionReason?: string }
  ) {
    const request = await prisma.withdrawalRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!request) throw new Error('Withdrawal request not found.');
    if (request.sellerUserId !== resellerUserId) {
      throw new Error('Unauthorized. This withdrawal request is not assigned to your reseller account.');
    }

    if (request.status === 'COMPLETED' || request.status === 'REJECTED' || request.status === 'CANCELLED') {
      throw new Error(`Cannot modify request with final status: ${request.status}`);
    }

    const now = new Date();

    if (action === 'PROCESS') {
      if (request.status !== 'PENDING') throw new Error(`Invalid state transition from ${request.status} to PROCESSING.`);
      const updated = await prisma.withdrawalRequest.update({
        where: { id: requestId },
        data: {
          status: 'PROCESSING',
          processedAt: now,
          processedBy: `Reseller UID ${resellerUserId}`,
        },
      });

      emitToUser(request.user.numericId, 'withdrawal.processing', {
        requestNumber: request.requestNumber,
        status: 'PROCESSING',
      });
      return updated;
    }

    if (action === 'PAYMENT_SENT') {
      const updated = await prisma.withdrawalRequest.update({
        where: { id: requestId },
        data: {
          status: 'PAYMENT_SENT',
          paymentReference: data?.paymentReference || null,
          paymentProof: data?.paymentProof || null,
        },
      });

      emitToUser(request.user.numericId, 'withdrawal.payment_sent', {
        requestNumber: request.requestNumber,
        paymentReference: data?.paymentReference,
        status: 'PAYMENT_SENT',
      });
      return updated;
    }

    if (action === 'COMPLETE') {
      const beansAmount = request.beansAmount || request.amount;

      const result = await prisma.$transaction(async (tx) => {
        // 1. Permanently settle Held Beans (deduct from beansHeld)
        await tx.user.update({
          where: { id: request.userId },
          data: {
            beansHeld: { decrement: beansAmount },
          },
        });

        // 2. Mark request COMPLETED
        const completed = await tx.withdrawalRequest.update({
          where: { id: requestId },
          data: {
            status: 'COMPLETED',
            completedAt: now,
            paymentReference: data?.paymentReference || request.paymentReference,
          },
        });

        // 3. Increment seller totalProcessed if seller account exists
        await tx.coinSellerAccount.updateMany({
          where: { userId: resellerUserId },
          data: { totalProcessed: { increment: 1 } },
        });

        // 4. Record settled ledger entry
        await tx.walletTransaction.create({
          data: {
            userId: request.userId,
            type: 'BEANS_WITHDRAWAL_SETTLED',
            currency: 'BEAN',
            amount: 0,
            balanceAfter: request.user.beans,
            referenceId: request.transactionId,
            notes: `Withdrawal ${request.requestNumber} completed and settled by Reseller.`,
          },
        });

        return completed;
      });

      emitToUser(request.user.numericId, 'withdrawal.completed', {
        requestNumber: request.requestNumber,
        status: 'COMPLETED',
        netUsd: request.netUsd,
      });

      return result;
    }

    if (action === 'REJECT') {
      const beansAmount = request.beansAmount || request.amount;
      const reason = data?.rejectionReason || data?.notes || 'Rejected by Reseller';

      const result = await prisma.$transaction(async (tx) => {
        // 1. Refund Held Beans back to Available Beans
        const isOriginalBeans = request.user.beans >= 0;

        const refundedUser = await tx.user.update({
          where: { id: request.userId },
          data: {
            beans: { increment: beansAmount },
            beansHeld: { decrement: beansAmount },
          },
        });

        // 2. Mark request REJECTED
        const rejected = await tx.withdrawalRequest.update({
          where: { id: requestId },
          data: {
            status: 'REJECTED',
            rejectedAt: now,
            rejectionReason: reason,
          },
        });

        // 3. Record refund ledger entry
        await tx.walletTransaction.create({
          data: {
            userId: request.userId,
            type: 'BEANS_WITHDRAWAL_REFUND',
            currency: 'BEAN',
            amount: beansAmount,
            balanceAfter: refundedUser.beans,
            referenceId: request.transactionId,
            notes: `Withdrawal ${request.requestNumber} rejected. Refunded ${beansAmount.toLocaleString()} Beans to balance. Reason: ${reason}`,
          },
        });

        return { refundedUser, rejected };
      });

      emitToUser(request.user.numericId, 'withdrawal.rejected', {
        requestNumber: request.requestNumber,
        status: 'REJECTED',
        refundedBeans: beansAmount,
        reason,
      });

      return result.rejected;
    }

    throw new Error(`Unsupported action: ${action}`);
  }

  /**
   * 11. Admin: Get all withdrawals with filters & telemetry
   */
  static async getAdminWithdrawals(params?: {
    channel?: string;
    status?: string;
    search?: string;
    limit?: number;
    page?: number;
  }) {
    const where: any = {};

    if (params?.channel && params.channel !== 'ALL') {
      where.channel = params.channel;
    }

    if (params?.status && params.status !== 'ALL') {
      where.status = params.status;
    }

    if (params?.search) {
      const q = params.search.trim();
      const isNum = !isNaN(Number(q));
      where.OR = [
        { requestNumber: { contains: q, mode: 'insensitive' } },
        { transactionId: { contains: q, mode: 'insensitive' } },
        { accountTitle: { contains: q, mode: 'insensitive' } },
        { accountNumber: { contains: q, mode: 'insensitive' } },
        { user: { username: { contains: q, mode: 'insensitive' } } },
        ...(isNum ? [{ user: { numericId: Number(q) } }] : []),
      ];
    }

    const [total, requests, config] = await Promise.all([
      prisma.withdrawalRequest.count({ where }),
      prisma.withdrawalRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: params?.limit || 50,
        include: {
          user: {
            select: {
              id: true,
              numericId: true,
              username: true,
              displayName: true,
              avatar: true,
              phone: true,
              email: true,
              beans: true,
              beansHeld: true,
            },
          },
          sellerUser: {
            include: {
              user: {
                select: {
                  numericId: true,
                  username: true,
                  displayName: true,
                },
              },
            },
          },
        },
      }),
      this.getConfig(),
    ]);

    const [pendingCount, completedCount, rejectedCount] = await Promise.all([
      prisma.withdrawalRequest.count({ where: { status: 'PENDING' } }),
      prisma.withdrawalRequest.count({ where: { status: 'COMPLETED' } }),
      prisma.withdrawalRequest.count({ where: { status: 'REJECTED' } }),
    ]);

    return {
      requests,
      total,
      stats: {
        pendingCount,
        completedCount,
        rejectedCount,
        beansPerUsd: config.beansPerUsd,
        resellerFeePercent: config.resellerFeePercent,
        officialFeePercent: config.officialFeePercent,
      },
    };
  }

  /**
   * 12. Admin: Process Official / Any Withdrawal
   */
  static async processAdminWithdrawal(
    adminUserId: number,
    requestId: string,
    action: 'PROCESS' | 'PAYMENT_SENT' | 'COMPLETE' | 'REJECT',
    data?: { notes?: string; paymentReference?: string; paymentProof?: string; rejectionReason?: string }
  ) {
    const request = await prisma.withdrawalRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!request) throw new Error('Withdrawal request not found.');

    if (request.status === 'COMPLETED' || request.status === 'REJECTED' || request.status === 'CANCELLED') {
      throw new Error(`Cannot modify request with final status: ${request.status}`);
    }

    const now = new Date();

    if (action === 'PROCESS') {
      const updated = await prisma.withdrawalRequest.update({
        where: { id: requestId },
        data: {
          status: 'PROCESSING',
          processedAt: now,
          processedBy: `Admin UID ${adminUserId}`,
        },
      });

      emitToUser(request.user.numericId, 'withdrawal.processing', {
        requestNumber: request.requestNumber,
        status: 'PROCESSING',
      });
      return updated;
    }

    if (action === 'PAYMENT_SENT') {
      const updated = await prisma.withdrawalRequest.update({
        where: { id: requestId },
        data: {
          status: 'PAYMENT_SENT',
          paymentReference: data?.paymentReference || null,
          paymentProof: data?.paymentProof || null,
        },
      });

      emitToUser(request.user.numericId, 'withdrawal.payment_sent', {
        requestNumber: request.requestNumber,
        paymentReference: data?.paymentReference,
        status: 'PAYMENT_SENT',
      });
      return updated;
    }

    if (action === 'COMPLETE') {
      const beansAmount = request.beansAmount || request.amount;

      const result = await prisma.$transaction(async (tx) => {
        // Settle Held Beans
        await tx.user.update({
          where: { id: request.userId },
          data: {
            beansHeld: { decrement: beansAmount },
          },
        });

        // Mark COMPLETED
        const completed = await tx.withdrawalRequest.update({
          where: { id: requestId },
          data: {
            status: 'COMPLETED',
            completedAt: now,
            paymentReference: data?.paymentReference || request.paymentReference,
          },
        });

        // Record settled transaction
        await tx.walletTransaction.create({
          data: {
            userId: request.userId,
            type: 'BEANS_WITHDRAWAL_SETTLED',
            currency: 'BEAN',
            amount: 0,
            balanceAfter: request.user.beans,
            referenceId: request.transactionId,
            notes: `Official withdrawal ${request.requestNumber} completed & settled by Administration.`,
          },
        });

        return completed;
      });

      emitToUser(request.user.numericId, 'withdrawal.completed', {
        requestNumber: request.requestNumber,
        status: 'COMPLETED',
        netUsd: request.netUsd,
      });

      return result;
    }

    if (action === 'REJECT') {
      const beansAmount = request.beansAmount || request.amount;
      const reason = data?.rejectionReason || data?.notes || 'Rejected by Administration';

      const result = await prisma.$transaction(async (tx) => {
        // Refund Held Beans to Available
        const refundedUser = await tx.user.update({
          where: { id: request.userId },
          data: {
            beans: { increment: beansAmount },
            beansHeld: { decrement: beansAmount },
          },
        });

        const rejected = await tx.withdrawalRequest.update({
          where: { id: requestId },
          data: {
            status: 'REJECTED',
            rejectedAt: now,
            rejectionReason: reason,
          },
        });

        await tx.walletTransaction.create({
          data: {
            userId: request.userId,
            type: 'BEANS_WITHDRAWAL_REFUND',
            currency: 'BEAN',
            amount: beansAmount,
            balanceAfter: refundedUser.beans,
            referenceId: request.transactionId,
            notes: `Official withdrawal ${request.requestNumber} rejected. Refunded ${beansAmount.toLocaleString()} Beans to balance. Reason: ${reason}`,
          },
        });

        return { refundedUser, rejected };
      });

      emitToUser(request.user.numericId, 'withdrawal.rejected', {
        requestNumber: request.requestNumber,
        status: 'REJECTED',
        refundedBeans: beansAmount,
        reason,
      });

      return result.rejected;
    }

    throw new Error(`Unsupported action: ${action}`);
  }
}
