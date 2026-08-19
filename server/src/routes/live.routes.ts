import { Router, Request, Response } from 'express';
import { LiveService } from '../services/live.service.js';
import { createLiveRoomSchema } from '../utils/validators.js';
import { authenticateToken, optionalAuthenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { prisma } from '../config/database.js';
import { generateAgoraRtcToken, RtcRole } from '../utils/agoraToken.js';

export const liveRouter = Router();

// 🌍 Get Active Live Rooms Feed (Global & Country Discovery with Realtime Ranking)
liveRouter.get(['/', '/rooms'], async (req, res, next) => {
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
liveRouter.get(['/countries', '/rooms/countries'], async (req, res, next) => {
  try {
    const stats = await LiveService.getLiveCountriesStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

// 🔍 Check Active Room for Logged-In User (Duplicate Prevention & Re-entry)
liveRouter.get(['/my-active-room', '/rooms/my-active-room'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await LiveService.getMyActiveRoom(req.user!.userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Create Live Room & Generate Agora Host Token (Strict JWT Auth)
liveRouter.post(['/', '/rooms', '/start'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = createLiveRoomSchema.parse(req.body);
    const result = await LiveService.createRoom({
      hostUserId: req.user!.userId,
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

// 🛑 Host Ends Broadcast (Server-Enforced Lifecycle with Finalized Statistics)
liveRouter.post(['/:roomId/end', '/rooms/:roomId/end'], async (req, res, next) => {
  try {
    let resolvedUserId: number = 0;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (token) {
      const payload = (await import('../utils/jwt.js')).verifyAccessToken(token);
      if (payload?.userId) {
        resolvedUserId = payload.userId;
      }
    } else if (req.headers['x-user-id']) {
      resolvedUserId = Number(req.headers['x-user-id']);
    } else if (req.body.hostUserId || req.body.hostNumericId) {
      resolvedUserId = Number(req.body.hostUserId || req.body.hostNumericId);
    }

    const { endReason } = req.body;
    const result = await LiveService.endRoom(req.params.roomId as string, resolvedUserId, {
      endedBy: 'HOST',
      endReason,
    });
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

// 💓 Host Live Heartbeat
liveRouter.post(['/:roomId/heartbeat', '/rooms/:roomId/heartbeat'], async (req, res, next) => {
  try {
    let resolvedUserId: number = 0;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (token) {
      const payload = (await import('../utils/jwt.js')).verifyAccessToken(token);
      if (payload?.userId) {
        resolvedUserId = payload.userId;
      }
    } else if (req.headers['x-user-id']) {
      resolvedUserId = Number(req.headers['x-user-id']);
    } else if (req.body.hostUserId || req.body.hostNumericId) {
      resolvedUserId = Number(req.body.hostUserId || req.body.hostNumericId);
    }

    const result = await LiveService.recordHeartbeat(req.params.roomId as string, resolvedUserId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message, code: error.code });
      return;
    }
    next(error);
  }
});

// 🚨 Admin Force-End Broadcast (Strictly Admin / Moderation Role)
liveRouter.post(['/:roomId/admin-force-end', '/rooms/:roomId/admin-force-end'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { endReason } = req.body;
    const result = await LiveService.endRoom(req.params.roomId as string, req.user!.userId, {
      endedBy: 'ADMIN',
      endReason: endReason || 'Broadcast terminated by administration.',
    });
    res.status(200).json({
      success: true,
      message: 'Broadcast terminated by administration.',
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

// 📊 Get Finalized Broadcast Summary
liveRouter.get(['/:roomId/summary', '/rooms/:roomId/summary'], async (req, res, next) => {
  try {
    const summary = await LiveService.getBroadcastSummary(req.params.roomId as string);
    res.status(200).json({ success: true, data: summary });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
});

// 📜 Get My Broadcast History
liveRouter.get(['/history/me', '/rooms/history/me', '/history', '/rooms/history'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const fallbackUserId = req.query.userId ? parseInt(req.query.userId as string, 10) : undefined;
    const targetUserId = req.user?.userId || fallbackUserId;
    if (!targetUserId) {
      res.status(200).json({ success: true, data: { total: 0, page, limit, totalPages: 0, data: [] } });
      return;
    }
    const history = await LiveService.getUserBroadcastHistory(targetUserId, page, limit);
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
});

// 📜 Get User Broadcast History by User ID / Numeric ID
liveRouter.get(['/history/user/:userId', '/rooms/history/user/:userId'], async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const userId = parseInt(req.params.userId as string, 10);
    const history = await LiveService.getUserBroadcastHistory(userId, page, limit);
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
});

// 👥 Get Complete Authoritative Active Room Members List (Host, Speakers, Viewers)
liveRouter.get(['/:roomId/members', '/rooms/:roomId/members'], async (req, res, next) => {
  try {
    const result = await LiveService.getActiveRoomMembers(req.params.roomId as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// 🏆 Get Live Room Contribution Ranking (Day / Week / Monthly)
liveRouter.get(['/:roomId/contributions', '/rooms/:roomId/contributions'], async (req, res, next) => {
  try {
    const period = (req.query.period as string) || 'day';
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 50;

    const { UserService } = await import('../services/user.service.js');
    const result = await UserService.getContributionRanking({
      roomId: req.params.roomId as string,
      period: period as any,
      limit,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// 💎 Direct Diamond Transfer in Live Room (Host <-> Guest or Peer)
liveRouter.post(['/:roomId/diamonds/send', '/rooms/:roomId/diamonds/send'], optionalAuthenticateToken, async (req: Request, res, next) => {
  try {
    const { GiftService } = await import('../services/gift.service.js');
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
    const roomId = (req.params.roomId || req.body.roomId) as string;
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
    next(error);
  }
});

// 🔍 📋 🎁 📢 💎 Get Complete Live Room View Info (ID, Members, Rewards, Announcement, Numeric Room Value)
liveRouter.get(['/:roomId/info', '/rooms/:roomId/info'], async (req, res, next) => {
  try {
    const result = await LiveService.getRoomViewInfo(req.params.roomId as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// 📢 Update Live Room Announcement (Host/Admin permission-gated)
liveRouter.put(['/:roomId/announcement', '/rooms/:roomId/announcement'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const announcement = req.body.announcement !== undefined ? String(req.body.announcement) : '';
    const result = await LiveService.updateRoomAnnouncement(
      req.params.roomId as string,
      req.user!.userId,
      announcement,
    );

    // Emit Socket.IO event to room if IO is available
    try {
      const { getIO } = await import('../websocket/socketServer.js');
      const io = getIO();
      if (io) {
        io.to(`room_${result.roomId}`).emit('room.announcement.updated', {
          roomId: result.roomId,
          announcement: result.announcement,
          updatedBy: result.updatedBy,
        });
      }
    } catch {
      // socket io broadcast graceful
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// 👁️ Record Viewer Presence Join
liveRouter.post(['/:roomId/viewer-join', '/rooms/:roomId/viewer-join'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
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
liveRouter.post(['/:roomId/viewer-leave', '/rooms/:roomId/viewer-leave'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
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
liveRouter.post(['/:roomId/lock', '/rooms/:roomId/lock'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
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
liveRouter.post(['/:roomId/unlock', '/rooms/:roomId/unlock'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
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
liveRouter.post(['/:roomId/join', '/rooms/:roomId/join'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
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
liveRouter.post(['/:roomId/join-request', '/rooms/:roomId/join-request'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
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
liveRouter.post(['/:roomId/join-request/:requestId/respond', '/rooms/:roomId/join-request/:requestId/respond'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
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
liveRouter.get(['/:roomId/join-requests', '/rooms/:roomId/join-requests'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
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
liveRouter.post(['/:roomId/gift', '/rooms/:roomId/gift'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
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
liveRouter.patch(['/:roomId/settings', '/rooms/:roomId/settings'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
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
liveRouter.get(['/:roomId/admins', '/rooms/:roomId/admins'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const admins = await LiveService.getRoomAdmins(req.params.roomId as string);
    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    next(error);
  }
});

// Add Room Admin
liveRouter.post(['/:roomId/admins', '/rooms/:roomId/admins'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
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
liveRouter.delete(['/:roomId/admins/:targetUserId', '/rooms/:roomId/admins/:targetUserId'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
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
liveRouter.get(['/:roomId/seats', '/rooms/:roomId/seats'], async (req, res, next) => {
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
liveRouter.post(['/:roomId/seats/:seatNumber/take', '/rooms/:roomId/seats/:seatNumber/take'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
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
liveRouter.post(['/:roomId/seats/:seatNumber/leave', '/rooms/:roomId/seats/:seatNumber/leave'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
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
liveRouter.patch(['/:roomId/seats/:seatNumber/mute', '/rooms/:roomId/seats/:seatNumber/mute'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
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
liveRouter.patch(['/:roomId/seats/:seatNumber/lock', '/rooms/:roomId/seats/:seatNumber/lock'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
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
liveRouter.post(['/:roomId/seats/:seatNumber/kick', '/rooms/:roomId/seats/:seatNumber/kick'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
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

// 🎙️ Move Target User Directly to a Mic Seat (Host/Admin only)
liveRouter.post(['/:roomId/seats/move-to-mic', '/rooms/:roomId/seats/move-to-mic'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { targetUserId, seatNumber } = req.body;
    const result = await LiveService.moveUserToMic(
      req.params.roomId as string,
      req.user!.userId,
      parseInt(targetUserId, 10),
      seatNumber ? parseInt(seatNumber, 10) : undefined
    );

    // Broadcast Socket.IO events to room
    try {
      const { getIO } = await import('../websocket/socketServer.js');
      const io = getIO();
      if (io) {
        io.to(`room_${result.roomId}`).emit('seat.updated', {
          roomId: result.roomId,
          seatNumber: result.seatNumber,
          seat: result.seat,
        });
        io.to(`room_${result.roomId}`).emit('room.user.moved_to_mic', {
          roomId: result.roomId,
          seatNumber: result.seatNumber,
          user: result.user,
          assignedBy: result.assignedBy,
        });
      }
    } catch {
      // socket io graceful
    }

    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
});

// 📩 Invite Target User to Take a Mic Seat (Host/Admin only)
liveRouter.post(['/:roomId/seats/invite-to-mic', '/rooms/:roomId/seats/invite-to-mic'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { targetUserId, seatNumber } = req.body;
    const result = await LiveService.inviteUserToMic(
      req.params.roomId as string,
      req.user!.userId,
      parseInt(targetUserId, 10),
      seatNumber ? parseInt(seatNumber, 10) : undefined
    );

    // Broadcast Socket.IO mic invitation to room/target user
    try {
      const { getIO } = await import('../websocket/socketServer.js');
      const io = getIO();
      if (io) {
        io.to(`room_${result.roomId}`).emit('room.mic.invitation', {
          roomId: result.roomId,
          seatNumber: result.seatNumber,
          targetUser: result.targetUser,
          invitedBy: result.invitedBy,
          timeoutSeconds: result.timeoutSeconds,
        });
      }
    } catch {
      // socket io graceful
    }

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
liveRouter.patch(['/:roomId/seat-capacity', '/rooms/:roomId/seat-capacity'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
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

// 🌟 Post Official Comment to Live Room
liveRouter.post(['/:roomId/official-comment', '/rooms/:roomId/official-comment'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { content, type, isPinned } = req.body;
    if (!content || typeof content !== 'string') {
      res.status(400).json({ success: false, error: 'Comment content is required.' });
      return;
    }
    const result = await LiveService.postOfficialComment({
      senderUserId: req.user!.userId,
      roomId: req.params.roomId as string,
      content,
      type,
      isPinned: isPinned === true,
    });
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
});

// 📋 Get Official & Pinned Comments for a Live Room
liveRouter.get(['/:roomId/official-comments', '/rooms/:roomId/official-comments'], async (req, res, next) => {
  try {
    const result = LiveService.getOfficialComments(req.params.roomId as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// 📌 Unpin Comment from Live Room
liveRouter.post(['/:roomId/unpin-comment', '/rooms/:roomId/unpin-comment'], authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await LiveService.unpinOfficialComment(req.params.roomId as string, req.user!.userId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
});

