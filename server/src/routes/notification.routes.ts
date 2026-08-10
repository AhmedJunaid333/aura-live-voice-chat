import { Router } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { NotificationService } from '../services/notification.service.js';

export const notificationRouter = Router();

// Get authenticated user notifications
notificationRouter.get('/', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);

    const result = await NotificationService.getUserNotifications(req.user!.userId, page, limit);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

// Get unread notification count
notificationRouter.get('/unread-count', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await NotificationService.getUnreadCount(req.user!.userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Mark single notification as read
notificationRouter.patch('/:id/read', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await NotificationService.markAsRead(String(req.params.id), req.user!.userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Mark all notifications as read
notificationRouter.patch('/read-all', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await NotificationService.markAllAsRead(req.user!.userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});
