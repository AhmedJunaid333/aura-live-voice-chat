import { Router, Request, Response } from 'express';
import { FrameService } from '../services/frame.service.js';
import { authenticateToken, optionalAuthenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';

const router = Router();

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC & USER CATALOG ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/v1/frames
 * Browse catalog of avatar frames with filtering, search, pagination.
 */
router.get('/', optionalAuthenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      status,
      rarity,
      search,
      country,
      vipTier,
      userLevel,
      isFeatured,
      page,
      limit,
    } = req.query;

    const result = await FrameService.getFrameCatalog({
      category: category as string,
      status: (status as string) || 'ACTIVE',
      rarity: rarity as string,
      search: search as string,
      country: country as string,
      vipTier: vipTier ? parseInt(vipTier as string, 10) : undefined,
      userLevel: userLevel ? parseInt(userLevel as string, 10) : undefined,
      isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 20,
    });

    res.status(200).json({
      success: true,
      data: result.frames,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/v1/frames/categories
 * Get list of available categories and frame counts.
 */
router.get('/categories', async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await FrameService.getCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/v1/frames/user/:identifier/equipped
 * Get equipped frame for specific user (by numericId or userId).
 */
router.get('/user/:identifier/equipped', async (req: Request, res: Response): Promise<void> => {
  try {
    const identifier = parseInt(req.params.identifier as string, 10);
    if (isNaN(identifier)) {
      res.status(400).json({ success: false, error: 'Invalid user identifier' });
      return;
    }

    const frame = await FrameService.getEquippedFrameForUser(identifier);
    res.status(200).json({ success: true, data: frame });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/v1/frames/:id
 * Get single avatar frame details.
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const frameId = req.params.id as string;
    const frame = await FrameService.getFrameById(frameId);
    res.status(200).json({ success: true, data: frame });
  } catch (error: any) {
    res.status(404).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// USER INVENTORY, PURCHASE & EQUIP ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/v1/frames/inventory/me (or /api/v1/users/me/frames)
 * Fetch authenticated user's owned avatar frame inventory.
 */
router.get('/inventory/me', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const inventory = await FrameService.getUserInventory(userId);
    res.status(200).json({ success: true, data: inventory });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/v1/frames/:id/purchase
 * Purchase an avatar frame using Diamonds or Coins.
 */
router.post('/:id/purchase', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const frameId = req.params.id as string;
    const idempotencyKey = (req.body.idempotencyKey || req.headers['x-idempotency-key']) as string | undefined;

    const result = await FrameService.purchaseFrame(userId, frameId, idempotencyKey);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/v1/frames/:id/equip
 * Equip an avatar frame from owned inventory.
 */
router.post('/:id/equip', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const frameIdOrOwnershipId = req.params.id as string;

    const result = await FrameService.equipFrame(userId, frameIdOrOwnershipId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/v1/frames/unequip
 * Unequip active avatar frame.
 */
router.post('/unequip/me', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const result = await FrameService.unequipFrame(userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN MANAGEMENT ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/v1/admin/frames/analytics
 * Get frame sales and usage analytics.
 */
router.get('/admin/analytics', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const analytics = await FrameService.getFrameAnalytics();
    res.status(200).json({ success: true, data: analytics });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/v1/admin/frames/create
 * Admin creates new frame asset.
 */
router.post('/admin/create', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const frame = await FrameService.createFrame(req.body);
    res.status(201).json({ success: true, data: frame });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * PATCH /api/v1/admin/frames/:id
 * Admin updates frame asset.
 */
router.patch('/admin/:id', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const frameId = req.params.id as string;
    const frame = await FrameService.updateFrame(frameId, req.body);
    res.status(200).json({ success: true, data: frame });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/v1/admin/frames/:id
 * Admin archives frame asset.
 */
router.delete('/admin/:id', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const frameId = req.params.id as string;
    const frame = await FrameService.deleteFrame(frameId);
    res.status(200).json({ success: true, data: frame });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/v1/admin/frames/:id/grant
 * Admin grants frame to target user.
 */
router.post('/admin/:id/grant', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req as any).user.userId;
    const frameId = req.params.id as string;
    const { targetUserId, durationDays, reason } = req.body;

    if (!targetUserId) {
      res.status(400).json({ success: false, error: 'targetUserId is required' });
      return;
    }

    const result = await FrameService.grantFrameToUser(
      adminId,
      parseInt(targetUserId, 10),
      frameId,
      durationDays !== undefined ? parseInt(durationDays, 10) : undefined,
      reason
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/v1/admin/frames/:id/revoke
 * Admin revokes frame from target user.
 */
router.post('/admin/:id/revoke', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req as any).user.userId;
    const { targetUserId, ownershipId, reason } = req.body;

    if (!targetUserId || !ownershipId) {
      res.status(400).json({ success: false, error: 'targetUserId and ownershipId are required' });
      return;
    }

    const result = await FrameService.revokeFrameFromUser(
      adminId,
      parseInt(targetUserId, 10),
      ownershipId as string,
      reason
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export const frameRouter = router;
