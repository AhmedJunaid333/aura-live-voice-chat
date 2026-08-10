import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { VisitorService } from '../services/visitor.service.js';

export const visitorRouter = Router();

// Record a profile visit
visitorRouter.post('/:numericId/visit', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const targetNumericId = parseInt(String(req.params.numericId), 10);
    const result = await VisitorService.recordVisit(req.user!.userId, targetNumericId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Get profile visitors list
visitorRouter.get('/:numericId/visitors', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const numericId = parseInt(String(req.params.numericId), 10);
    const page = parseInt(String(req.query.page || '1'), 10);
    const limit = parseInt(String(req.query.limit || '20'), 10);
    const currentUserId = (req as any).user?.userId;

    const result = await VisitorService.getVisitors(numericId, currentUserId, page, limit);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});
