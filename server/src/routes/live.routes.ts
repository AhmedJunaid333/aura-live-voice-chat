import { Router } from 'express';
import { LiveService } from '../services/live.service.js';
import { createLiveRoomSchema } from '../utils/validators.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { prisma } from '../config/database.js';

export const liveRouter = Router();

// Get Active Live Rooms Feed
liveRouter.get('/rooms', async (req, res, next) => {
  try {
    const rooms = await prisma.liveRoom.findMany({
      where: { status: 'LIVE' },
      include: {
        host: {
          select: { id: true, numericId: true, username: true, avatar: true, level: true, vipTier: true },
        },
      },
      orderBy: { listenersCount: 'desc' },
      take: 50,
    });
    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    next(error);
  }
});

// Create Live Room & Generate Agora Host Token
liveRouter.post('/rooms', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = createLiveRoomSchema.parse(req.body);
    const result = await LiveService.createRoom({
      hostUserId: req.user!.userId,
      title: validated.title,
      category: validated.category,
      seatCount: validated.seatCount,
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Join Live Room & Generate Agora Audience Token
liveRouter.post('/rooms/:roomId/join', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await LiveService.joinRoom(req.params.roomId as string, req.user!.numericId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Send Gift in Live Room
liveRouter.post('/rooms/:roomId/gift', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { receiverUserId, giftId, count } = req.body;
    const result = await LiveService.sendGiftInRoom({
      roomId: req.params.roomId as string,
      senderUserId: req.user!.userId,
      receiverUserId,
      giftId,
      count: count || 1,
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Direct Dynamic Agora RTC Token Generation
liveRouter.post('/token', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { channelName, role } = req.body;
    if (!channelName) {
      res.status(400).json({ success: false, error: 'channelName is required' });
      return;
    }

    const agoraRole = role === 'publisher' ? 'publisher' : 'subscriber';
    const token = LiveService.generateTokenForChannel(channelName, req.user!.numericId, agoraRole);

    res.status(200).json({
      success: true,
      data: {
        token,
        channelName,
        uid: req.user!.numericId,
        role: agoraRole,
        expiresInSeconds: 86400,
      },
    });
  } catch (error) {
    next(error);
  }
});

