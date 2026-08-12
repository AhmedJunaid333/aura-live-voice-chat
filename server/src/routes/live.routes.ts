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
      where: { status: { in: ['LIVE', 'LOCKED'] } },
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

// 🔒 Host Locks Room (Server-Enforced)
liveRouter.post('/rooms/:roomId/lock', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { lockMode, password } = req.body;
    const result = await LiveService.lockRoom(req.params.roomId as string, req.user!.userId, {
      lockMode,
      password,
    });
    res.status(200).json({
      success: true,
      message: 'Room locked successfully. New users cannot join without permission.',
      data: result,
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
});

// 🔓 Host Unlocks Room (Server-Enforced)
liveRouter.post('/rooms/:roomId/unlock', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await LiveService.unlockRoom(req.params.roomId as string, req.user!.userId);
    res.status(200).json({
      success: true,
      message: 'Room unlocked successfully. New users can join freely.',
      data: result,
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
});

// Join Live Room & Generate Agora Audience Token (Enforces Room Lock)
liveRouter.post('/rooms/:roomId/join', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await LiveService.joinRoom(
      req.params.roomId as string,
      req.user!.numericId,
      req.user!.userId,
    );
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    if (error.code === 'ROOM_LOCKED') {
      res.status(403).json({
        success: false,
        error: 'ROOM_LOCKED',
        message: error.message,
        data: error.data,
      });
      return;
    }
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
});

// 🙋 Audience Requests to Join Locked Room
liveRouter.post('/rooms/:roomId/join-request', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });

    const result = await LiveService.createJoinRequest({
      roomId: req.params.roomId as string,
      userId: req.user!.userId,
      userNumericId: req.user!.numericId,
      userName: currentUser?.username || `User_${req.user!.numericId}`,
      userAvatar: currentUser?.avatar,
    });

    res.status(201).json({
      success: true,
      message: 'Join request dispatched to Room Host. Please wait for host approval.',
      data: result,
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
});

// 👑 Host Responds to Join Request (Accept / Reject)
liveRouter.post('/rooms/:roomId/join-request/:requestId/respond', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { status } = req.body;
    if (!status || !['ACCEPTED', 'REJECTED'].includes(status)) {
      res.status(400).json({ success: false, error: 'Status must be ACCEPTED or REJECTED' });
      return;
    }

    const result = await LiveService.respondJoinRequest({
      roomId: req.params.roomId as string,
      hostUserId: req.user!.userId,
      requestId: req.params.requestId as string,
      status,
    });

    res.status(200).json({
      success: true,
      message: `Join request has been ${status.toLowerCase()} successfully.`,
      data: result,
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
});

// 👑 Host Fetches Pending Join Requests
liveRouter.get('/rooms/:roomId/join-requests', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await LiveService.getPendingJoinRequests(req.params.roomId as string, req.user!.userId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
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
