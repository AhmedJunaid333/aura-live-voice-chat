import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { FollowService } from '../services/follow.service.js';

export const followRouter = Router();

// Follow a user
followRouter.post('/:numericId/follow', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const targetNumericId = parseInt(String(req.params.numericId), 10);
    const result = await FollowService.followUser(req.user!.userId, targetNumericId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Unfollow a user
followRouter.delete('/:numericId/follow', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const targetNumericId = parseInt(String(req.params.numericId), 10);
    const result = await FollowService.unfollowUser(req.user!.userId, targetNumericId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Get Followers list
followRouter.get('/:numericId/followers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const numericId = parseInt(String(req.params.numericId), 10);
    const page = parseInt(String(req.query.page || '1'), 10);
    const limit = parseInt(String(req.query.limit || '20'), 10);
    const currentUserId = (req as any).user?.userId;

    const result = await FollowService.getFollowers(numericId, currentUserId, page, limit);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

// Get Following list
followRouter.get('/:numericId/following', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const numericId = parseInt(String(req.params.numericId), 10);
    const page = parseInt(String(req.query.page || '1'), 10);
    const limit = parseInt(String(req.query.limit || '20'), 10);
    const currentUserId = (req as any).user?.userId;

    const result = await FollowService.getFollowing(numericId, currentUserId, page, limit);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

// Get Fans list
followRouter.get('/:numericId/fans', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const numericId = parseInt(String(req.params.numericId), 10);
    const page = parseInt(String(req.query.page || '1'), 10);
    const limit = parseInt(String(req.query.limit || '20'), 10);
    const currentUserId = (req as any).user?.userId;

    const result = await FollowService.getFans(numericId, currentUserId, page, limit);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

// Get profile relationship counts & status
followRouter.get('/:numericId/counts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const numericId = parseInt(String(req.params.numericId), 10);
    const currentUserId = (req as any).user?.userId;

    const result = await FollowService.getProfileRelationshipCounts(numericId, currentUserId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});
