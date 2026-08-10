import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';
import { emitToUser, getIO } from '../websocket/socketServer.js';

export const adminRouter = Router();

// 1. Master Admin Dashboard Live Telemetry
adminRouter.get('/dashboard', async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeRooms,
      totalResellers,
      pendingResellerApps,
      totalWithdrawals,
      pendingReports,
      userMetrics,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.liveRoom.count({ where: { status: 'LIVE' } }),
      prisma.resellerAccount.count({ where: { status: 'ACTIVE' } }),
      prisma.resellerApplication.count({ where: { status: 'SUBMITTED' } }),
      prisma.withdrawalRequest.count(),
      prisma.messageReport.count({ where: { status: 'PENDING' } }),
      prisma.user.aggregate({
        _sum: { coins: true, diamonds: true },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeRooms,
        totalResellers,
        pendingResellerApps,
        totalWithdrawals,
        pendingReports,
        totalCoins: userMetrics._sum.coins || 0,
        totalDiamonds: userMetrics._sum.diamonds || 0,
        systemHealth: 'OPERATIONAL',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// 2. Admin User Directory with Search & Filters
adminRouter.get('/users', async (req, res, next) => {
  try {
    const query = (req.query.query as string || '').trim().toLowerCase();
    const status = (req.query.status as string || 'ALL').toUpperCase();
    const role = (req.query.role as string || 'ALL').toUpperCase();

    const where: any = {};
    if (status !== 'ALL') where.status = status;
    if (role !== 'ALL') where.role = role;

    if (query) {
      const isNumeric = !isNaN(Number(query));
      where.OR = [
        { username: { contains: query } },
        { email: { contains: query } },
        { phone: { contains: query } },
        ifIsNumeric(isNumeric, Number(query)),
      ].filter(Boolean);
    }

    const users = await prisma.user.findMany({
      where,
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
        countryCode: true,
        bio: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
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

function ifIsNumeric(condition: boolean, val: number) {
  return condition ? { numericId: val } : null;
}

// 3. Admin User Details Dossier
adminRouter.get('/users/:id', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id as string, 10);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        resellerAccount: true,
        applications: { take: 5, orderBy: { submittedAt: 'desc' } },
        following: { take: 5 },
        followers: { take: 5 },
        walletTransactions: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const [followingCount, followersCount, visitsReceivedCount] = await Promise.all([
      prisma.follow.count({ where: { followerId: userId } }),
      prisma.follow.count({ where: { followingId: userId } }),
      prisma.profileVisit.count({ where: { profileOwnerId: userId } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...user,
        followingCount,
        followersCount,
        fansCount: followersCount,
        visitorsCount: visitsReceivedCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

// 4. Update User Account Status (ACTIVE, SUSPENDED, BANNED)
adminRouter.put('/users/:id/status', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = parseInt(req.params.id as string, 10);
    const { status, reason } = req.body;
    const adminId = req.user!.userId;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { status },
    });

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: adminId,
        actorRole: 'ADMIN',
        action: 'UPDATE_USER_STATUS',
        resource: `User:${user.numericId}`,
        details: `Updated status of ${user.username} to ${status}. Reason: ${reason || 'Admin action.'}`,
      },
    });

    // Realtime Socket Notification to User
    emitToUser(user.numericId, 'account.status_updated', {
      status: user.status,
      reason: reason || 'Account status updated by administrator.',
    });

    res.status(200).json({ success: true, data: { userId: user.id, status: user.status } });
  } catch (error) {
    next(error);
  }
});

// 5. Update User Role (USER, ADMIN, RESELLER, COIN_SELLER)
adminRouter.put('/users/:id/role', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = parseInt(req.params.id as string, 10);
    const { role } = req.body;
    const adminId = req.user!.userId;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: adminId,
        actorRole: 'ADMIN',
        action: 'UPDATE_USER_ROLE',
        resource: `User:${user.numericId}`,
        details: `Updated role of ${user.username} to ${role}.`,
      },
    });

    res.status(200).json({ success: true, data: { userId: user.id, role: user.role } });
  } catch (error) {
    next(error);
  }
});

// 6. Admin Wallet Currency Credit / Debit Action
adminRouter.post('/users/:id/credit', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = parseInt(req.params.id as string, 10);
    const { amount, type } = req.body; // type = 'coins' | 'diamonds'
    const adminId = req.user!.userId;

    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount === 0) {
      res.status(400).json({ success: false, error: 'Valid non-zero amount required.' });
      return;
    }

    const field = type === 'diamonds' ? 'diamonds' : 'coins';

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        [field]: { increment: numAmount },
      },
    });

    // Create Wallet Transaction Record
    await prisma.walletTransaction.create({
      data: {
        userId,
        type: numAmount > 0 ? 'ADMIN_CREDIT' : 'ADMIN_DEBIT',
        amount: Math.abs(numAmount),
        currency: field.toUpperCase(),
        balanceAfter: updatedUser[field],
        notes: `Admin manual wallet ${numAmount > 0 ? 'credit' : 'debit'} of ${Math.abs(numAmount)} ${field}.`,
      },
    });

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: adminId,
        actorRole: 'ADMIN',
        action: 'CREDIT_USER_WALLET',
        resource: `User:${updatedUser.numericId}`,
        details: `Adjusted ${field} for ${updatedUser.username} by ${numAmount}. New Balance: ${updatedUser[field]}`,
      },
    });

    // Emit Realtime Event to User & Admin
    emitToUser(updatedUser.numericId, 'wallet.updated', {
      coins: updatedUser.coins,
      diamonds: updatedUser.diamonds,
    });

    res.status(200).json({
      success: true,
      data: {
        userId: updatedUser.id,
        coins: updatedUser.coins,
        diamonds: updatedUser.diamonds,
      },
    });
  } catch (error) {
    next(error);
  }
});

// 7. Admin Wallet Freeze / Unfreeze Action
adminRouter.put('/users/:id/freeze-wallet', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = parseInt(req.params.id as string, 10);
    const { frozen } = req.body;
    const adminId = req.user!.userId;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { walletFrozen: Boolean(frozen) },
    });

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: adminId,
        actorRole: 'ADMIN',
        action: 'FREEZE_USER_WALLET',
        resource: `User:${user.numericId}`,
        details: `${frozen ? 'Froze' : 'Unfroze'} wallet for user ${user.username}.`,
      },
    });

    res.status(200).json({ success: true, data: { userId: user.id, walletFrozen: user.walletFrozen } });
  } catch (error) {
    next(error);
  }
});

// 8. Admin Audit Logs List
adminRouter.get('/audit-logs', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: { select: { id: true, numericId: true, username: true, role: true } },
      },
    });

    res.status(200).json({
      success: true,
      data: logs.map((l) => ({
        id: l.id,
        actorName: l.actor?.username || 'SYSTEM',
        actorRole: l.actorRole,
        action: l.action,
        resource: l.resource,
        details: l.details,
        ipAddress: l.ipAddress,
        createdAt: l.createdAt.toISOString(),
      })),
    });
    });
  } catch (error) {
    next(error);
  }
});

// 9. Update User Profile & Credentials (Username, Password, Bio, Role, Level, VIP)
adminRouter.put('/users/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = parseInt(req.params.id as string, 10);
    const { username, password, bio, gender, country, role, level, vipTier } = req.body;
    const adminId = req.user!.userId;

    const dataToUpdate: any = {};
    if (username !== undefined) dataToUpdate.username = username;
    if (bio !== undefined) dataToUpdate.bio = bio;
    if (gender !== undefined) dataToUpdate.gender = gender;
    if (country !== undefined) dataToUpdate.country = country;
    if (role !== undefined) dataToUpdate.role = role;
    if (level !== undefined) dataToUpdate.level = parseInt(level, 10);
    if (vipTier !== undefined) dataToUpdate.vipTier = parseInt(vipTier, 10);

    if (password && password.trim().length > 0) {
      const bcrypt = (await import('bcryptjs')).default;
      dataToUpdate.passwordHash = await bcrypt.hash(password.trim(), 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    await prisma.auditLog.create({
      data: {
        actorId: adminId,
        actorRole: 'ADMIN',
        action: 'UPDATE_USER_PROFILE_CREDENTIALS',
        resource: `User:${updatedUser.numericId}`,
        details: `Updated profile/credentials for @${updatedUser.username}. Password reset: ${password ? 'YES' : 'NO'}.`,
      },
    });

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
});

// 10. Delete User Account
adminRouter.delete('/users/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = parseInt(req.params.id as string, 10);
    const adminId = req.user!.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    await prisma.user.delete({ where: { id: userId } });

    await prisma.auditLog.create({
      data: {
        actorId: adminId,
        actorRole: 'ADMIN',
        action: 'DELETE_USER_ACCOUNT',
        resource: `User:${user.numericId}`,
        details: `Deleted user account @${user.username} (UID: ${user.numericId}).`,
      },
    });

    res.status(200).json({ success: true, message: `User @${user.username} deleted successfully` });
  } catch (error) {
    next(error);
  }
});

