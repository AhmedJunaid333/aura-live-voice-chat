import { Router, Response, NextFunction } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { MembershipService } from '../services/membership.service.js';
import { prisma } from '../config/database.js';

export const membershipRouter = Router();

// ─── 1. Get All Active VIP 1–7 and SVIP 1–15 Tiers ───
membershipRouter.get('/tiers', async (_req, res: Response, next: NextFunction) => {
  try {
    const vipTiers = await MembershipService.getVipTiers();
    const svipTiers = await MembershipService.getSvipTiers();
    res.status(200).json({
      success: true,
      data: {
        vipTiers,
        svipTiers,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── 2. Get Current User Membership State ───
membershipRouter.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const state = await MembershipService.getUserMembershipState(userId);
    res.status(200).json({
      success: true,
      data: state,
    });
  } catch (error) {
    next(error);
  }
});

// ─── 3. Get Active User Cascading Benefits ───
membershipRouter.get('/benefits', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const benefits = await MembershipService.getActiveBenefits(userId);
    res.status(200).json({
      success: true,
      data: benefits,
    });
  } catch (error) {
    next(error);
  }
});

// ─── 4. Claim Level-Up / Daily / Weekly / Monthly Reward ───
membershipRouter.post('/claim-reward', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { membershipType = 'VIP', level, rewardType, periodKey } = req.body;

    if (!level || !rewardType) {
      res.status(400).json({ success: false, message: 'Level and rewardType are required.' });
      return;
    }

    const result = await MembershipService.claimReward({
      userId,
      membershipType,
      level: Number(level),
      rewardType,
      periodKey,
    });

    res.status(200).json({
      success: true,
      message: `${membershipType} Level ${level} ${rewardType} reward claimed!`,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to claim reward',
    });
  }
});

// ─── 5. Renew Membership Duration ───
membershipRouter.post('/renew', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { membershipType = 'VIP', days = 30 } = req.body;

    const result = await MembershipService.renewMembership(userId, membershipType, days);
    res.status(200).json({
      success: true,
      message: `${membershipType} renewed for ${days} days!`,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to renew membership',
    });
  }
});

// ─── 5.1 Direct Purchase / Activate VIP Tier ───
membershipRouter.post('/purchase', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { level, durationDays = 30 } = req.body;

    const result = await MembershipService.purchaseVipTier(userId, Number(level), Number(durationDays));
    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to purchase VIP tier',
    });
  }
});

// ─── 6. User Membership History ───
membershipRouter.get('/history', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const history = await prisma.membershipHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const claims = await prisma.membershipRewardClaim.findMany({
      where: { userId },
      orderBy: { claimedAt: 'desc' },
      take: 50,
    });

    res.status(200).json({
      success: true,
      data: {
        history,
        claims,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── 7. Give VIP (Gift to Friend) ───
membershipRouter.post('/give', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const senderId = req.user?.userId;
    if (!senderId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { recipientId, targetLevel, durationDays = 30 } = req.body;

    if (!recipientId || !targetLevel) {
      res.status(400).json({ success: false, message: 'recipientId and targetLevel are required.' });
      return;
    }

    const result = await MembershipService.giveVipTier({
      senderId,
      recipientId: Number(recipientId),
      targetLevel: Number(targetLevel),
      durationDays: Number(durationDays),
    });

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to gift VIP tier',
    });
  }
});

// ─── 8. Get VIP Tasks ───
membershipRouter.get('/tasks', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const tasks = await MembershipService.getVipTasks(userId);
    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
});

// ─── 9. Claim VIP Task Reward ───
membershipRouter.post('/claim-task', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { taskId } = req.body;
    if (!taskId) {
      res.status(400).json({ success: false, message: 'taskId is required.' });
      return;
    }

    const result = await MembershipService.claimVipTask(userId, taskId);
    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to claim task',
    });
  }
});

// ─── 10. Get VIP Leaderboard / Ranking ───
membershipRouter.get('/ranking', async (req, res: Response, next: NextFunction) => {
  try {
    const { type = 'VIP', timeframe = 'all' } = req.query;
    const ranking = await MembershipService.getVipLeaderboard(
      type === 'SVIP' ? 'SVIP' : 'VIP',
      (timeframe as any) || 'all'
    );
    res.status(200).json({
      success: true,
      data: ranking,
    });
  } catch (error) {
    next(error);
  }
});

