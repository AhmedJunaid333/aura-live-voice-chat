import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { StoreService } from '../services/store.service.js';

export const storeRouter = Router();

// Get VIP Tiers Configuration
storeRouter.get('/vip-tiers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tiers = await StoreService.getVipTiers();
    res.status(200).json({ success: true, data: tiers });
  } catch (error) {
    next(error);
  }
});

// Update VIP Tier Configuration (Admin)
storeRouter.put('/vip-tiers/:level', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const level = parseInt(String(req.params.level), 10);
    const updated = await StoreService.updateVipTier(level, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// Get Store Items
storeRouter.get('/items', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = req.query.category ? String(req.query.category) : undefined;
    const items = await StoreService.getStoreItems(category);
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
});

// Create Store Item (Admin)
storeRouter.post('/items', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const item = await StoreService.createStoreItem(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
});

// Update Store Item (Admin)
storeRouter.put('/items/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updated = await StoreService.updateStoreItem(String(req.params.id), req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// Delete Store Item (Admin)
storeRouter.delete('/items/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await StoreService.deleteStoreItem(String(req.params.id));
    res.status(200).json({ success: true, message: 'Store item deleted.' });
  } catch (error) {
    next(error);
  }
});
