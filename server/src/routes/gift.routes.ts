import { Router, Request, Response } from 'express';
import { GiftService } from '../services/gift.service.js';
import { optionalAuthenticateToken } from '../middleware/auth.js';

export const giftRouter = Router();

/**
 * GET /api/v1/gifts/catalog
 * Get full categorized virtual gift catalog.
 */
giftRouter.get('/catalog', async (req: Request, res: Response) => {
  try {
    const catalog = await GiftService.getGiftCatalog();
    res.status(200).json(catalog);
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/v1/gifts/seed
 * Upsert all static gifts from VIRTUAL_GIFTS_CATALOG into the DB.
 * Safe to call multiple times (idempotent). No auth required for admin ease.
 */
giftRouter.post('/seed', async (_req: Request, res: Response) => {
  try {
    const seeded = await GiftService.seedGiftCatalog();
    res.status(200).json({
      success: true,
      message: `Seeded ${seeded.length} gifts into the database.`,
      giftIds: seeded,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/v1/gifts/send
 * Atomic send gift in live room or direct chat.
 */
giftRouter.post('/send', optionalAuthenticateToken, async (req: Request, res: Response) => {
  try {
    const authUserId = (req as any).user?.userId;
    const rawSender = req.body.senderUserId || req.body.senderNumericId || authUserId || req.headers['x-user-id'];
    const rawReceiver = req.body.receiverUserId || req.body.receiverNumericId || req.body.targetUserId;

    if (!rawSender || !rawReceiver) {
      res.status(400).json({ success: false, error: 'Sender and receiver user IDs are required.' });
      return;
    }

    const senderIdentifier = parseInt(String(rawSender), 10);
    const receiverIdentifier = parseInt(String(rawReceiver), 10);

    if (isNaN(senderIdentifier) || isNaN(receiverIdentifier) || senderIdentifier <= 0 || receiverIdentifier <= 0) {
      res.status(400).json({ success: false, error: 'Invalid sender or receiver user ID.' });
      return;
    }

    const { roomId, giftId, quantity, comboCount } = req.body;

    if (!giftId) {
      res.status(400).json({ success: false, error: 'giftId is required' });
      return;
    }

    const result = await GiftService.sendLiveGift({
      senderIdentifier,
      receiverIdentifier,
      roomId,
      giftId,
      quantity: quantity ? parseInt(quantity, 10) : 1,
      comboCount: comboCount ? parseInt(comboCount, 10) : 1,
    });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/v1/live/rooms/:roomId/gifts
 * Live room specific gift endpoint alias.
 */
giftRouter.post('/rooms/:roomId/gifts', optionalAuthenticateToken, async (req: Request, res: Response) => {
  try {
    const authUserId = (req as any).user?.userId;
    const rawSender = req.body.senderUserId || req.body.senderNumericId || authUserId || req.headers['x-user-id'];
    const rawReceiver = req.body.receiverUserId || req.body.receiverNumericId || req.body.targetUserId || req.body.hostId;

    if (!rawSender || !rawReceiver) {
      res.status(400).json({ success: false, error: 'Sender and receiver user IDs are required.' });
      return;
    }

    const senderIdentifier = parseInt(String(rawSender), 10);
    const receiverIdentifier = parseInt(String(rawReceiver), 10);

    if (isNaN(senderIdentifier) || isNaN(receiverIdentifier) || senderIdentifier <= 0 || receiverIdentifier <= 0) {
      res.status(400).json({ success: false, error: 'Invalid sender or receiver user ID.' });
      return;
    }

    const { giftId, quantity, comboCount } = req.body;
    const roomId = req.params.roomId as string;

    if (!giftId) {
      res.status(400).json({ success: false, error: 'giftId is required' });
      return;
    }

    const result = await GiftService.sendLiveGift({
      senderIdentifier,
      receiverIdentifier,
      roomId,
      giftId,
      quantity: quantity ? parseInt(quantity, 10) : 1,
      comboCount: comboCount ? parseInt(comboCount, 10) : 1,
    });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/v1/gifts/diamonds/send & POST /api/v1/live/rooms/:roomId/diamonds/send
 * Transfer raw diamonds from sender to receiver.
 */
giftRouter.post(['/diamonds/send', '/rooms/:roomId/diamonds/send'], optionalAuthenticateToken, async (req: Request, res: Response) => {
  try {
    const authUserId = (req as any).user?.userId;
    const rawSender = req.body.senderUserId || req.body.senderNumericId || authUserId || req.headers['x-user-id'];
    const rawReceiver = req.body.receiverUserId || req.body.receiverNumericId || req.body.targetUserId || req.body.hostId;

    if (!rawSender || !rawReceiver) {
      res.status(400).json({ success: false, error: 'Sender and receiver user IDs are required.' });
      return;
    }

    const senderIdentifier = parseInt(String(rawSender), 10);
    const receiverIdentifier = parseInt(String(rawReceiver), 10);

    if (isNaN(senderIdentifier) || isNaN(receiverIdentifier) || senderIdentifier <= 0 || receiverIdentifier <= 0) {
      res.status(400).json({ success: false, error: 'Invalid sender or receiver user ID.' });
      return;
    }

    const amount = parseInt(String(req.body.amount || req.body.diamonds || 10), 10);
    const roomId = (req.params.roomId || req.body.roomId) as string | undefined;
    const idempotencyKey = req.body.idempotencyKey as string | undefined;

    const result = await GiftService.sendLiveDiamonds({
      senderIdentifier,
      receiverIdentifier,
      roomId,
      amount,
      idempotencyKey,
      notes: req.body.notes,
    });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

