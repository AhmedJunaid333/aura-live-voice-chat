import { Router, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { BdService } from '../services/bd.service.js';

export const bdRouter = Router();

/**
 * Middleware: Verify user is authenticated and has BD permissions
 */
const requireBdAuth = (req: AuthenticatedRequest, res: Response, next: Function) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ success: false, error: 'Authentication required.' });
    return;
  }
  next();
};

/**
 * GET /api/v1/bd/dashboard
 */
bdRouter.get('/dashboard', authenticateToken, requireBdAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const data = await BdService.getBdDashboard(userId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(403).json({ success: false, error: error.message || 'Failed to fetch BD dashboard.' });
  }
});

/**
 * GET /api/v1/bd/agencies
 */
bdRouter.get('/agencies', authenticateToken, requireBdAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const data = await BdService.getBdAgencies(userId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(403).json({ success: false, error: error.message || 'Failed to fetch assigned agencies.' });
  }
});

/**
 * GET /api/v1/bd/hosts
 */
bdRouter.get('/hosts', authenticateToken, requireBdAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const data = await BdService.getBdHosts(userId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(403).json({ success: false, error: error.message || 'Failed to fetch assigned hosts.' });
  }
});

/**
 * GET /api/v1/bd/applications
 */
bdRouter.get('/applications', authenticateToken, requireBdAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { type } = req.query;
    const data = await BdService.getBdApplications(userId, type as string);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(403).json({ success: false, error: error.message || 'Failed to fetch assigned applications.' });
  }
});

/**
 * POST /api/v1/bd/applications/:id/review
 */
bdRouter.post('/applications/:id/review', authenticateToken, requireBdAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const applicationId = req.params.id as string;
    const { recommendation, notes } = req.body;

    if (!recommendation || !['RECOMMEND_APPROVE', 'RECOMMEND_REJECT', 'REQUEST_INFO'].includes(recommendation)) {
      res.status(400).json({ success: false, error: 'Valid recommendation (RECOMMEND_APPROVE, RECOMMEND_REJECT, REQUEST_INFO) is required.' });
      return;
    }

    if (!notes || notes.trim().length === 0) {
      res.status(400).json({ success: false, error: 'Review notes are required.' });
      return;
    }

    const data = await BdService.submitBdReview(userId, applicationId, recommendation, notes);
    res.status(200).json({
      success: true,
      message: 'BD review and recommendation submitted successfully. Admin will review for final decision.',
      data,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to submit BD review.' });
  }
});

/**
 * GET /api/v1/bd/performance
 */
bdRouter.get('/performance', authenticateToken, requireBdAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const data = await BdService.getBdPerformance(userId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(403).json({ success: false, error: error.message || 'Failed to fetch BD performance.' });
  }
});

/**
 * GET /api/v1/bd/commission
 */
bdRouter.get('/commission', authenticateToken, requireBdAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const data = await BdService.getBdCommission(userId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(403).json({ success: false, error: error.message || 'Failed to fetch BD commission.' });
  }
});
