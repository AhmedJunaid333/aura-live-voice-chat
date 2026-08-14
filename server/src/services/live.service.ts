import { prisma } from '../config/database.js';
import { generateAgoraRtcToken, RtcRole } from '../utils/agoraToken.js';
import { emitToRoom, broadcastGlobal } from '../websocket/socketServer.js';
import { FamilyService } from './family.service.js';

export class LiveService {
  /**
   * Create Live Voice Room & Generate RTC Token
   */
  static async createRoom(data: {
    hostUserId: number;
    title: string;
    category?: string;
    seatCount?: number;
    countryCode?: string;
  }) {
    let hostUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: data.hostUserId },
          { numericId: data.hostUserId },
        ],
      },
    });

    if (!hostUser) {
      hostUser = await prisma.user.findFirst({
        orderBy: { id: 'asc' },
      });
    }

    if (!hostUser) {
      hostUser = await prisma.user.create({
        data: {
          numericId: 100001,
          username: 'AuraHost_100001',
          displayName: 'Aura Host',
          email: 'host100001@auralive.app',
          passwordHash: 'dummy_hash',
          level: 5,
          countryCode: 'PK',
        },
      });
    }

    // 🛡️ IDEMPOTENCY: Check if host already has an active LIVE room
    const existingActiveRoom = await prisma.liveRoom.findFirst({
      where: {
        hostId: hostUser.id,
        status: { in: ['LIVE', 'LOCKED'] },
      },
      include: {
        host: {
          select: { id: true, numericId: true, username: true, displayName: true, avatar: true, level: true, vipTier: true, countryCode: true },
        },
        seats: {
          include: {
            user: {
              select: { id: true, numericId: true, username: true, displayName: true, avatar: true, level: true, vipTier: true },
            },
          },
          orderBy: { seatNumber: 'asc' },
        },
      },
    });

    if (existingActiveRoom) {
      const agoraConfig = generateAgoraRtcToken(existingActiveRoom.roomId, hostUser.numericId, RtcRole.PUBLISHER);
      return {
        room: existingActiveRoom,
        agora: agoraConfig,
      };
    }

    const roomId = `RM-${hostUser.numericId}-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalSeats = data.seatCount === 20 ? 20 : (data.seatCount === 15 ? 15 : 10);
    const verifiedCountryCode = (data.countryCode || hostUser.countryCode || 'PK').toUpperCase();
    const initialRankingScore = (hostUser.level * 20) + 100;

    const room = await prisma.liveRoom.create({
      data: {
        roomId,
        title: data.title,
        category: data.category || 'Music',
        countryCode: verifiedCountryCode,
        hostId: data.hostUserId,
        seatCount: totalSeats,
        status: 'LIVE',
        isLocked: false,
        allowsJoinRequest: true,
        listenersCount: 1,
        viewerCount: 0,
        rankingScore: initialRankingScore,
        seats: {
          create: Array.from({ length: totalSeats }, (_, i) => {
            const seatNumber = i + 1;
            return {
              seatNumber,
              userId: null,
              isHost: false,
              status: 'EMPTY',
              isMuted: false,
              isLocked: false,
            };
          }),
        },
      },
      include: {
        host: {
          select: { id: true, numericId: true, username: true, displayName: true, avatar: true, level: true, vipTier: true, countryCode: true },
        },
        seats: {
          include: {
            user: {
              select: { id: true, numericId: true, username: true, displayName: true, avatar: true, level: true, vipTier: true },
            },
          },
          orderBy: { seatNumber: 'asc' },
        },
      },
    });

    // Generate Host Agora RTC Token
    const agoraConfig = generateAgoraRtcToken(room.roomId, hostUser.numericId, RtcRole.PUBLISHER);

    // Broadcast room live events to all connected clients
    broadcastGlobal('broadcast.started', {
      roomId: room.roomId,
      title: room.title,
      category: room.category,
      countryCode: verifiedCountryCode,
      host: room.host,
      seatCount: room.seatCount,
      isLocked: false,
      timestamp: new Date().toISOString(),
    });

    broadcastGlobal('live.started', {
      roomId: room.roomId,
      title: room.title,
      category: room.category,
      countryCode: verifiedCountryCode,
      host: room.host,
      seatCount: room.seatCount,
      isLocked: false,
      timestamp: new Date().toISOString(),
    });

    broadcastGlobal('country.live.count.updated', {
      countryCode: verifiedCountryCode,
      timestamp: new Date().toISOString(),
    });

    return {
      room,
      agora: agoraConfig,
    };
  }

  /**
   * 🌍 Get Active Live Rooms with Country Discovery & Realtime Ranking
   */
  static async getLiveRooms(query: {
    countryCode?: string;
    category?: string;
    search?: string;
    status?: string;
    hostId?: number;
    sort?: string;
  }) {
    const where: any = {
      status: query.status ? query.status : { in: ['LIVE', 'LOCKED'] },
    };

    if (query.countryCode && query.countryCode !== 'GLOBAL' && query.countryCode !== 'ALL') {
      where.countryCode = query.countryCode.toUpperCase();
    }

    if (query.category && query.category !== 'All' && query.category !== 'ALL') {
      where.category = query.category;
    }

    if (query.hostId) {
      where.hostId = query.hostId;
    }

    if (query.search && query.search.trim().length > 0) {
      const q = query.search.trim();
      where.OR = [
        { title: { contains: q } },
        { host: { username: { contains: q } } },
        { host: { displayName: { contains: q } } },
      ];
    }

    const rooms = await prisma.liveRoom.findMany({
      where,
      include: {
        host: {
          select: {
            id: true,
            numericId: true,
            username: true,
            displayName: true,
            avatar: true,
            level: true,
            vipTier: true,
            countryCode: true,
          },
        },
        seats: {
          where: { status: 'OCCUPIED' },
          select: { id: true, seatNumber: true, userId: true },
        },
        _count: {
          select: { viewers: true, seats: true },
        },
      },
      orderBy: [
        { rankingScore: 'desc' },
        { viewerCount: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 60,
    });

    const countryFlags: Record<string, string> = {
      PK: '🇵🇰',
      IN: '🇮🇳',
      BD: '🇧🇩',
      AE: '🇦🇪',
      SA: '🇸🇦',
      TR: '🇹🇷',
      US: '🇺🇸',
      GB: '🇬🇧',
      GLOBAL: '🌍',
    };

    return rooms.map((r) => {
      const cCode = (r.countryCode || r.host.countryCode || 'PK').toUpperCase();
      const flag = countryFlags[cCode] || '🌍';
      const occupiedSeatsCount = r.seats.length;
      const calculatedViewers = Math.max(r.viewerCount, r._count?.viewers ?? 0);

      return {
        id: r.id,
        roomId: r.roomId,
        title: r.title,
        description: r.description,
        announcement: r.announcement,
        cover: r.cover,
        category: r.category,
        tags: r.tags,
        theme: r.theme,
        countryCode: cCode,
        countryFlag: flag,
        hostId: r.hostId,
        host: r.host,
        status: r.status,
        isLocked: r.isLocked,
        seatCount: r.seatCount,
        seatLayoutType: r.seatLayoutType,
        occupiedSeatCount: occupiedSeatsCount,
        viewerCount: calculatedViewers,
        participantCount: occupiedSeatsCount + calculatedViewers + 1, // Host + guests + viewers
        rankingScore: r.rankingScore || ((calculatedViewers * 10) + (occupiedSeatsCount * 15) + (r.host.level * 20)),
        isPK: r.isPK,
        createdAt: r.createdAt,
      };
    });
  }

  /**
   * 🌍 Get Global Live Countries Stats (Real Active Counts)
   */
  static async getLiveCountriesStats() {
    const supportedCountries = [
      { countryCode: 'PK', name: 'Pakistan', flag: '🇵🇰' },
      { countryCode: 'IN', name: 'India', flag: '🇮🇳' },
      { countryCode: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
      { countryCode: 'AE', name: 'UAE', flag: '🇦🇪' },
      { countryCode: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
      { countryCode: 'TR', name: 'Turkey', flag: '🇹🇷' },
      { countryCode: 'US', name: 'United States', flag: '🇺🇸' },
      { countryCode: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    ];

    const grouped = await prisma.liveRoom.groupBy({
      by: ['countryCode'],
      where: { status: { in: ['LIVE', 'LOCKED'] } },
      _count: { id: true },
    });

    const countsMap = new Map<string, number>();
    let totalGlobal = 0;

    for (const g of grouped) {
      const code = (g.countryCode || 'PK').toUpperCase();
      countsMap.set(code, (countsMap.get(code) || 0) + g._count.id);
      totalGlobal += g._count.id;
    }

    const countryList = supportedCountries.map((c) => ({
      countryCode: c.countryCode,
      name: c.name,
      flag: c.flag,
      liveCount: countsMap.get(c.countryCode) || 0,
    }));

    return {
      totalActiveLive: totalGlobal,
      countries: countryList,
    };
  }

  /**
   * 👁️ Record Realtime Viewer Presence Join
   */
  static async recordViewerJoin(roomId: string, userId: number, socketId?: string) {
    const room = await prisma.liveRoom.findUnique({
      where: { roomId },
      include: { host: true, seats: { where: { status: 'OCCUPIED' } } },
    });

    if (!room || room.status === 'ENDED') {
      return { success: false, message: 'Room not active.' };
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false };

    // If viewer is not the host, record viewer presence
    if (room.hostId !== userId) {
      await prisma.liveRoomViewer.upsert({
        where: { roomId_userId: { roomId, userId } },
        create: {
          roomId,
          userId,
          socketId: socketId || null,
          countryCode: user.countryCode || 'PK',
          lastSeenAt: new Date(),
        },
        update: {
          socketId: socketId || null,
          lastSeenAt: new Date(),
        },
      });
    }

    const uniqueViewers = await prisma.liveRoomViewer.count({ where: { roomId } });
    const occupiedSeats = room.seats.length;
    const rankingScore = (uniqueViewers * 10) + (room.likesCount * 1) + (occupiedSeats * 15) + (room.host.level * 20);

    await prisma.liveRoom.update({
      where: { id: room.id },
      data: {
        viewerCount: uniqueViewers,
        rankingScore,
      },
    });

    // Realtime broadcast to room
    emitToRoom(roomId, 'room.viewer.joined', {
      roomId,
      userId: user.numericId,
      username: user.username,
      displayName: user.displayName || user.username,
      avatar: user.avatar,
      viewerCount: uniqueViewers,
      participantCount: uniqueViewers + occupiedSeats + 1,
    });

    emitToRoom(roomId, 'room.participant.updated', {
      roomId,
      viewerCount: uniqueViewers,
      guestCount: occupiedSeats,
      participantCount: uniqueViewers + occupiedSeats + 1,
    });

    broadcastGlobal('room.ranking.updated', {
      roomId,
      viewerCount: uniqueViewers,
      rankingScore,
    });

    return {
      success: true,
      viewerCount: uniqueViewers,
      rankingScore,
    };
  }

  /**
   * 👁️ Record Realtime Viewer Presence Leave
   */
  static async recordViewerLeave(roomId: string, userId: number) {
    try {
      await prisma.liveRoomViewer.deleteMany({
        where: { roomId, userId },
      });

      const uniqueViewers = await prisma.liveRoomViewer.count({ where: { roomId } });
      const room = await prisma.liveRoom.findUnique({
        where: { roomId },
        include: { host: true, seats: { where: { status: 'OCCUPIED' } } },
      });

      if (room) {
        const occupiedSeats = room.seats.length;
        const rankingScore = (uniqueViewers * 10) + (room.likesCount * 1) + (occupiedSeats * 15) + (room.host.level * 20);

        await prisma.liveRoom.update({
          where: { id: room.id },
          data: {
            viewerCount: uniqueViewers,
            rankingScore,
          },
        });

        emitToRoom(roomId, 'room.viewer.left', {
          roomId,
          userId,
          viewerCount: uniqueViewers,
          participantCount: uniqueViewers + occupiedSeats + 1,
        });

        emitToRoom(roomId, 'room.participant.updated', {
          roomId,
          viewerCount: uniqueViewers,
          guestCount: occupiedSeats,
          participantCount: uniqueViewers + occupiedSeats + 1,
        });
      }

      return { success: true, viewerCount: uniqueViewers };
    } catch (_) {
      return { success: false };
    }
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

    // Check block status between host and joining user
    const isBlocked = await prisma.blockedUser.findFirst({
      where: {
        OR: [
          { blockerId: room.hostId, blockedId: userId },
          { blockerId: userId, blockedId: room.hostId },
        ],
      },
    });

    if (isBlocked) {
      const blockErr: any = new Error('Cannot join room due to block settings.');
      blockErr.statusCode = 403;
      throw blockErr;
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

    // Check block status
    const isBlocked = await prisma.blockedUser.findFirst({
      where: {
        OR: [
          { blockerId: data.senderUserId, blockedId: data.receiverUserId },
          { blockerId: data.receiverUserId, blockedId: data.senderUserId },
        ],
      },
    });

    if (isBlocked) {
      throw new Error('Cannot send gift due to block settings.');
    }

    const room = await prisma.liveRoom.findFirst({
      where: { OR: [{ id: data.roomId }, { roomId: data.roomId }] },
    });

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
          roomId: room?.id || null,
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

    // Check if sender belongs to a family to record family diamonds & XP atomically
    try {
      await FamilyService.recordFamilyContribution({
        userId: data.senderUserId,
        diamonds: totalDiamonds,
        coins: totalCoins,
        giftTransactionId: result.giftTx.id,
      });
    } catch (fErr) {
      console.warn('Family contribution non-blocking hook notice:', fErr);
    }

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
   * Update Room Settings (Seats, Info, Theme, Layout, Tools)
   */
  static async updateRoomSettings(userId: number, roomId: string, data: any) {
    const room = await prisma.liveRoom.findUnique({
      where: { roomId }
    });

    if (!room) {
      throw new Error('Live room not found.');
    }

    let isAdmin = null;
    try {
      isAdmin = await (prisma as any).liveRoomAdmin.findFirst({ where: { roomId, userId } });
    } catch(e) {}

    if (room.hostId !== userId && !isAdmin) {
      const err = new Error('Unauthorized. Caller must be room host or a LiveRoomAdmin.');
      (err as any).statusCode = 403;
      throw err;
    }

    if (data.seatCount !== undefined) {
      let occupiedCount = 0;
      try {
        occupiedCount = await (prisma as any).roomSeat.count({ where: { roomId, userId: { not: null } } });
      } catch (e) {
        try {
          occupiedCount = await (prisma as any).liveRoomSeat.count({ where: { roomId, userId: { not: null } } });
        } catch(e2) {}
      }
      if (data.seatCount < occupiedCount) {
        const err = new Error(`${occupiedCount} seats are currently occupied. You cannot reduce the room below the occupied seat count.`);
        (err as any).statusCode = 400;
        throw err;
      }
    }

    const updatedRoom = await prisma.liveRoom.update({
      where: { id: room.id },
      data: {
        seatCount: data.seatCount ?? room.seatCount,
        title: data.title ?? room.title,
        description: data.description ?? (room as any).description,
        announcement: data.announcement ?? (room as any).announcement,
        cover: data.cover ?? (room as any).cover,
        category: data.category ?? room.category,
        tags: data.tags ?? (room as any).tags,
        language: data.language ?? (room as any).language,
        rules: data.rules ?? (room as any).rules,
        theme: data.theme ?? (room as any).theme,
        seatLayoutType: data.seatLayoutType ?? (room as any).seatLayoutType,
        slowMode: data.slowMode ?? (room as any).slowMode,
        slowModeSeconds: data.slowModeSeconds ?? (room as any).slowModeSeconds,
        chatMuted: data.chatMuted ?? (room as any).chatMuted,
        muteAllMics: data.muteAllMics ?? (room as any).muteAllMics,
      }
    });

    const actorRole = room.hostId === userId ? 'HOST' : 'ADMIN';

    if (data.seatCount !== undefined) {
      await prisma.auditLog.create({
        data: { actorId: userId, actorRole, action: 'ROOM_SEATS_CHANGED', resource: `Room:${roomId}`, details: JSON.stringify({ seatCount: data.seatCount }) }
      });
      emitToRoom(roomId, 'room.seats.updated', { roomId, seatCount: data.seatCount });
    }

    if (data.title !== undefined || data.description !== undefined || data.announcement !== undefined || data.cover !== undefined || data.category !== undefined || data.tags !== undefined || data.language !== undefined || data.rules !== undefined) {
      await prisma.auditLog.create({
        data: { actorId: userId, actorRole, action: 'ROOM_INFO_UPDATED', resource: `Room:${roomId}`, details: JSON.stringify(data) }
      });
      emitToRoom(roomId, 'room.info.updated', { roomId, ...data });
    }

    if (data.theme !== undefined) {
       await prisma.auditLog.create({
        data: { actorId: userId, actorRole, action: 'ROOM_THEME_CHANGED', resource: `Room:${roomId}`, details: JSON.stringify({ theme: data.theme }) }
      });
      emitToRoom(roomId, 'room.theme.updated', { roomId, theme: data.theme });
    }

    if (data.seatLayoutType !== undefined) {
       await prisma.auditLog.create({
        data: { actorId: userId, actorRole, action: 'ROOM_LAYOUT_CHANGED', resource: `Room:${roomId}`, details: JSON.stringify({ seatLayoutType: data.seatLayoutType }) }
      });
      emitToRoom(roomId, 'room.layout.updated', { roomId, seatLayoutType: data.seatLayoutType });
    }
    
    if (data.slowMode !== undefined || data.slowModeSeconds !== undefined || data.chatMuted !== undefined || data.muteAllMics !== undefined) {
       await prisma.auditLog.create({
        data: { actorId: userId, actorRole, action: 'ROOM_TOOL_CHANGED', resource: `Room:${roomId}`, details: JSON.stringify(data) }
      });
      emitToRoom(roomId, 'room.tool.updated', { roomId, ...data });
    }

    return updatedRoom;
  }

  /**
   * Get Room Admins
   */
  static async getRoomAdmins(roomId: string) {
    return await (prisma as any).liveRoomAdmin.findMany({
      where: { roomId },
      include: { user: { select: { id: true, numericId: true, username: true, avatar: true } } }
    });
  }

  /**
   * Add Room Admin
   */
  static async addRoomAdmin(actorId: number, roomId: string, data: { targetUserId: number; role?: string; permissions?: string }) {
    const room = await prisma.liveRoom.findUnique({ where: { roomId } });
    if (!room || room.hostId !== actorId) {
      const err = new Error('Unauthorized. Only the room host can add admins.');
      (err as any).statusCode = 403;
      throw err;
    }

    const admin = await prisma.liveRoomAdmin.upsert({
      where: { roomId_userId: { roomId, userId: data.targetUserId } },
      update: { role: data.role || 'ROOM_ADMIN', permissions: data.permissions || 'manage_room,manage_seats,mute_users' },
      create: { roomId, userId: data.targetUserId, role: data.role || 'ROOM_ADMIN', permissions: data.permissions || 'manage_room,manage_seats,mute_users', createdBy: actorId }
    });

    await prisma.auditLog.create({
      data: { actorId, actorRole: 'HOST', action: 'ROOM_ADMIN_ADDED', resource: `Room:${roomId}`, details: JSON.stringify({ targetUserId: data.targetUserId }) }
    });

    emitToRoom(roomId, 'room.admin.added', { roomId, admin });
    return admin;
  }

  /**
   * Remove Room Admin
   */
  static async removeRoomAdmin(actorId: number, roomId: string, targetUserId: number) {
    const room = await prisma.liveRoom.findUnique({ where: { roomId } });
    if (!room || room.hostId !== actorId) {
      const err = new Error('Unauthorized. Only the room host can remove admins.');
      (err as any).statusCode = 403;
      throw err;
    }

    await (prisma as any).liveRoomAdmin.delete({
      where: { roomId_userId: { roomId, userId: targetUserId } }
    });

    await prisma.auditLog.create({
      data: { actorId, actorRole: 'HOST', action: 'ROOM_ADMIN_REMOVED', resource: `Room:${roomId}`, details: JSON.stringify({ targetUserId }) }
    });

    emitToRoom(roomId, 'room.admin.removed', { roomId, targetUserId });
    return { success: true };
  }

  /**
   * Seed missing seats for existing rooms if not present
   */
  static async ensureRoomSeats(roomId: string, seatCount: number, hostId: number) {
    const existingSeats = await prisma.liveRoomSeat.findMany({
      where: { roomId },
    });

    const targetSeats = seatCount === 20 ? 20 : (seatCount === 15 ? 15 : 10);

    if (existingSeats.length === 0) {
      const seatsToCreate = Array.from({ length: targetSeats }, (_, i) => {
        const seatNumber = i + 1;
        return {
          roomId,
          seatNumber,
          userId: null,
          isHost: false,
          status: 'EMPTY',
          isMuted: false,
          isLocked: false,
        };
      });
      await prisma.liveRoomSeat.createMany({
        data: seatsToCreate,
      });
    } else if (existingSeats.length < targetSeats) {
      const existingNums = new Set(existingSeats.map((s) => s.seatNumber));
      const missingSeats = [];
      for (let i = 1; i <= targetSeats; i++) {
        if (!existingNums.has(i)) {
          missingSeats.push({
            roomId,
            seatNumber: i,
            userId: null,
            isHost: false,
            status: 'EMPTY',
            isMuted: false,
            isLocked: false,
          });
        }
      }
      if (missingSeats.length > 0) {
        await prisma.liveRoomSeat.createMany({ data: missingSeats });
      }
    }
  }

  /**
   * Get all seats for a room
   */
  static async getRoomSeats(roomId: string) {
    const room = await prisma.liveRoom.findUnique({
      where: { roomId },
      include: { host: true },
    });

    if (!room) {
      const err = new Error('Room not found');
      (err as any).statusCode = 404;
      throw err;
    }

    await this.ensureRoomSeats(room.roomId, room.seatCount, room.hostId);

    const seats = await prisma.liveRoomSeat.findMany({
      where: { roomId: room.roomId },
      include: {
        user: {
          select: {
            id: true,
            numericId: true,
            username: true,
            displayName: true,
            avatar: true,
            level: true,
            vipTier: true,
          },
        },
      },
      orderBy: { seatNumber: 'asc' },
    });

    return {
      roomId: room.roomId,
      seatCount: room.seatCount,
      hostId: room.hostId,
      seats,
    };
  }

  /**
   * Take a seat (Atomic Database Transaction)
   */
  static async takeSeat(roomId: string, seatNumber: number, userId: number) {
    return await prisma.$transaction(async (tx) => {
      const room = await tx.liveRoom.findUnique({
        where: { roomId },
        include: { host: true, roomAdmins: true },
      });

      if (!room) {
        const err = new Error('Live room not found.');
        (err as any).statusCode = 404;
        throw err;
      }

      if (room.status === 'ENDED') {
        const err = new Error('Live room has ended.');
        (err as any).statusCode = 400;
        throw err;
      }

      if (seatNumber < 1 || seatNumber > room.seatCount) {
        const err = new Error(`Invalid seat number. Room has ${room.seatCount} seats.`);
        (err as any).statusCode = 400;
        throw err;
      }

      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        const err = new Error('User not found.');
        (err as any).statusCode = 404;
        throw err;
      }

      // Check if target seat is locked
      const targetSeat = await tx.liveRoomSeat.findUnique({
        where: { roomId_seatNumber: { roomId, seatNumber } },
      });

      if (!targetSeat) {
        const err = new Error('Seat record not found.');
        (err as any).statusCode = 404;
        throw err;
      }

      const isHost = room.hostId === userId;
      const isAdmin = room.roomAdmins.some((a) => a.userId === userId);

      if (targetSeat.isLocked && !isHost && !isAdmin) {
        const err = new Error('This seat is locked by the host.');
        (err as any).statusCode = 403;
        throw err;
      }

      if (targetSeat.userId !== null && targetSeat.userId !== userId) {
        const err = new Error('SEAT_ALREADY_OCCUPIED');
        (err as any).statusCode = 409;
        throw err;
      }

      // Free any other seat currently held by this user in this room
      await tx.liveRoomSeat.updateMany({
        where: {
          roomId,
          userId,
          seatNumber: { not: seatNumber },
        },
        data: {
          userId: null,
          status: 'EMPTY',
          isMuted: false,
        },
      });

      // Claim target seat
      const updatedSeat = await tx.liveRoomSeat.update({
        where: { id: targetSeat.id },
        data: {
          userId,
          status: 'SPEAKING',
          isMuted: false,
        },
        include: {
          user: {
            select: {
              id: true,
              numericId: true,
              username: true,
              displayName: true,
              avatar: true,
              level: true,
              vipTier: true,
            },
          },
        },
      });

      // Generate Agora Broadcaster RTC Token
      const agoraConfig = generateAgoraRtcToken(roomId, user.numericId, RtcRole.PUBLISHER);

      // Realtime broadcast to room
      emitToRoom(roomId, 'room.seat.updated', {
        roomId,
        seat: updatedSeat,
        action: 'TAKEN',
      });

      return {
        seat: updatedSeat,
        agora: agoraConfig,
      };
    });
  }

  /**
   * Leave a seat
   */
  static async leaveSeat(roomId: string, seatNumber: number, userId: number) {
    return await prisma.$transaction(async (tx) => {
      const targetSeat = await tx.liveRoomSeat.findUnique({
        where: { roomId_seatNumber: { roomId, seatNumber } },
        include: { room: true },
      });

      if (!targetSeat) {
        const err = new Error('Seat not found.');
        (err as any).statusCode = 404;
        throw err;
      }

      if (targetSeat.isHost && targetSeat.userId === userId) {
        const err = new Error('Room host cannot leave the host seat.');
        (err as any).statusCode = 400;
        throw err;
      }

      const isOwner = targetSeat.userId === userId;
      const isHost = targetSeat.room.hostId === userId;

      if (!isOwner && !isHost) {
        const err = new Error('Unauthorized to vacate this seat.');
        (err as any).statusCode = 403;
        throw err;
      }

      const updatedSeat = await tx.liveRoomSeat.update({
        where: { id: targetSeat.id },
        data: {
          userId: null,
          status: targetSeat.isLocked ? 'LOCKED' : 'EMPTY',
          isMuted: false,
        },
        include: {
          user: {
            select: { id: true, numericId: true, username: true, displayName: true, avatar: true },
          },
        },
      });

      emitToRoom(roomId, 'room.seat.updated', {
        roomId,
        seat: updatedSeat,
        action: 'LEFT',
      });

      return updatedSeat;
    });
  }

  /**
   * Mute / Unmute Seat Mic
   */
  static async muteSeat(roomId: string, seatNumber: number, actorUserId: number, isMuted: boolean) {
    const seat = await prisma.liveRoomSeat.findUnique({
      where: { roomId_seatNumber: { roomId, seatNumber } },
      include: { room: { include: { roomAdmins: true } } },
    });

    if (!seat) {
      const err = new Error('Seat not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    const isHost = seat.room.hostId === actorUserId;
    const isAdmin = seat.room.roomAdmins.some((a) => a.userId === actorUserId);
    const isOwner = seat.userId === actorUserId;

    if (!isHost && !isAdmin && !isOwner) {
      const err = new Error('Unauthorized to mute this seat.');
      (err as any).statusCode = 403;
      throw err;
    }

    const updatedSeat = await prisma.liveRoomSeat.update({
      where: { id: seat.id },
      data: {
        isMuted,
        status: isMuted ? 'MUTED' : (seat.userId ? 'SPEAKING' : 'EMPTY'),
      },
      include: {
        user: {
          select: { id: true, numericId: true, username: true, displayName: true, avatar: true, level: true, vipTier: true },
        },
      },
    });

    emitToRoom(roomId, 'room.seat.updated', {
      roomId,
      seat: updatedSeat,
      action: isMuted ? 'MUTED' : 'UNMUTED',
    });

    return updatedSeat;
  }

  /**
   * Lock / Unlock Seat
   */
  static async lockSeat(roomId: string, seatNumber: number, actorUserId: number, isLocked: boolean) {
    const seat = await prisma.liveRoomSeat.findUnique({
      where: { roomId_seatNumber: { roomId, seatNumber } },
      include: { room: { include: { roomAdmins: true } } },
    });

    if (!seat) {
      const err = new Error('Seat not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    const isHost = seat.room.hostId === actorUserId;
    const isAdmin = seat.room.roomAdmins.some((a) => a.userId === actorUserId);

    if (!isHost && !isAdmin) {
      const err = new Error('Unauthorized. Only host or admins can lock seats.');
      (err as any).statusCode = 403;
      throw err;
    }

    const updatedSeat = await prisma.liveRoomSeat.update({
      where: { id: seat.id },
      data: {
        isLocked,
        status: isLocked ? 'LOCKED' : (seat.userId ? 'SPEAKING' : 'EMPTY'),
      },
      include: {
        user: {
          select: { id: true, numericId: true, username: true, displayName: true, avatar: true, level: true, vipTier: true },
        },
      },
    });

    emitToRoom(roomId, 'room.seat.updated', {
      roomId,
      seat: updatedSeat,
      action: isLocked ? 'LOCKED' : 'UNLOCKED',
    });

    return updatedSeat;
  }

  /**
   * Kick User off Seat
   */
  static async kickSeat(roomId: string, seatNumber: number, actorUserId: number) {
    const seat = await prisma.liveRoomSeat.findUnique({
      where: { roomId_seatNumber: { roomId, seatNumber } },
      include: { room: { include: { roomAdmins: true } }, user: true },
    });

    if (!seat) {
      const err = new Error('Seat not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    if (seat.isHost) {
      const err = new Error('Cannot kick host.');
      (err as any).statusCode = 400;
      throw err;
    }

    const isHost = seat.room.hostId === actorUserId;
    const isAdmin = seat.room.roomAdmins.some((a) => a.userId === actorUserId);

    if (!isHost && !isAdmin) {
      const err = new Error('Unauthorized. Only host or admins can kick speakers.');
      (err as any).statusCode = 403;
      throw err;
    }

    const kickedUserId = seat.userId;
    const kickedUserNumericId = seat.user?.numericId;

    const updatedSeat = await prisma.liveRoomSeat.update({
      where: { id: seat.id },
      data: {
        userId: null,
        status: seat.isLocked ? 'LOCKED' : 'EMPTY',
        isMuted: false,
      },
      include: {
        user: {
          select: { id: true, numericId: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    emitToRoom(roomId, 'room.seat.updated', {
      roomId,
      seat: updatedSeat,
      action: 'KICKED',
      kickedUserId,
      kickedUserNumericId,
    });

    return updatedSeat;
  }

  /**
   * Change Seat Capacity (Strictly 10, 15, or 20 Seats with Occupied Verification)
   */
  static async changeSeatCapacity(roomId: string, newSeatCount: number, actorUserId: number) {
    if (![10, 15, 20].includes(newSeatCount)) {
      const err = new Error('Invalid seat capacity. Aura Live supports ONLY 10, 15, or 20 seats.');
      (err as any).statusCode = 400;
      throw err;
    }

    return await prisma.$transaction(async (tx) => {
      const room = await tx.liveRoom.findUnique({
        where: { roomId },
        include: { roomAdmins: true },
      });

      if (!room) {
        const err = new Error('Live room not found.');
        (err as any).statusCode = 404;
        throw err;
      }

      const isHost = room.hostId === actorUserId;
      const isAdmin = room.roomAdmins.some((a) => a.userId === actorUserId);

      if (!isHost && !isAdmin) {
        const err = new Error('Unauthorized. Only host or room admins can change seat capacity.');
        (err as any).statusCode = 403;
        throw err;
      }

      const currentSeats = await tx.liveRoomSeat.findMany({
        where: { roomId },
        orderBy: { seatNumber: 'asc' },
      });

      // If downsizing, verify seats to be removed are all empty
      if (newSeatCount < room.seatCount) {
        const seatsToRemove = currentSeats.filter((s) => s.seatNumber > newSeatCount);
        const occupiedSeats = seatsToRemove.filter((s) => s.userId !== null);

        if (occupiedSeats.length > 0) {
          const occupiedList = occupiedSeats.map((s) => `Seat ${s.seatNumber}`).join(', ');
          const err = new Error(
            `Cannot reduce capacity: ${occupiedList} ${occupiedSeats.length > 1 ? 'are' : 'is'} currently occupied. All seats from ${newSeatCount + 1} to ${room.seatCount} must be empty first.`
          );
          (err as any).statusCode = 400;
          throw err;
        }

        // Delete the removed seats
        await tx.liveRoomSeat.deleteMany({
          where: {
            roomId,
            seatNumber: { gt: newSeatCount },
          },
        });
      } else if (newSeatCount > room.seatCount) {
        // Create new seats
        const existingNums = new Set(currentSeats.map((s) => s.seatNumber));
        const newSeatsData = [];
        for (let i = 1; i <= newSeatCount; i++) {
          if (!existingNums.has(i)) {
            newSeatsData.push({
              roomId,
              seatNumber: i,
              userId: null,
              isHost: false,
              status: 'EMPTY',
              isMuted: false,
              isLocked: false,
            });
          }
        }
        if (newSeatsData.length > 0) {
          await tx.liveRoomSeat.createMany({ data: newSeatsData });
        }
      }

      const updatedRoom = await tx.liveRoom.update({
        where: { id: room.id },
        data: { seatCount: newSeatCount },
      });

      const finalSeats = await tx.liveRoomSeat.findMany({
        where: { roomId },
        include: {
          user: {
            select: { id: true, numericId: true, username: true, displayName: true, avatar: true, level: true, vipTier: true },
          },
        },
        orderBy: { seatNumber: 'asc' },
      });

      emitToRoom(roomId, 'room.seats.updated', {
        roomId,
        seatCount: newSeatCount,
        seats: finalSeats,
      });

      return {
        room: updatedRoom,
        seats: finalSeats,
      };
    });
  }

  /**
   * 🛑 End Broadcast / Live Room Lifecycle
   */
  static async endRoom(roomId: string, hostUserId: number) {
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
      const err = new Error('Unauthorized. Only the host can end this broadcast.');
      (err as any).statusCode = 403;
      throw err;
    }

    const now = new Date();
    const updatedRoom = await prisma.liveRoom.update({
      where: { id: room.id },
      data: {
        status: 'ENDED',
        endedAt: now,
        listenersCount: 0,
        viewerCount: 0,
      },
    });

    // Clean up active viewers
    await prisma.liveRoomViewer.deleteMany({
      where: { roomId },
    });

    // Reset occupied seats
    await prisma.liveRoomSeat.updateMany({
      where: { roomId },
      data: {
        userId: null,
        status: 'EMPTY',
        isMuted: false,
        isLocked: false,
      },
    });

    // Emit realtime termination
    emitToRoom(roomId, 'broadcast.ended', {
      roomId,
      endedAt: now.toISOString(),
    });

    emitToRoom(roomId, 'room.ended', {
      roomId,
      endedAt: now.toISOString(),
    });

    broadcastGlobal('broadcast.ended', {
      roomId,
      endedAt: now.toISOString(),
    });

    broadcastGlobal('country.live.count.updated', {
      countryCode: (room.countryCode || 'PK').toUpperCase(),
      timestamp: now.toISOString(),
    });

    return updatedRoom;
  }
}

