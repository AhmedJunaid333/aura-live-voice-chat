import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { emitToUser, broadcastGlobal } from '../websocket/socketServer.js';
import { z } from 'zod';

export const walletRouter = Router();

const transferSchema = z.object({
  targetNumericId: z.number().int().positive(),
  amount: z.number().int().positive(),
  currency: z.enum(['DIAMOND', 'COIN']).default('DIAMOND'),
  notes: z.string().optional(),
});

// Get Current User Wallet Balance (Authoritative Source of Truth)
walletRouter.get('/balance', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        numericId: true,
        username: true,
        coins: true,
        diamonds: true,
        walletFrozen: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        numericId: user.numericId,
        coins: Number(user.coins),
        diamonds: Number(user.diamonds),
        walletFrozen: user.walletFrozen,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get User Wallet Transaction Ledger
walletRouter.get('/transactions', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const txns = await prisma.walletTransaction.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.status(200).json({
      success: true,
      data: txns.map((t) => ({
        id: t.id,
        type: t.type,
        currency: t.currency,
        amount: Number(t.amount),
        balanceAfter: Number(t.balanceAfter),
        referenceId: t.referenceId,
        notes: t.notes,
        createdAt: t.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    next(error);
  }
});

// Atomic Direct Diamond / Coin Transfer Between Users (3-Way Consistency)
walletRouter.post('/transfer', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = transferSchema.parse(req.body);
    const amountInt = validated.amount;
    const senderUserId = req.user!.userId;

    const sender = await prisma.user.findUnique({ where: { id: senderUserId } });
    if (!sender) {
      res.status(404).json({ success: false, error: 'Sender not found' });
      return;
    }

    if (sender.walletFrozen) {
      res.status(403).json({ success: false, error: 'Your wallet is currently frozen by administration.' });
      return;
    }

    if (sender.diamonds < amountInt) {
      res.status(400).json({
        success: false,
        error: `Insufficient balance. Available: ${sender.diamonds} 💎, Required: ${validated.amount} 💎`,
      });
      return;
    }

    const receiver = await prisma.user.findUnique({
      where: { numericId: validated.targetNumericId },
    });

    if (!receiver) {
      res.status(404).json({ success: false, error: `Receiver UID ${validated.targetNumericId} not found.` });
      return;
    }

    const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Atomic Database Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Deduct sender
      const updatedSender = await tx.user.update({
        where: { id: sender.id },
        data: { diamonds: { decrement: amountInt } },
      });

      // 2. Credit receiver
      const updatedReceiver = await tx.user.update({
        where: { id: receiver.id },
        data: { diamonds: { increment: amountInt } },
      });

      // 3. Sender Ledger Entry
      await tx.walletTransaction.create({
        data: {
          userId: sender.id,
          type: 'RESELLER_TO_USER',
          currency: 'DIAMOND',
          amount: -amountInt,
          balanceAfter: updatedSender.diamonds,
          referenceId: transactionId,
          notes: `Sent ${validated.amount} 💎 to UID ${receiver.numericId} (@${receiver.username})`,
        },
      });

      // 4. Receiver Ledger Entry
      await tx.walletTransaction.create({
        data: {
          userId: receiver.id,
          type: 'RESELLER_TO_USER',
          currency: 'DIAMOND',
          amount: amountInt,
          balanceAfter: updatedReceiver.diamonds,
          referenceId: transactionId,
          notes: `Received ${validated.amount} 💎 from UID ${sender.numericId} (@${sender.username})`,
        },
      });

      return { updatedSender, updatedReceiver, transactionId };
    });


    // Realtime Socket.IO Notifications (Sender App, Receiver App, Admin Portal)
    emitToUser(sender.numericId, 'diamond.updated', {
      transactionId,
      newBalance: Number(result.updatedSender.diamonds),
      amountDeducted: validated.amount,
      targetUserId: receiver.numericId,
      timestamp: new Date().toISOString(),
    });

    emitToUser(receiver.numericId, 'diamond.received', {
      transactionId,
      newBalance: Number(result.updatedReceiver.diamonds),
      amountCredited: validated.amount,
      senderUserId: sender.numericId,
      senderUsername: sender.username,
      timestamp: new Date().toISOString(),
    });

    // Admin Portal Realtime Live Activity Feed
    broadcastGlobal('admin.activity', {
      type: 'DIAMOND_TRANSFER',
      transactionId,
      senderId: sender.numericId,
      senderUsername: sender.username,
      receiverId: receiver.numericId,
      receiverUsername: receiver.username,
      amount: validated.amount,
      currency: 'DIAMOND',
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      data: {
        transactionId,
        senderNumericId: sender.numericId,
        receiverNumericId: receiver.numericId,
        amount: validated.amount,
        senderRemainingBalance: Number(result.updatedSender.diamonds),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Default Recharge Packages Seed Data
const DEFAULT_RECHARGE_PACKAGES = [
  { coins: 45000, coinsLabel: '45,000 Diamonds 💎', price: '$1.00', priceUsd: 1.0, bonus: 'Starter Rate', active: true, sortOrder: 1 },
  { coins: 225000, coinsLabel: '225,000 Diamonds 💎', price: '$5.00', priceUsd: 5.0, bonus: 'Popular 🔥', active: true, sortOrder: 2 },
  { coins: 1125000, coinsLabel: '1,125,000 Diamonds 💎', price: '$25.00', priceUsd: 25.0, bonus: 'Best Value 🌟', active: true, sortOrder: 3 },
  { coins: 2250000, coinsLabel: '2,250,000 Diamonds 💎', price: '$50.00', priceUsd: 50.0, bonus: 'VIP Tier 👑', active: true, sortOrder: 4 },
  { coins: 4500000, coinsLabel: '4,500,000 Diamonds 💎', price: '$100.00', priceUsd: 100.0, bonus: 'Royal Empire 💎', active: true, sortOrder: 5 },
];

// GET /api/v1/wallet/recharge-packages — Fetch active rate packages
walletRouter.get('/recharge-packages', async (req, res, next) => {
  try {
    let packages = await prisma.rechargePackage.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    if (packages.length === 0) {
      await prisma.rechargePackage.createMany({
        data: DEFAULT_RECHARGE_PACKAGES,
      });
      packages = await prisma.rechargePackage.findMany({
        orderBy: { sortOrder: 'asc' },
      });
    }

    res.status(200).json({
      success: true,
      data: packages,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/wallet/recharge-packages — Admin Update Rate Packages + Realtime Broadcast
walletRouter.put('/recharge-packages', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user || user.role !== 'ADMIN') {
      res.status(403).json({ success: false, error: 'Admin privileges required' });
      return;
    }

    const { packages } = req.body;
    if (!Array.isArray(packages)) {
      res.status(400).json({ success: false, error: 'Packages must be an array' });
      return;
    }

    // Replace packages in DB atomically
    await prisma.$transaction(async (tx) => {
      await tx.rechargePackage.deleteMany({});
      let index = 1;
      for (const p of packages) {
        await tx.rechargePackage.create({
          data: {
            coins: Number(p.coins),
            coinsLabel: p.coinsLabel || `${Number(p.coins).toLocaleString()} Diamonds 💎`,
            price: p.price,
            priceUsd: parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0.0,
            bonus: p.bonus || '',
            active: p.active ?? true,
            sortOrder: index++,
          },
        });
      }
    });

    const updatedPackages = await prisma.rechargePackage.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    // Real-Time Socket.IO Broadcast to all connected clients & mobile apps!
    broadcastGlobal('wallet.packages_updated', {
      packages: updatedPackages,
      timestamp: new Date().toISOString(),
      updatedBy: user.username,
    });

    res.status(200).json({
      success: true,
      message: 'Recharge rate packages updated and broadcasted in real-time!',
      data: updatedPackages,
    });
  } catch (error) {
    next(error);
  }
});
