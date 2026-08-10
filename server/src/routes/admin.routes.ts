import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';

export const adminRouter = Router();

// Master Admin Dashboard Live Telemetry
adminRouter.get('/dashboard', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const [totalUsers, activeRooms, totalResellers, totalTransactions] = await Promise.all([
      prisma.user.count(),
      prisma.liveRoom.count({ where: { status: 'LIVE' } }),
      prisma.resellerAccount.count({ where: { status: 'ACTIVE' } }),
      prisma.resellerLedger.count(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeRooms,
        totalResellers,
        totalTransactions,
        systemHealth: 'OPERATIONAL',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Admin User Directory with Search & Filters
adminRouter.get('/users', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        numericId: true,
        username: true,
        email: true,
        phone: true,
        avatar: true,
        level: true,
        vipTier: true,
        coins: true,
        diamonds: true,
        role: true,
        status: true,
        walletFrozen: true,
        country: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      data: users.map((u) => ({
        ...u,
        coins: Number(u.coins),
        diamonds: Number(u.diamonds),
      })),
    });
  } catch (error) {
    next(error);
  }
});

// Admin Wallet Freeze / Unfreeze Action
adminRouter.put('/users/:id/freeze-wallet', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id as string, 10);
    const { frozen } = req.body;


    const user = await prisma.user.update({
      where: { id: userId },
      data: { walletFrozen: Boolean(frozen) },
    });

    res.status(200).json({ success: true, data: { userId: user.id, walletFrozen: user.walletFrozen } });
  } catch (error) {
    next(error);
  }
});
