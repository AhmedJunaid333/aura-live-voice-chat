import { Router } from 'express';
import { LiveService } from '../services/live.service.js';
import { createLiveRoomSchema } from '../utils/validators.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { prisma } from '../config/database.js';
import { generateAgoraRtcToken, RtcRole } from '../utils/agoraToken.js';

export const liveRouter = Router();

// 🌍 Get Active Live Rooms Feed (Global & Country Discovery with Realtime Ranking)
liveRouter.get('/rooms', async (req, res, next) => {
  try {
    const rooms = await LiveService.getLiveRooms({
      countryCode: req.query.countryCode as string,
      category: req.query.category as string,
      search: req.query.search as string,
      status: req.query.status as string,
      sort: req.query.sort as string,
    });
    res.status(200).json({ success: true, data: rooms, total: rooms.length });
  } catch (error) {
    next(error);
  }
});

// 🌍 Get Global Live Countries Stats (Live counts per country)
liveRouter.get('/rooms/countries', async (req, res, next) => {
  try {
    const stats = await LiveService.getLiveCountriesStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

// Create Live Room & Generate Agora Host Token
liveRouter.post('/rooms', async (req, res, next) => {
  try {
    let resolvedUserId: number = 1;

    // 1. Try JWT Bearer Token if present
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (token) {
      const payload = (await import('../utils/jwt.js')).verifyAccessToken(token);
      if (payload?.userId) {
        resolvedUserId = payload.userId;
      }
    }

    // 2. Fallback to hostUserId / hostNumericId from request body or header
    if (!token && (req.body.hostUserId || req.body.hostNumericId)) {
      resolvedUserId = Number(req.body.hostUserId || req.body.hostNumericId);
    } else if (!token && req.headers['x-user-id']) {
      resolvedUserId = Number(req.headers['x-user-id']);
    }

    const validated = createLiveRoomSchema.parse(req.body);
    const result = await LiveService.createRoom({
      hostUserId: resolvedUserId,
      title: validated.title,
      category: validated.category,
      seatCount: validated.seatCount,
      countryCode: (req.body.countryCode as string) || undefined,
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// 🛑 Host Ends Broadcast (Server-Enforced Lifecycle)
liveRouter.post('/rooms/:roomId/end', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await LiveService.endRoom(req.params.roomId as string, req.user!.userId);
    res.status(200).json({
      success: true,
      message: 'Broadcast ended successfully.',
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

// 👁️ Record Viewer Presence Join
liveRouter.post('/rooms/:roomId/viewer-join', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await LiveService.recordViewerJoin(
      req.params.roomId as string,
      req.user!.userId,
      req.body.socketId as string,
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// 👁️ Record Viewer Presence Leave
liveRouter.post('/rooms/:roomId/viewer-leave', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await LiveService.recordViewerLeave(
      req.params.roomId as string,
      req.user!.userId,
    );
    res.status(200).json({ success: true, data: result });
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

    const agoraRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    const agoraConfig = generateAgoraRtcToken(channelName, req.user!.numericId, agoraRole);

    res.status(200).json({
      success: true,
      data: {
        token: agoraConfig.token,
        channelName,
        uid: req.user!.numericId,
        role: role === 'publisher' ? 'publisher' : 'subscriber',
        expiresInSeconds: 86400,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update Room Settings
liveRouter.patch('/rooms/:roomId/settings', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await LiveService.updateRoomSettings(
      req.user!.userId,
      req.params.roomId as string,
      req.body
    );
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
});

// Get Room Admins
liveRouter.get('/rooms/:roomId/admins', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const admins = await LiveService.getRoomAdmins(req.params.roomId as string);
    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    next(error);
  }
});

// Add Room Admin
liveRouter.post('/rooms/:roomId/admins', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await LiveService.addRoomAdmin(
      req.user!.userId,
      req.params.roomId as string,
      req.body
    );
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
});

// Remove Room Admin
liveRouter.delete('/rooms/:roomId/admins/:targetUserId', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await LiveService.removeRoomAdmin(
      req.user!.userId,
      req.params.roomId as string,
      Number(req.params.targetUserId)
    );
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
});

// ==========================================
// 🎙️ SEAT GRID SYSTEM REST ENDPOINTS
// ==========================================

// Get All Real Seats for Room
liveRouter.get('/rooms/:roomId/seats', async (req, res, next) => {
  try {
    const result = await LiveService.getRoomSeats(req.params.roomId as string);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
});

// Take a Seat (Atomic DB Claim)
liveRouter.post('/rooms/:roomId/seats/:seatNumber/take', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const seatNumber = parseInt(req.params.seatNumber as string, 10);
    const result = await LiveService.takeSeat(
      req.params.roomId as string,
      seatNumber,
      req.user!.userId
    );
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
});

// Leave a Seat
liveRouter.post('/rooms/:roomId/seats/:seatNumber/leave', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const seatNumber = parseInt(req.params.seatNumber as string, 10);
    const result = await LiveService.leaveSeat(
      req.params.roomId as string,
      seatNumber,
      req.user!.userId
    );
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
});

// Mute / Unmute Seat Mic
liveRouter.patch('/rooms/:roomId/seats/:seatNumber/mute', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const seatNumber = parseInt(req.params.seatNumber as string, 10);
    const { isMuted } = req.body;
    const result = await LiveService.muteSeat(
      req.params.roomId as string,
      seatNumber,
      req.user!.userId,
      Boolean(isMuted)
    );
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
});

// Lock / Unlock Seat
liveRouter.patch('/rooms/:roomId/seats/:seatNumber/lock', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const seatNumber = parseInt(req.params.seatNumber as string, 10);
    const { isLocked } = req.body;
    const result = await LiveService.lockSeat(
      req.params.roomId as string,
      seatNumber,
      req.user!.userId,
      Boolean(isLocked)
    );
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
});

// Kick Speaker off Seat
liveRouter.post('/rooms/:roomId/seats/:seatNumber/kick', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const seatNumber = parseInt(req.params.seatNumber as string, 10);
    const result = await LiveService.kickSeat(
      req.params.roomId as string,
      seatNumber,
      req.user!.userId
    );
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
});

// Change Seat Capacity (Strictly 10, 15, or 20)
liveRouter.patch('/rooms/:roomId/seat-capacity', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { seatCount } = req.body;
    const result = await LiveService.changeSeatCapacity(
      req.params.roomId as string,
      parseInt(seatCount, 10),
      req.user!.userId
    );
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
});

