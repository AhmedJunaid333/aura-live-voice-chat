import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { emitToUser, broadcastGlobal } from '../websocket/socketServer.js';
import { z } from 'zod';

export const withdrawalRouter = Router();

const createWithdrawalSchema = z.object({
  sellerUserId: z.number().int().positive(),
  amount: z.number().int().positive(),
  currency: z.enum(['DIAMOND', 'COIN', 'BEAN']).default('DIAMOND'),
  paymentMethod: z.string().min(2),
  accountTitle: z.string().min(2),
  accountNumber: z.string().min(4),
});

const processWithdrawalSchema = z.object({
  requestId: z.string().min(1),
  action: z.enum(['APPROVE', 'COMPLETE', 'REJECT']),
  reason: z.string().optional(),
});

// GET /api/v1/withdrawal/sellers — List active Coin Sellers
withdrawalRouter.get('/sellers', async (req, res, next) => {
  try {
    let sellers = await prisma.coinSellerAccount.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: {
          select: {
            numericId: true,
            username: true,
            avatar: true,
            status: true,
          },
        },
      },
    });

    // Seed default official seller if none exists in DB
    if (sellers.length === 0) {
      const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
      if (adminUser) {
        const seeded = await prisma.coinSellerAccount.create({
          data: {
            userId: adminUser.id,
            sellerName: 'Aura Official Direct Exchange Agent',
            status: 'ACTIVE',
            paymentMethods: 'Easypaisa,JazzCash,Bank Transfer (HBL/UBL),USDT',
          },
          include: {
            user: {
              select: {
                numericId: true,
                username: true,
                avatar: true,
                status: true,
              },
            },
          },
        });
        sellers = [seeded];
      }
    }

    res.status(200).json({
      success: true,
      data: sellers.map((s) => ({
        id: s.id,
        sellerUserId: s.userId,
        sellerNumericId: s.user.numericId,
        sellerName: s.sellerName,
        username: s.user.username,
        avatar: s.user.avatar,
        status: s.status,
        paymentMethods: s.paymentMethods.split(','),
        totalProcessed: s.totalProcessed,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/withdrawal/request — User submits cashout request with atomic balance reservation
withdrawalRouter.post('/request', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = createWithdrawalSchema.parse(req.body);
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    if (user.walletFrozen) {
      res.status(403).json({ success: false, error: 'Your wallet is currently frozen by administration.' });
      return;
    }

    if (user.diamonds < validated.amount) {
      res.status(400).json({
        success: false,
        error: `Insufficient balance. Available: ${user.diamonds} 💎, Requested: ${validated.amount} 💎`,
      });
      return;
    }

    const sellerAccount = await prisma.coinSellerAccount.findFirst({
      where: { userId: validated.sellerUserId, status: 'ACTIVE' },
      include: { user: true },
    });

    if (!sellerAccount) {
      res.status(400).json({ success: false, error: 'Selected Coin Seller is inactive or invalid.' });
      return;
    }

    const transactionId = `WD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const requestNumber = `REQ-${Date.now().toString().slice(-6)}`;
    const payoutAmount = (validated.amount / 45000).toFixed(2); // $1 USD per 45,000 Diamonds

    const result = await prisma.$transaction(async (tx) => {
      // 1. Deduct balance from User (Reserve)
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { diamonds: { decrement: validated.amount } },
      });

      // 2. Create Withdrawal Request
      const withdrawalReq = await tx.withdrawalRequest.create({
        data: {
          requestNumber,
          userId: user.id,
          sellerUserId: sellerAccount.userId,
          amount: validated.amount,
          currency: validated.currency,
          payoutAmount: parseFloat(payoutAmount),
          paymentMethod: validated.paymentMethod,
          accountTitle: validated.accountTitle,
          accountNumber: validated.accountNumber,
          status: 'PENDING',
          transactionId,
        },
      });

      // 3. Ledger Entry
      await tx.walletTransaction.create({
        data: {
          userId: user.id,
          type: 'WITHDRAWAL_RESERVE',
          currency: validated.currency,
          amount: -validated.amount,
          balanceAfter: updatedUser.diamonds,
          referenceId: transactionId,
          notes: `Cashout request ${requestNumber} reserved for Coin Seller @${sellerAccount.user.username}`,
        },
      });

      return { updatedUser, withdrawalReq };
    });

    // Realtime Socket.IO Events
    emitToUser(user.numericId, 'wallet.updated', {
      transactionId,
      newBalance: Number(result.updatedUser.diamonds),
      amountDeducted: validated.amount,
      status: 'PENDING',
    });

    emitToUser(sellerAccount.user.numericId, 'withdrawal.created', {
      requestNumber,
      transactionId,
      userNumericId: user.numericId,
      username: user.username,
      amount: validated.amount,
      payoutAmount: parseFloat(payoutAmount),
      paymentMethod: validated.paymentMethod,
    });

    broadcastGlobal('admin.activity', {
      type: 'WITHDRAWAL_CREATED',
      requestNumber,
      userNumericId: user.numericId,
      username: user.username,
      sellerUsername: sellerAccount.user.username,
      amount: validated.amount,
      payoutAmount: parseFloat(payoutAmount),
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully! Awaiting seller approval.',
      data: {
        id: result.withdrawalReq.id,
        requestNumber,
        transactionId,
        amount: validated.amount,
        payoutAmount: parseFloat(payoutAmount),
        status: 'PENDING',
        remainingBalance: Number(result.updatedUser.diamonds),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/withdrawal/requests — Fetch withdrawal requests queue
withdrawalRouter.get('/requests', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    let whereClause: any = {};
    if (user.role === 'ADMIN') {
      whereClause = {}; // Admin sees all
    } else {
      const isSeller = await prisma.coinSellerAccount.findUnique({ where: { userId: user.id } });
      if (isSeller) {
        whereClause = { OR: [{ userId: user.id }, { sellerUserId: user.id }] };
      } else {
        whereClause = { userId: user.id }; // Regular user sees own
      }
    }

    const requests = await prisma.withdrawalRequest.findMany({
      where: whereClause,
      include: {
        user: { select: { numericId: true, username: true, avatar: true } },
        sellerUser: { include: { user: { select: { numericId: true, username: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.status(200).json({
      success: true,
      data: requests.map((r) => ({
        id: r.id,
        requestNumber: r.requestNumber,
        transactionId: r.transactionId,
        userNumericId: r.user.numericId,
        username: r.user.username,
        avatar: r.user.avatar,
        sellerNumericId: r.sellerUser.user.numericId,
        sellerUsername: r.sellerUser.user.username,
        amount: r.amount,
        currency: r.currency,
        payoutAmount: r.payoutAmount,
        paymentMethod: r.paymentMethod,
        accountTitle: r.accountTitle,
        accountNumber: r.accountNumber,
        status: r.status,
        rejectionReason: r.rejectionReason,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/withdrawal/process — Coin Seller / Admin process request (Approve, Complete, Reject)
withdrawalRouter.post('/process', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = processWithdrawalSchema.parse(req.body);
    const actorId = req.user!.userId;

    const actor = await prisma.user.findUnique({ where: { id: actorId } });
    if (!actor) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const request = await prisma.withdrawalRequest.findUnique({
      where: { id: validated.requestId },
      include: { user: true, sellerUser: { include: { user: true } } },
    });

    if (!request) {
      res.status(404).json({ success: false, error: 'Withdrawal request not found' });
      return;
    }

    if (request.status === 'COMPLETED' || request.status === 'REJECTED') {
      res.status(400).json({ success: false, error: `Request is already ${request.status}` });
      return;
    }

    // Permission check: Must be Admin OR the assigned Coin Seller
    const isAssignedSeller = request.sellerUserId === actor.id;
    if (actor.role !== 'ADMIN' && !isAssignedSeller) {
      res.status(403).json({ success: false, error: 'Unauthorized. You are not the assigned Coin Seller or Admin.' });
      return;
    }

    if (validated.action === 'COMPLETE' || validated.action === 'APPROVE') {
      const updatedReq = await prisma.$transaction(async (tx) => {
        const completed = await tx.withdrawalRequest.update({
          where: { id: request.id },
          data: { status: 'COMPLETED' },
        });

        await tx.coinSellerAccount.update({
          where: { userId: request.sellerUserId },
          data: { totalProcessed: { increment: 1 } },
        });

        await tx.walletTransaction.create({
          data: {
            userId: request.userId,
            type: 'WITHDRAWAL_COMPLETED',
            currency: request.currency,
            amount: 0,
            balanceAfter: request.user.diamonds,
            referenceId: request.transactionId,
            notes: `Withdrawal ${request.requestNumber} completed by @${actor.username}`,
          },
        });

        return completed;
      });

      emitToUser(request.user.numericId, 'withdrawal.completed', {
        requestNumber: request.requestNumber,
        transactionId: request.transactionId,
        amount: request.amount,
        status: 'COMPLETED',
      });

      broadcastGlobal('admin.activity', {
        type: 'WITHDRAWAL_COMPLETED',
        requestNumber: request.requestNumber,
        userNumericId: request.user.numericId,
        processedBy: actor.username,
        timestamp: new Date().toISOString(),
      });

      res.status(200).json({
        success: true,
        message: `Withdrawal ${request.requestNumber} completed successfully!`,
        data: updatedReq,
      });
    } else if (validated.action === 'REJECT') {
      const result = await prisma.$transaction(async (tx) => {
        // Refund reserved balance
        const refundedUser = await tx.user.update({
          where: { id: request.userId },
          data: { diamonds: { increment: request.amount } },
        });

        const rejected = await tx.withdrawalRequest.update({
          where: { id: request.id },
          data: {
            status: 'REJECTED',
            rejectionReason: validated.reason || 'Rejected by Coin Seller / Admin',
          },
        });

        await tx.walletTransaction.create({
          data: {
            userId: request.userId,
            type: 'WITHDRAWAL_REFUND',
            currency: request.currency,
            amount: request.amount,
            balanceAfter: refundedUser.diamonds,
            referenceId: request.transactionId,
            notes: `Withdrawal ${request.requestNumber} rejected. Refunded ${request.amount} 💎 to user balance.`,
          },
        });

        return { refundedUser, rejected };
      });

      emitToUser(request.user.numericId, 'withdrawal.rejected', {
        requestNumber: request.requestNumber,
        transactionId: request.transactionId,
        refundedAmount: request.amount,
        newBalance: Number(result.refundedUser.diamonds),
        reason: validated.reason,
        status: 'REJECTED',
      });

      broadcastGlobal('admin.activity', {
        type: 'WITHDRAWAL_REJECTED',
        requestNumber: request.requestNumber,
        userNumericId: request.user.numericId,
        processedBy: actor.username,
        reason: validated.reason,
        timestamp: new Date().toISOString(),
      });

      res.status(200).json({
        success: true,
        message: `Withdrawal ${request.requestNumber} rejected and refunded to user.`,
        data: result.rejected,
      });
    }
  } catch (error) {
    next(error);
  }
});
