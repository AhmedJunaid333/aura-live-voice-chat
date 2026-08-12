import { prisma } from '../config/database.js';
import { generateAgoraRtcToken, RtcRole } from '../utils/agoraToken.js';
import { emitToRoom, broadcastGlobal } from '../websocket/socketServer.js';

export class LiveService {
  /**
   * Create Live Voice Room & Generate RTC Token
   */
  static async createRoom(data: {
    hostUserId: number;
    title: string;
    category?: string;
    seatCount?: number;
  }) {
    const hostUser = await prisma.user.findUnique({
      where: { id: data.hostUserId },
    });

    if (!hostUser) {
      throw new Error('Host user not found.');
    }

    const roomId = `RM-${hostUser.numericId}-${Math.floor(1000 + Math.random() * 9000)}`;

    const room = await prisma.liveRoom.create({
      data: {
        roomId,
        title: data.title,
        category: data.category || 'Music',
        hostId: data.hostUserId,
        seatCount: data.seatCount || 10,
        status: 'LIVE',
        isLocked: false,
        allowsJoinRequest: true,
        listenersCount: 1,
      },
      include: {
        host: {
          select: { id: true, numericId: true, username: true, avatar: true, level: true, vipTier: true },
        },
      },
    });

    // Generate Host Agora RTC Token
    const agoraConfig = generateAgoraRtcToken(room.roomId, hostUser.numericId, RtcRole.PUBLISHER);

    // Broadcast room live event to all connected clients
    broadcastGlobal('live.started', {
      roomId: room.roomId,
      title: room.title,
      category: room.category,
      host: room.host,
      isLocked: false,
      timestamp: new Date().toISOString(),
    });

    return {
      room,
      agora: agoraConfig,
    };
  }

  /**
   * 🔒 Lock Live Voice Room (Server-Enforced)
   * Only the authenticated Host of the room can lock it.
   */
  static async lockRoom(roomId: string, hostUserId: number, options?: { lockMode?: string; password?: string }) {
    const room = await prisma.liveRoom.findUnique({
      where: { roomId },
      include: { host: true },
    });

    if (!room) {
      const err = new Error('Live room not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    if (room.hostId !== hostUserId) {
      const err = new Error('Unauthorized. Only the Room Host can lock this room.');
      (err as any).statusCode = 403;
      throw err;
    }

    const now = new Date();
    const updatedRoom = await prisma.liveRoom.update({
      where: { id: room.id },
      data: {
        isLocked: true,
        status: 'LOCKED',
        lockedAt: now,
        lockedBy: hostUserId,
        lockMode: options?.lockMode || 'MANUAL_LOCK',
        lockPassword: options?.password || null,
        allowsJoinRequest: true,
      },
      include: {
        host: {
          select: { id: true, numericId: true, username: true, avatar: true, level: true, vipTier: true },
        },
      },
    });

    // Record Immutable Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: hostUserId,
        actorRole: 'HOST',
        action: 'ROOM_LOCKED',
        resource: `Room:${roomId}`,
        details: JSON.stringify({
          roomId,
          lockedAt: now.toISOString(),
          lockMode: options?.lockMode || 'MANUAL_LOCK',
        }),
      },
    });

    // Emit Realtime Socket.IO events to room and admin portal
    emitToRoom(roomId, 'room.locked', {
      roomId,
      isLocked: true,
      lockedAt: now.toISOString(),
      lockedBy: hostUserId,
      allowsJoinRequest: true,
    });

    broadcastGlobal('room.locked', {
      roomId,
      isLocked: true,
      lockedAt: now.toISOString(),
      lockedBy: hostUserId,
      hostName: room.host.username,
    });

    return updatedRoom;
  }

  /**
   * 🔓 Unlock Live Voice Room (Server-Enforced)
   * Only the authenticated Host of the room can unlock it.
   */
  static async unlockRoom(roomId: string, hostUserId: number) {
    const room = await prisma.liveRoom.findUnique({
      where: { roomId },
      include: { host: true },
    });

    if (!room) {
      const err = new Error('Live room not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    if (room.hostId !== hostUserId) {
      const err = new Error('Unauthorized. Only the Room Host can unlock this room.');
      (err as any).statusCode = 403;
      throw err;
    }

    const updatedRoom = await prisma.liveRoom.update({
      where: { id: room.id },
      data: {
        isLocked: false,
        status: 'LIVE',
        lockedAt: null,
        lockedBy: null,
        lockPassword: null,
      },
      include: {
        host: {
          select: { id: true, numericId: true, username: true, avatar: true, level: true, vipTier: true },
        },
      },
    });

    // Record Immutable Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: hostUserId,
        actorRole: 'HOST',
        action: 'ROOM_UNLOCKED',
        resource: `Room:${roomId}`,
        details: JSON.stringify({
          roomId,
          unlockedAt: new Date().toISOString(),
        }),
      },
    });

    // Emit Realtime Socket.IO events
    emitToRoom(roomId, 'room.unlocked', {
      roomId,
      isLocked: false,
      timestamp: new Date().toISOString(),
    });

    broadcastGlobal('room.unlocked', {
      roomId,
      isLocked: false,
      timestamp: new Date().toISOString(),
    });

    return updatedRoom;
  }

  /**
   * Audience join room & fetch Agora RTC Token
   * STRICT SERVER-ENFORCED LOCK VALIDATION
   */
  static async joinRoom(roomId: string, userNumericId: number, userId: number) {
    const room = await prisma.liveRoom.findUnique({
      where: { roomId },
      include: {
        host: {
          select: { id: true, numericId: true, username: true, avatar: true, level: true, vipTier: true },
        },
      },
    });

    if (!room || room.status === 'ENDED') {
      const err = new Error('Live room is not active.');
      (err as any).statusCode = 404;
      throw err;
    }

    // 🔒 SERVER-SIDE LOCK ENFORCEMENT
    if (room.isLocked || room.status === 'LOCKED') {
      const isHost = room.hostId === userId;
      
      // Check if user has an ACCEPTED join request
      const approvedRequest = await prisma.roomJoinRequest.findFirst({
        where: {
          roomId,
          userId,
          status: 'ACCEPTED',
        },
      });

      if (!isHost && !approvedRequest) {
        const lockError: any = new Error('This room is currently locked by the host.');
        lockError.statusCode = 403;
        lockError.code = 'ROOM_LOCKED';
        lockError.data = {
          roomId: room.roomId,
          title: room.title,
          isLocked: true,
          allowsJoinRequest: room.allowsJoinRequest,
          hostName: room.host.username,
          hostAvatar: room.host.avatar,
        };
        throw lockError;
      }
    }

    // Increment listeners
    await prisma.liveRoom.update({
      where: { id: room.id },
      data: { listenersCount: { increment: 1 } },
    });

    // Generate Subscriber Agora RTC Token
    const agoraConfig = generateAgoraRtcToken(room.roomId, userNumericId, RtcRole.SUBSCRIBER);

    return {
      room,
      agora: agoraConfig,
    };
  }

  /**
   * 🙋 Create Join Request for Locked Room
   */
  static async createJoinRequest(data: {
    roomId: string;
    userId: number;
    userNumericId: number;
    userName: string;
    userAvatar?: string | null;
  }) {
    const room = await prisma.liveRoom.findUnique({
      where: { roomId: data.roomId },
      include: { host: true },
    });

    if (!room) {
      const err = new Error('Live room not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    if (!room.isLocked && room.status !== 'LOCKED') {
      const err = new Error('Room is not locked. You can join directly.');
      (err as any).statusCode = 400;
      throw err;
    }

    // Upsert join request
    const existing = await prisma.roomJoinRequest.findFirst({
      where: { roomId: data.roomId, userId: data.userId },
    });

    let joinRequest;
    if (existing) {
      joinRequest = await prisma.roomJoinRequest.update({
        where: { id: existing.id },
        data: {
          status: 'PENDING',
          userName: data.userName,
          userAvatar: data.userAvatar,
          reviewedBy: null,
          reviewedAt: null,
          updatedAt: new Date(),
        },
      });
    } else {
      joinRequest = await prisma.roomJoinRequest.create({
        data: {
          roomId: data.roomId,
          userId: data.userId,
          userName: data.userName,
          userAvatar: data.userAvatar,
          status: 'PENDING',
        },
      });
    }

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: data.userId,
        actorRole: 'USER',
        action: 'JOIN_REQUEST_CREATED',
        resource: `Room:${data.roomId}`,
        details: JSON.stringify({
          requestId: joinRequest.id,
          roomId: data.roomId,
          userName: data.userName,
        }),
      },
    });

    // Realtime notification to Room Host
    emitToRoom(data.roomId, 'room.join.requested', {
      requestId: joinRequest.id,
      roomId: data.roomId,
      userId: data.userId,
      userNumericId: data.userNumericId,
      userName: data.userName,
      userAvatar: data.userAvatar,
      timestamp: new Date().toISOString(),
    });

    broadcastGlobal('room.join.requested', {
      requestId: joinRequest.id,
      roomId: data.roomId,
      targetHostNumericId: room.host.numericId,
      userName: data.userName,
      timestamp: new Date().toISOString(),
    });

    return joinRequest;
  }

  /**
   * 👑 Host Responds to Join Request (Accept / Reject)
   */
  static async respondJoinRequest(data: {
    roomId: string;
    hostUserId: number;
    requestId: string;
    status: 'ACCEPTED' | 'REJECTED';
  }) {
    const room = await prisma.liveRoom.findUnique({
      where: { roomId: data.roomId },
    });

    if (!room || room.hostId !== data.hostUserId) {
      const err = new Error('Unauthorized. Only the Room Host can respond to join requests.');
      (err as any).statusCode = 403;
      throw err;
    }

    const request = await prisma.roomJoinRequest.findUnique({
      where: { id: data.requestId },
      include: { user: true },
    });

    if (!request) {
      const err = new Error('Join request not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    const updated = await prisma.roomJoinRequest.update({
      where: { id: data.requestId },
      data: {
        status: data.status,
        reviewedBy: data.hostUserId,
        reviewedAt: new Date(),
      },
    });

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: data.hostUserId,
        actorRole: 'HOST',
        action: data.status === 'ACCEPTED' ? 'JOIN_REQUEST_ACCEPTED' : 'JOIN_REQUEST_REJECTED',
        resource: `Room:${data.roomId}`,
        details: JSON.stringify({
          requestId: data.requestId,
          targetUserId: request.userId,
          targetUserName: request.userName,
          status: data.status,
        }),
      },
    });

    // Emit Realtime event directly to target user
    if (data.status === 'ACCEPTED') {
      emitToRoom(data.roomId, 'room.join.request.accepted', {
        requestId: data.requestId,
        roomId: data.roomId,
        targetUserId: request.userId,
        targetNumericId: request.user.numericId,
        userName: request.userName,
        message: 'Host accepted your join request. You may now enter the suite!',
      });
    } else {
      emitToRoom(data.roomId, 'room.join.request.rejected', {
        requestId: data.requestId,
        roomId: data.roomId,
        targetUserId: request.userId,
        targetNumericId: request.user.numericId,
        userName: request.userName,
        message: 'Host declined your join request.',
      });
    }

    return updated;
  }

  /**
   * Fetch Pending Join Requests for Host
   */
  static async getPendingJoinRequests(roomId: string, hostUserId: number) {
    const room = await prisma.liveRoom.findUnique({
      where: { roomId },
    });

    if (!room || room.hostId !== hostUserId) {
      const err = new Error('Unauthorized. Only the Room Host can view join requests.');
      (err as any).statusCode = 403;
      throw err;
    }

    return await prisma.roomJoinRequest.findMany({
      where: { roomId, status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Send Gift Inside Live Room (Atomic Transaction)
   */
  static async sendGiftInRoom(data: {
    roomId: string;
    senderUserId: number;
    receiverUserId: number;
    giftId: string;
    count?: number;
  }) {
    const giftCount = data.count || 1;
    const gift = await prisma.gift.findUnique({
      where: { id: data.giftId },
    });

    if (!gift) {
      throw new Error('Gift not found.');
    }

    const totalCoins = gift.costCoins * giftCount;
    const totalDiamonds = gift.rewardDiamonds * giftCount;

    const sender = await prisma.user.findUnique({ where: { id: data.senderUserId } });
    if (!sender || sender.coins < totalCoins) {
      throw new Error('Insufficient coin balance to send this gift.');
    }

    // Atomic Transaction: Debit Sender, Credit Receiver, Record Gift Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Debit sender coins
      const updatedSender = await tx.user.update({
        where: { id: data.senderUserId },
        data: { coins: { decrement: totalCoins } },
      });

      // 2. Credit receiver diamonds
      const updatedReceiver = await tx.user.update({
        where: { id: data.receiverUserId },
        data: { diamonds: { increment: totalDiamonds } },
      });

      // 3. Record Gift Transaction
      const giftTx = await tx.giftTransaction.create({
        data: {
          roomId: data.roomId,
          senderId: data.senderUserId,
          receiverId: data.receiverUserId,
          giftId: data.giftId,
          count: giftCount,
          totalCoins,
          totalDiamonds,
        },
      });

      return { updatedSender, updatedReceiver, giftTx };
    });

    // Broadcast Realtime Gift Animation in Room
    emitToRoom(data.roomId, 'gift.sent', {
      giftId: gift.id,
      giftName: gift.name,
      giftIcon: gift.icon,
      count: giftCount,
      senderNumericId: sender.numericId,
      senderUsername: sender.username,
      totalCoins: Number(totalCoins),
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      remainingCoins: Number(result.updatedSender.coins),
      giftTransactionId: result.giftTx.id,
    };
  }

  /**
   * Generate Agora Dynamic Token for Channel & Role
   */
  static generateTokenForChannel(channelName: string, numericUid: number, role: 'publisher' | 'subscriber') {
    const rtcRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    return generateAgoraRtcToken(channelName, numericUid, rtcRole);
  }
}
