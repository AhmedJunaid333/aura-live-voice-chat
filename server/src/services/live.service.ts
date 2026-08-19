import { prisma } from '../config/database.js';
import { generateAgoraRtcToken, RtcRole } from '../utils/agoraToken.js';
import { emitToRoom, broadcastGlobal, updateRoomMemberRole } from '../websocket/socketServer.js';
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
    let hostUser = await prisma.user.findUnique({
      where: { id: data.hostUserId },
    });
    if (!hostUser) {
      hostUser = await prisma.user.findFirst({
        where: { numericId: data.hostUserId },
      });
    }

    if (!hostUser) {
      throw new Error('HOST_NOT_FOUND: Authenticated host user not found. Please log in and try again.');
    }

    // 🛡️ Ensure any previous active broadcast for this host is cleanly finalized and ended
    const previousActiveRooms = await prisma.liveRoom.findMany({
      where: {
        hostId: hostUser.id,
        status: { in: ['LIVE', 'LOCKED'] },
      },
    });

    for (const prevRoom of previousActiveRooms) {
      try {
        await this.endRoom(prevRoom.roomId, hostUser.id, {
          endedBy: 'HOST',
          endReason: 'Host started a new live broadcast.',
        });
      } catch (_) {}
    }

    const permanentRoomId = `RM-${hostUser.numericId}`;
    const totalSeats = data.seatCount === 20 ? 20 : (data.seatCount === 15 ? 15 : 10);
    const verifiedCountryCode = (data.countryCode || hostUser.countryCode || 'PK').toUpperCase();
    const initialRankingScore = (hostUser.level * 20) + 100;

    // 1. Check if user already has an existing room in DB
    const existingRoom = await prisma.liveRoom.findFirst({
      where: {
        OR: [
          { hostId: hostUser.id },
          { roomId: permanentRoomId },
        ],
      },
    });

    let room;
    if (existingRoom) {
      // 🔄 Existing Room Found: Update room, reset seats, and activate Live Session
      await prisma.liveRoomSeat.deleteMany({
        where: {
          OR: [
            { roomId: existingRoom.roomId },
            { roomId: permanentRoomId },
          ],
        },
      });

      room = await prisma.liveRoom.update({
        where: { id: existingRoom.id },
        data: {
          roomId: permanentRoomId,
          title: data.title || existingRoom.title || `${hostUser.displayName || hostUser.username}'s Audio Lounge`,
          category: data.category || existingRoom.category || 'Music',
          countryCode: verifiedCountryCode,
          seatCount: totalSeats,
          status: 'LIVE',
          isLocked: false,
          listenersCount: 1,
          viewerCount: 0,
          peakViewers: 0,
          totalViewers: 0,
          newFollowers: 0,
          totalGifts: 0,
          totalDiamonds: 0,
          totalComments: 0,
          guestsJoined: 0,
          seatsUsed: 0,
          durationSeconds: 0,
          endedAt: null,
          createdAt: new Date(), // Live session startedAt
          updatedAt: new Date(),
          rankingScore: initialRankingScore,
          seats: {
            create: Array.from({ length: totalSeats }, (_, i) => ({
              seatNumber: i + 1,
              userId: null,
              isHost: false,
              status: 'EMPTY',
              isMuted: false,
              isLocked: false,
            })),
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
    } else {
      // 🆕 Create Permanent Room for the First Time
      room = await prisma.liveRoom.create({
        data: {
          roomId: permanentRoomId,
          title: data.title || `${hostUser.displayName || hostUser.username}'s Audio Lounge`,
          category: data.category || 'Music',
          countryCode: verifiedCountryCode,
          hostId: hostUser.id,
          seatCount: totalSeats,
          status: 'LIVE',
          isLocked: false,
          allowsJoinRequest: true,
          listenersCount: 1,
          viewerCount: 0,
          rankingScore: initialRankingScore,
          seats: {
            create: Array.from({ length: totalSeats }, (_, i) => ({
              seatNumber: i + 1,
              userId: null,
              isHost: false,
              status: 'EMPTY',
              isMuted: false,
              isLocked: false,
            })),
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
    }

    // Generate Host Agora RTC Token
    const agoraConfig = generateAgoraRtcToken(room.roomId, hostUser.numericId, RtcRole.PUBLISHER);

    // Broadcast room live events to all connected clients
    const startPayload = {
      roomId: room.roomId,
      title: room.title,
      category: room.category,
      countryCode: verifiedCountryCode,
      host: room.host,
      seatCount: room.seatCount,
      isLocked: false,
      isLive: true,
      isDiscoverable: true,
      timestamp: new Date().toISOString(),
    };

    broadcastGlobal('broadcast.started', startPayload);
    broadcastGlobal('BROADCAST_STARTED', startPayload);
    broadcastGlobal('live.started', startPayload);
    broadcastGlobal('LIVE_STARTED', startPayload);
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
  } = {}) {
    // 🛡️ Auto-Reconcile Stale/Abandoned Broadcasts before querying
    try {
      await this.reconcileStaleRooms();
    } catch (_) {}

    // Strict condition: Only genuinely active broadcasts, never ended
    const where: any = {
      status: query.status ? query.status : { in: ['LIVE', 'LOCKED'] },
      endedAt: null,
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
      const numQ = parseInt(q, 10);
      const isNum = !isNaN(numQ);
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { roomId: { contains: q, mode: 'insensitive' } },
        { host: { username: { contains: q, mode: 'insensitive' } } },
        { host: { displayName: { contains: q, mode: 'insensitive' } } },
        ...(isNum ? [{ host: { numericId: numQ } }, { host: { id: numQ } }] : []),
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
            equippedFrameId: true,
            frameOwnerships: {
              where: { isEquipped: true },
              include: { frame: true },
              take: 1,
            },
            medals: {
              include: { medal: true },
              take: 3,
            },
            membershipProfile: {
              select: { vipLevel: true, svipLevel: true },
            },
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

      const equippedOwnership = (r.host as any).frameOwnerships?.[0];
      const equippedMedal = (r.host as any).medals?.[0];
      const vipLevel = (r.host as any).membershipProfile?.vipLevel || r.host.vipTier || 0;
      const svipLevel = (r.host as any).membershipProfile?.svipLevel || 0;

      // Determine frame URL: explicit equipped frame OR VIP Tier SVGA frame
      let hostFrameUrl = equippedOwnership?.frame?.assetUrl || null;
      let hostFrameName = equippedOwnership?.frame?.name || null;
      let hostFrameAnimationType = equippedOwnership?.frame?.animationType || null;
      if (!hostFrameUrl && vipLevel > 0) {
        hostFrameUrl = `/vip_svgas/vip_${vipLevel}_frame.svga`;
        hostFrameName = `VIP ${vipLevel} Frame`;
        hostFrameAnimationType = 'svga';
      }

      // Determine medal URL: explicit equipped medal OR VIP Tier SVGA medal
      let hostMedalUrl = equippedMedal?.medal?.icon || null;
      let hostMedalName = equippedMedal?.medal?.name || null;
      if (!hostMedalUrl && vipLevel > 0) {
        hostMedalUrl = `/vip_svgas/vip_${vipLevel}_medal.svga`;
        hostMedalName = `VIP ${vipLevel} Medal`;
      }

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
        host: {
          id: r.host.id,
          numericId: r.host.numericId,
          username: r.host.username,
          displayName: r.host.displayName,
          avatar: r.host.avatar,
          level: r.host.level,
          vipTier: vipLevel,
          vipLevel: vipLevel,
          svipLevel: svipLevel,
          countryCode: r.host.countryCode,
          frameUrl: hostFrameUrl,
          frameName: hostFrameName,
          frameAnimationType: hostFrameAnimationType,
          medalUrl: hostMedalUrl,
          medalName: hostMedalName,
        },
        status: r.status,
        isLive: r.status === 'LIVE' || r.status === 'LOCKED',
        isDiscoverable: r.endedAt === null && (r.status === 'LIVE' || r.status === 'LOCKED'),
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
      where: {
        status: { in: ['LIVE', 'LOCKED'] },
        endedAt: null,
      },
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
   * 👥 Get Complete Authoritative Active Room Members List
   * Aggregates Host, Seated Speakers, and Active Viewers directly from PostgreSQL.
   */
  static async getActiveRoomMembers(roomId: string) {
    const room = await prisma.liveRoom.findUnique({
      where: { roomId },
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
          },
        },
        seats: {
          where: { userId: { not: null } },
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
        },
        viewers: {
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
          orderBy: { joinedAt: 'desc' },
        },
      },
    });

    if (!room || room.status === 'ENDED') {
      return {
        roomId,
        totalMembers: 0,
        members: [],
      };
    }

    const membersMap = new Map<number, any>();

    // 1. Add Host (Always present in active room)
    if (room.host) {
      membersMap.set(room.host.numericId, {
        userId: room.host.id,
        numericId: room.host.numericId,
        username: room.host.username,
        displayName: room.host.displayName || room.host.username,
        avatar: room.host.avatar,
        level: room.host.level,
        vipTier: room.host.vipTier,
        role: 'HOST',
        seatNumber: 1,
        isMuted: false,
        joinedAt: room.createdAt.toISOString(),
      });
    }

    // 2. Add Seated Speakers
    for (const seat of room.seats) {
      if (seat.user) {
        membersMap.set(seat.user.numericId, {
          userId: seat.user.id,
          numericId: seat.user.numericId,
          username: seat.user.username,
          displayName: seat.user.displayName || seat.user.username,
          avatar: seat.user.avatar,
          level: seat.user.level,
          vipTier: seat.user.vipTier,
          role: seat.user.id === room.hostId ? 'HOST' : 'SPEAKER',
          seatNumber: seat.seatNumber,
          isMuted: seat.isMuted,
          joinedAt: seat.createdAt.toISOString(),
        });
      }
    }

    // 3. Add Viewers (excluding anyone already on a seat or host)
    for (const viewer of room.viewers) {
      if (viewer.user && !membersMap.has(viewer.user.numericId)) {
        membersMap.set(viewer.user.numericId, {
          userId: viewer.user.id,
          numericId: viewer.user.numericId,
          username: viewer.user.username,
          displayName: viewer.user.displayName || viewer.user.username,
          avatar: viewer.user.avatar,
          level: viewer.user.level,
          vipTier: viewer.user.vipTier,
          role: 'VIEWER',
          seatNumber: null,
          isMuted: false,
          joinedAt: viewer.joinedAt.toISOString(),
        });
      }
    }

    const members = Array.from(membersMap.values());

    return {
      roomId,
      totalMembers: members.length,
      members,
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

    if (!room || room.status === 'ENDED' || room.endedAt !== null) {
      const err = new Error('This live room has ended.');
      (err as any).statusCode = 400;
      (err as any).code = 'BROADCAST_ENDED';
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
    const room = await prisma.liveRoom.findUnique({
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const err = new Error('User not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    // Check if target seat is locked
    const targetSeat = await prisma.liveRoomSeat.findUnique({
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
    await prisma.liveRoomSeat.updateMany({
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
    const updatedSeat = await prisma.liveRoomSeat.update({
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

    // Update active member role to SPEAKER
    updateRoomMemberRole(roomId, user.numericId, isHost ? 'HOST' : 'SPEAKER', seatNumber, false);

    // Fetch all current seats to broadcast authoritative full list
    const allSeats = await prisma.liveRoomSeat.findMany({
      where: { roomId },
      include: {
        user: {
          select: { id: true, numericId: true, username: true, displayName: true, avatar: true, level: true, vipTier: true },
        },
      },
      orderBy: { seatNumber: 'asc' },
    });

    // Realtime broadcast single seat and full seats list to room
    emitToRoom(roomId, 'room.seat.updated', {
      roomId,
      seat: updatedSeat,
      action: 'TAKEN',
    });
    emitToRoom(roomId, 'room.seats.updated', {
      roomId,
      seats: allSeats,
      seatCount: room.seatCount,
    });

    return {
      seat: updatedSeat,
      seats: allSeats,
      agora: agoraConfig,
    };
  }

  /**
   * Leave a seat
   */
  static async leaveSeat(roomId: string, seatNumber: number, userId: number) {
    const result = await prisma.$transaction(async (tx) => {
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

      const allSeats = await tx.liveRoomSeat.findMany({
        where: { roomId },
        include: {
          user: {
            select: { id: true, numericId: true, username: true, displayName: true, avatar: true, level: true, vipTier: true },
          },
        },
        orderBy: { seatNumber: 'asc' },
      });

      emitToRoom(roomId, 'room.seat.updated', {
        roomId,
        seat: updatedSeat,
        action: 'LEFT',
      });
      emitToRoom(roomId, 'room.seats.updated', {
        roomId,
        seats: allSeats,
        seatCount: targetSeat.room.seatCount,
      });

      return { updatedSeat, allSeats, vacatedUserId: targetSeat.userId };
    }, { timeout: 25000, maxWait: 10000 });

    if (result.vacatedUserId) {
      const u = await prisma.user.findUnique({ where: { id: result.vacatedUserId }, select: { numericId: true } });
      if (u) {
        updateRoomMemberRole(roomId, u.numericId, 'VIEWER', null, false);
      }
    }

    return result.updatedSeat;
  }

  /**
   * Mute / Unmute Seat Mic
   */
  static async muteSeat(roomId: string, seatNumber: number, actorUserId: number, isMuted: boolean) {
    const actor = await prisma.user.findFirst({
      where: { OR: [{ id: actorUserId }, { numericId: actorUserId }] },
    });
    const effectiveActorId = actor ? actor.id : actorUserId;

    const seat = await prisma.liveRoomSeat.findUnique({
      where: { roomId_seatNumber: { roomId, seatNumber } },
      include: { room: { include: { roomAdmins: true } } },
    });

    if (!seat) {
      const err = new Error('Seat not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    const isHost = seat.room.hostId === effectiveActorId;
    const isAdmin = seat.room.roomAdmins.some((a) => a.userId === effectiveActorId);
    const isOwner = seat.userId === effectiveActorId;

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
    const actor = await prisma.user.findFirst({
      where: { OR: [{ id: actorUserId }, { numericId: actorUserId }] },
    });
    const effectiveActorId = actor ? actor.id : actorUserId;

    const seat = await prisma.liveRoomSeat.findUnique({
      where: { roomId_seatNumber: { roomId, seatNumber } },
      include: { room: { include: { roomAdmins: true } } },
    });

    if (!seat) {
      const err = new Error('Seat not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    const isHost = seat.room.hostId === effectiveActorId;
    const isAdmin = seat.room.roomAdmins.some((a) => a.userId === effectiveActorId);

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
    }, { timeout: 25000, maxWait: 10000 });
  }

  /**
   * ⏱️ Format seconds into HH:MM:SS
   */
  static formatDuration(seconds: number): string {
    const s = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  }

  /**
   * 🛑 End Broadcast / Live Room Lifecycle with Authoritative Statistics Finalization
   */
  static async endRoom(
    roomId: string,
    hostUserId: number,
    options?: { endedBy?: 'HOST' | 'ADMIN' | 'SYSTEM'; endReason?: string }
  ) {
    const room = await prisma.liveRoom.findFirst({
      where: {
        OR: [
          { roomId: roomId },
          { id: roomId },
        ],
      },
      include: {
        host: true,
        seats: true,
        viewers: true,
      },
    });

    if (!room) {
      const err = new Error('Live room not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    // Authorization: Resolve requester by id or numericId
    const requester = await prisma.user.findFirst({
      where: {
        OR: [
          { id: hostUserId },
          { numericId: hostUserId },
        ],
      },
      select: { id: true, numericId: true, role: true },
    });

    const isSystem = options?.endedBy === 'SYSTEM';
    const isHost =
      isSystem ||
      hostUserId === 0 ||
      room.hostId === hostUserId ||
      room.host.numericId === hostUserId ||
      (requester != null && (room.hostId === requester.id || room.host.numericId === requester.numericId));

    const isAdmin = requester != null && ['ADMIN', 'SUPER_ADMIN', 'SUPER_ADMIN_CEO', 'BD'].includes(requester.role);

    if (!isHost && !isAdmin && !isSystem) {
      const err = new Error('Unauthorized. Only the host or an administrator can end this broadcast.');
      (err as any).statusCode = 403;
      throw err;
    }

    const endedBy = isAdmin && !isHost ? 'ADMIN' : (options?.endedBy || 'HOST');
    const endReason = options?.endReason || (isAdmin && !isHost ? 'Broadcast terminated by administration.' : undefined);

    const startedAt = room.createdAt;
    const endedAt = new Date();
    const durationSeconds = Math.max(0, Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000));
    const formattedDuration = this.formatDuration(durationSeconds);

    // 1. Viewers calculation
    const activeViewersCount = room.viewers.length;
    const totalViewers = Math.max(room.totalViewers || 0, room.viewerCount || 0, activeViewersCount);
    const peakViewers = Math.max(room.peakViewers || 0, room.viewerCount || 0, totalViewers);

    // 2. New followers gained during session
    let newFollowers = 0;
    try {
      newFollowers = await prisma.follow.count({
        where: {
          followingId: room.hostId,
          createdAt: { gte: startedAt, lte: endedAt },
        },
      });
    } catch (_) {}

    // 3. Gifts received & Diamonds earned aggregation
    let totalGifts = 0;
    let diamondsEarned = 0;
    try {
      const giftAgg = await prisma.giftTransaction.aggregate({
        where: {
          OR: [{ roomId: room.id }, { roomId: room.roomId }],
        },
        _sum: {
          count: true,
          totalDiamonds: true,
        },
      });
      totalGifts = giftAgg._sum.count || 0;
      diamondsEarned = giftAgg._sum.totalDiamonds || 0;
    } catch (_) {}

    // 4. Comments count (Official + Live room comments)
    let totalComments = room.totalComments || 0;
    const roomOfficialComments = this.officialCommentsHistory.filter((c) => !c.roomId || c.roomId === roomId);
    totalComments = Math.max(totalComments, roomOfficialComments.length);

    // 5. Guests joined & seat usage
    const occupiedSeats = room.seats.filter((s) => s.userId !== null);
    const guestsJoined = Math.max(room.guestsJoined || 0, occupiedSeats.length);
    const seatsUsed = Math.max(room.seatsUsed || 0, occupiedSeats.length);
    const seatOccupancyRate = room.seatCount > 0 ? Math.min(100, Math.round((guestsJoined / room.seatCount) * 100)) : 0;

    // 6. Persist / Upsert Authoritative BroadcastHistory
    const history = await prisma.broadcastHistory.upsert({
      where: { broadcastId: room.roomId },
      create: {
        broadcastId: room.roomId,
        roomId: room.roomId,
        hostId: room.hostId,
        title: room.title,
        category: room.category,
        seatCapacity: room.seatCount,
        startedAt,
        endedAt,
        durationSeconds,
        formattedDuration,
        peakViewers,
        totalViewers,
        uniqueViewers: totalViewers,
        newFollowers,
        totalGifts,
        diamondsEarned,
        totalComments,
        guestsJoined,
        seatsUsed,
        seatOccupancyRate,
        endedBy,
        endReason,
        status: 'ENDED',
      },
      update: {
        endedAt,
        durationSeconds,
        formattedDuration,
        peakViewers,
        totalViewers,
        uniqueViewers: totalViewers,
        newFollowers,
        totalGifts,
        diamondsEarned,
        totalComments,
        guestsJoined,
        seatsUsed,
        seatOccupancyRate,
        endedBy,
        endReason,
        status: 'ENDED',
      },
    });

    // 7. Update LiveRoom status in DB
    const updatedRoom = await prisma.liveRoom.update({
      where: { id: room.id },
      data: {
        status: 'ENDED',
        endedAt,
        durationSeconds,
        peakViewers,
        totalViewers,
        newFollowers,
        totalGifts,
        totalDiamonds: diamondsEarned,
        totalComments,
        guestsJoined,
        seatsUsed,
        endedBy,
        endReason,
        listenersCount: 0,
        viewerCount: 0,
      },
    });

    // 8. Clean up active viewers
    await prisma.liveRoomViewer.deleteMany({
      where: {
        OR: [
          { roomId: room.roomId },
          { roomId: roomId },
        ],
      },
    });

    // 9. Reset occupied seats
    await prisma.liveRoomSeat.updateMany({
      where: {
        OR: [
          { roomId: room.roomId },
          { roomId: roomId },
        ],
      },
      data: {
        userId: null,
        status: 'EMPTY',
        isMuted: false,
        isLocked: false,
      },
    });

    // 10. Construct Final Authoritative Summary Payload
    const summaryPayload = {
      roomId: room.roomId,
      broadcastId: history.broadcastId,
      title: room.title,
      category: room.category,
      seatCount: room.seatCount,
      startedAt: startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
      durationSeconds,
      formattedDuration,
      host: {
        id: room.host.id,
        numericId: room.host.numericId,
        username: room.host.username,
        displayName: room.host.displayName,
        avatar: room.host.avatar,
        level: room.host.level,
        vipTier: room.host.vipTier,
      },
      metrics: {
        durationSeconds,
        formattedDuration,
        totalViewers,
        peakViewers,
        uniqueViewers: totalViewers,
        newFollowers,
        totalGifts,
        diamondsEarned,
        totalComments,
        guestsJoined,
        seatsUsed,
        seatCapacity: room.seatCount,
        seatOccupancyRate,
      },
      endedBy,
      endReason: endReason || (endedBy === 'ADMIN' ? 'Ended by administration.' : null),
      status: 'ENDED',
    };

    // 11. Emit realtime termination events globally and to room (supporting all casing / event name formats)
    emitToRoom(room.roomId, 'broadcast.ended', summaryPayload);
    emitToRoom(room.roomId, 'BROADCAST_ENDED', summaryPayload);
    emitToRoom(room.roomId, 'room.ended', summaryPayload);
    emitToRoom(room.roomId, 'ROOM_ENDED', summaryPayload);
    if (roomId !== room.roomId) {
      emitToRoom(roomId, 'broadcast.ended', summaryPayload);
      emitToRoom(roomId, 'BROADCAST_ENDED', summaryPayload);
      emitToRoom(roomId, 'room.ended', summaryPayload);
      emitToRoom(roomId, 'ROOM_ENDED', summaryPayload);
    }
    broadcastGlobal('broadcast.ended', summaryPayload);
    broadcastGlobal('BROADCAST_ENDED', summaryPayload);
    broadcastGlobal('room.ended', summaryPayload);
    broadcastGlobal('ROOM_ENDED', summaryPayload);
    broadcastGlobal('country.live.count.updated', {
      countryCode: (room.countryCode || 'PK').toUpperCase(),
      timestamp: endedAt.toISOString(),
    });

    return summaryPayload;
  }

  /**
   * 💓 Record Live Room Host Heartbeat
   */
  static async recordHeartbeat(roomId: string, hostUserId: number) {
    const room = await prisma.liveRoom.findFirst({
      where: {
        OR: [{ roomId }, { id: roomId }],
      },
      include: { host: true },
    });

    if (!room) {
      const err = new Error('Live room not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    if (room.status === 'ENDED' || room.endedAt !== null) {
      const err = new Error('This live room has ended.');
      (err as any).statusCode = 400;
      (err as any).code = 'BROADCAST_ENDED';
      throw err;
    }

    const now = new Date();
    await prisma.liveRoom.update({
      where: { id: room.id },
      data: {
        updatedAt: now,
      },
    });

    return {
      success: true,
      roomId: room.roomId,
      timestamp: now.toISOString(),
    };
  }

  /**
   * 🛡️ Server-Side Stale Room Reconciliation Engine
   * Automatically detects and marks abandoned / crashed live rooms as ENDED.
   */
  static async reconcileStaleRooms(): Promise<number> {
    const timeoutThreshold = new Date(Date.now() - 120 * 1000); // 120 seconds timeout

    // Find all rooms marked LIVE or LOCKED whose heartbeat/update has expired or endedAt is set
    const staleRooms = await prisma.liveRoom.findMany({
      where: {
        OR: [
          {
            status: { in: ['LIVE', 'LOCKED'] },
            updatedAt: { lt: timeoutThreshold },
          },
          {
            status: { in: ['LIVE', 'LOCKED'] },
            endedAt: { not: null },
          },
        ],
      },
      include: { host: true },
    });

    if (staleRooms.length === 0) return 0;

    let cleanedCount = 0;
    for (const room of staleRooms) {
      try {
        await this.endRoom(room.roomId, room.hostId, {
          endedBy: 'SYSTEM',
          endReason: 'Host heartbeat timeout / session terminated.',
        });
        cleanedCount++;
      } catch (err: any) {
        try {
          await prisma.liveRoom.update({
            where: { id: room.id },
            data: {
              status: 'ENDED',
              endedAt: new Date(),
              endedBy: 'SYSTEM',
              endReason: 'Host heartbeat timeout (force ended)',
            },
          });
          cleanedCount++;
        } catch (_) {}
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 [Reconciliation] Cleaned up ${cleanedCount} stale live room(s).`);
    }

    return cleanedCount;
  }

  /**
   * 📊 Get Finalized Broadcast Summary for a Room
   */
  static async getBroadcastSummary(roomId: string) {
    const history = await prisma.broadcastHistory.findFirst({
      where: { OR: [{ broadcastId: roomId }, { roomId }] },
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
          },
        },
      },
      orderBy: { endedAt: 'desc' },
    });

    if (history) {
      return {
        roomId: history.roomId,
        broadcastId: history.broadcastId,
        title: history.title,
        category: history.category,
        seatCount: history.seatCapacity,
        startedAt: history.startedAt.toISOString(),
        endedAt: history.endedAt.toISOString(),
        durationSeconds: history.durationSeconds,
        formattedDuration: history.formattedDuration,
        host: history.host,
        metrics: {
          durationSeconds: history.durationSeconds,
          formattedDuration: history.formattedDuration,
          totalViewers: history.totalViewers,
          peakViewers: history.peakViewers,
          uniqueViewers: history.uniqueViewers,
          newFollowers: history.newFollowers,
          totalGifts: history.totalGifts,
          diamondsEarned: history.diamondsEarned,
          totalComments: history.totalComments,
          guestsJoined: history.guestsJoined,
          seatsUsed: history.seatsUsed,
          seatCapacity: history.seatCapacity,
          seatOccupancyRate: history.seatOccupancyRate,
        },
        endedBy: history.endedBy,
        endReason: history.endReason,
        status: history.status,
      };
    }

    // Fallback to LiveRoom table if history row not found
    const room = await prisma.liveRoom.findUnique({
      where: { roomId },
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
          },
        },
      },
    });

    if (!room) {
      const err = new Error('Broadcast summary not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    const durationSeconds = room.durationSeconds || 0;
    const formattedDuration = this.formatDuration(durationSeconds);

    return {
      roomId: room.roomId,
      broadcastId: room.roomId,
      title: room.title,
      category: room.category,
      seatCount: room.seatCount,
      startedAt: room.createdAt.toISOString(),
      endedAt: (room.endedAt || new Date()).toISOString(),
      durationSeconds,
      formattedDuration,
      host: room.host,
      metrics: {
        durationSeconds,
        formattedDuration,
        totalViewers: room.totalViewers || 0,
        peakViewers: room.peakViewers || 0,
        uniqueViewers: room.totalViewers || 0,
        newFollowers: room.newFollowers || 0,
        totalGifts: room.totalGifts || 0,
        diamondsEarned: room.totalDiamonds || 0,
        totalComments: room.totalComments || 0,
        guestsJoined: room.guestsJoined || 0,
        seatsUsed: room.seatsUsed || 0,
        seatCapacity: room.seatCount,
        seatOccupancyRate: room.seatCount > 0 ? Math.min(100, Math.round(((room.guestsJoined || 0) / room.seatCount) * 100)) : 0,
      },
      endedBy: room.endedBy || 'HOST',
      endReason: room.endReason || null,
      status: room.status,
    };
  }

  /**
   * 📜 Get Broadcast History for a User (with automatic LiveRoom backfill)
   */
  static async getUserBroadcastHistory(userId: number, page = 1, limit = 20) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ id: userId }, { numericId: userId }],
      },
    });

    if (!user) {
      return { total: 0, page, limit, totalPages: 0, data: [] };
    }

    // 1. Backfill any completed LiveRooms that don't have a BroadcastHistory record yet
    try {
      const endedRoomsWithoutHistory = await prisma.liveRoom.findMany({
        where: {
          hostId: user.id,
          status: { in: ['ENDED', 'TERMINATED'] },
        },
        orderBy: { updatedAt: 'desc' },
        take: 20,
      });

      for (const room of endedRoomsWithoutHistory) {
        const startedAt = room.createdAt;
        const endedAt = room.endedAt || room.updatedAt || new Date();
        const durationSeconds = room.durationSeconds > 0
          ? room.durationSeconds
          : Math.max(0, Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000));
        const formattedDuration = this.formatDuration(durationSeconds);

        await prisma.broadcastHistory.upsert({
          where: { broadcastId: room.roomId },
          create: {
            broadcastId: room.roomId,
            roomId: room.roomId,
            hostId: user.id,
            title: room.title,
            category: room.category,
            seatCapacity: room.seatCount,
            startedAt,
            endedAt,
            durationSeconds,
            formattedDuration,
            peakViewers: room.peakViewers || 0,
            totalViewers: room.totalViewers || 0,
            uniqueViewers: room.totalViewers || 0,
            newFollowers: room.newFollowers || 0,
            totalGifts: room.totalGifts || 0,
            diamondsEarned: room.totalDiamonds || 0,
            totalComments: room.totalComments || 0,
            guestsJoined: room.guestsJoined || 0,
            seatsUsed: room.seatsUsed || 0,
            status: 'ENDED',
          },
          update: {
            endedAt,
            durationSeconds,
            formattedDuration,
            status: 'ENDED',
          },
        });
      }
    } catch (backfillErr) {
      console.error('⚠️ [BroadcastHistory Backfill Error]:', backfillErr);
    }

    const [total, histories] = await Promise.all([
      prisma.broadcastHistory.count({ where: { hostId: user.id } }),
      prisma.broadcastHistory.findMany({
        where: { hostId: user.id },
        orderBy: { endedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: histories,
    };
  }

  // ════════════════════════════════════════════════════════════════════════
  // 🌟 AURA OFFICIAL COMMENTS & PINNED COMMENTS ENGINE
  // ════════════════════════════════════════════════════════════════════════

  private static officialCommentsHistory: Array<{
    id: string;
    roomId?: string;
    senderId: number;
    senderNumericId: number;
    senderName: string;
    senderRole: string;
    senderAvatar?: string;
    type: string;
    content: string;
    isOfficial: boolean;
    isPinned: boolean;
    targetAudience: string;
    createdAt: string;
  }> = [];

  private static pinnedCommentsMap: Map<string, any> = new Map(); // roomId -> pinned comment object

  /**
   * 🌟 Post Official Comment to Live Room (Strictly Authorized)
   */
  static async postOfficialComment(params: {
    senderUserId: number;
    roomId: string;
    content: string;
    type?: string;
    isPinned?: boolean;
  }) {
    const user = await prisma.user.findUnique({
      where: { id: params.senderUserId },
      select: { id: true, numericId: true, username: true, displayName: true, avatar: true, role: true },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    const room = await prisma.liveRoom.findUnique({
      where: { roomId: params.roomId },
      select: { id: true, roomId: true, hostId: true, status: true },
    });

    if (!room) {
      throw new Error('Live room not found.');
    }

    // Verify Authorization: ADMIN, SUPER_ADMIN, BD, or Host of this room
    const isRoomHost = room.hostId === user.id;
    const isStaff = ['ADMIN', 'SUPER_ADMIN', 'SUPER_ADMIN_CEO', 'BD'].includes(user.role?.toUpperCase() || '');

    if (!isRoomHost && !isStaff) {
      const err = new Error('Unauthorized. Only Admins, Officials, or Room Host can post Official Comments.');
      (err as any).statusCode = 403;
      throw err;
    }

    const commentId = `OFFICIAL_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();
    const commentType = (params.type || 'ANNOUNCEMENT').toUpperCase();
    const senderRole = isStaff ? (user.role || 'OFFICIAL') : 'HOST';
    const isPinned = params.isPinned === true;

    const officialComment = {
      id: commentId,
      roomId: params.roomId,
      senderId: user.id,
      senderNumericId: user.numericId,
      senderName: user.displayName || user.username || 'Aura Official',
      senderRole,
      senderAvatar: user.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&auto=format',
      type: commentType,
      content: params.content,
      isOfficial: true,
      isPinned,
      targetAudience: 'ROOM_VIEWERS',
      createdAt: now,
    };

    // Store in history
    this.officialCommentsHistory.unshift(officialComment);
    if (this.officialCommentsHistory.length > 500) {
      this.officialCommentsHistory.pop();
    }

    // Handle Pinned Comment
    if (isPinned) {
      this.pinnedCommentsMap.set(params.roomId, officialComment);
      emitToRoom(params.roomId, 'room.pinned_comment', {
        roomId: params.roomId,
        comment: officialComment,
      });
    }

    // Emit Realtime Event to all Room Viewers
    emitToRoom(params.roomId, 'room.official_comment', {
      roomId: params.roomId,
      comment: officialComment,
    });

    return officialComment;
  }

  /**
   * 📌 Unpin Comment from Live Room
   */
  static async unpinOfficialComment(roomId: string, senderUserId: number) {
    const user = await prisma.user.findUnique({ where: { id: senderUserId } });
    if (!user) throw new Error('User not found.');

    const room = await prisma.liveRoom.findUnique({ where: { roomId } });
    if (!room) throw new Error('Live room not found.');

    const isRoomHost = room.hostId === user.id;
    const isStaff = ['ADMIN', 'SUPER_ADMIN', 'SUPER_ADMIN_CEO', 'BD'].includes(user.role?.toUpperCase() || '');

    if (!isRoomHost && !isStaff) {
      const err = new Error('Unauthorized to unpin comments in this room.');
      (err as any).statusCode = 403;
      throw err;
    }

    this.pinnedCommentsMap.delete(roomId);

    emitToRoom(roomId, 'room.pinned_comment', {
      roomId,
      comment: null,
    });

    return { success: true, roomId, pinnedComment: null };
  }

  /**
   * 📋 Get Official & Pinned Comments for a Live Room
   */
  static getOfficialComments(roomId: string) {
    const pinned = this.pinnedCommentsMap.get(roomId) || null;
    const roomComments = this.officialCommentsHistory.filter((c) => c.roomId === roomId || c.roomId === 'GLOBAL');

    return {
      pinnedComment: pinned,
      comments: roomComments.slice(0, 50),
    };
  }

  /**
   * 📢 Admin Broadcast Official Comment (Global or Targeted)
   */
  static async broadcastAdminOfficialComment(params: {
    adminUserId: number;
    title?: string;
    content: string;
    type?: string;
    target?: 'GLOBAL' | 'SPECIFIC_ROOMS';
    roomIds?: string[];
    isPinned?: boolean;
  }) {
    const admin = await prisma.user.findUnique({ where: { id: params.adminUserId } });
    if (!admin || !['ADMIN', 'SUPER_ADMIN', 'SUPER_ADMIN_CEO'].includes(admin.role?.toUpperCase() || '')) {
      const err = new Error('Unauthorized. Only Admins can broadcast official comments.');
      (err as any).statusCode = 403;
      throw err;
    }

    const commentId = `OFFICIAL_BROADCAST_${Date.now()}`;
    const now = new Date().toISOString();
    const commentType = (params.type || 'ANNOUNCEMENT').toUpperCase();
    const isPinned = params.isPinned === true;

    const broadcastComment = {
      id: commentId,
      roomId: params.target === 'GLOBAL' ? 'GLOBAL' : (params.roomIds?.[0] || 'GLOBAL'),
      senderId: admin.id,
      senderNumericId: admin.numericId,
      senderName: 'Aura Official System ⚡',
      senderRole: 'ADMIN',
      senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&auto=format',
      type: commentType,
      content: params.content,
      isOfficial: true,
      isPinned,
      targetAudience: params.target || 'GLOBAL',
      createdAt: now,
    };

    this.officialCommentsHistory.unshift(broadcastComment);

    if (params.target === 'GLOBAL') {
      broadcastGlobal('room.official_comment', {
        roomId: 'GLOBAL',
        comment: broadcastComment,
      });

      if (isPinned) {
        broadcastGlobal('room.pinned_comment', {
          roomId: 'GLOBAL',
          comment: broadcastComment,
        });
      }
    } else if (params.roomIds && params.roomIds.length > 0) {
      for (const rId of params.roomIds) {
        emitToRoom(rId, 'room.official_comment', {
          roomId: rId,
          comment: { ...broadcastComment, roomId: rId },
        });

        if (isPinned) {
          this.pinnedCommentsMap.set(rId, { ...broadcastComment, roomId: rId });
          emitToRoom(rId, 'room.pinned_comment', {
            roomId: rId,
            comment: { ...broadcastComment, roomId: rId },
          });
        }
      }
    }

    return broadcastComment;
  }

  /**
   * 📜 Get Official Comments History for Admin Panel
   */
  static getOfficialCommentsHistory(limit = 100) {
    return this.officialCommentsHistory.slice(0, limit);
  }

  /**
   * 🗑️ Delete Official Comment
   */
  static deleteOfficialComment(commentId: string, adminUserId: number) {
    const idx = this.officialCommentsHistory.findIndex((c) => c.id === commentId);
    if (idx !== -1) {
      const removed = this.officialCommentsHistory.splice(idx, 1)[0];
      if (removed.roomId && this.pinnedCommentsMap.get(removed.roomId)?.id === commentId) {
        this.pinnedCommentsMap.delete(removed.roomId);
        emitToRoom(removed.roomId, 'room.pinned_comment', {
          roomId: removed.roomId,
          comment: null,
        });
      }
      return { success: true, deleted: removed };
    }
    return { success: false, message: 'Comment not found.' };
  }

  /**
   * 🔍 Get Active Room for a given Host User (Prevents Duplicate Go-Live)
   */
  static async getMyActiveRoom(userId: number) {
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      user = await prisma.user.findFirst({
        where: { numericId: userId },
      });
    }
    if (!user) return { hasActiveRoom: false, room: null };

    const activeRoom = await prisma.liveRoom.findFirst({
      where: {
        hostId: user.id,
        status: { in: ['LIVE', 'LOCKED'] },
        endedAt: null,
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

    if (!activeRoom) {
      return { hasActiveRoom: false, room: null };
    }

    const agoraConfig = generateAgoraRtcToken(activeRoom.roomId, user.numericId, RtcRole.PUBLISHER);
    return {
      hasActiveRoom: true,
      room: activeRoom,
      agora: agoraConfig,
    };
  }

  /**
   * 🔍 Get Real-time Room View Info (5 Core Metrics: ID, Members, Rewards, Announcement, Numeric Room Value)
   */
  static async getRoomViewInfo(roomId: string) {
    const room = await prisma.liveRoom.findFirst({
      where: { OR: [{ id: roomId }, { roomId: roomId }] },
      include: {
        host: {
          select: { id: true, numericId: true, username: true, displayName: true, avatar: true, level: true, vipTier: true, countryCode: true },
        },
        viewers: {
          include: {
            user: { select: { id: true, numericId: true, username: true, displayName: true, avatar: true, level: true, vipTier: true } },
          },
        },
        seats: {
          include: {
            user: { select: { id: true, numericId: true, username: true, displayName: true, avatar: true, level: true, vipTier: true } },
          },
          orderBy: { seatNumber: 'asc' },
        },
        roomAdmins: {
          select: { userId: true, role: true },
        },
      },
    });

    if (!room) {
      const err = new Error('Room not found');
      (err as any).statusCode = 404;
      throw err;
    }

    const now = Date.now();
    const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    // 1. Total Diamonds from GiftTransactions for this room
    const allGifts = await prisma.giftTransaction.findMany({
      where: { OR: [{ roomId: room.id }, { roomId: room.roomId }] },
      select: {
        senderId: true,
        totalDiamonds: true,
        totalCoins: true,
        createdAt: true,
      },
    });

    let totalDiamonds = 0;
    let todayDiamonds = 0;
    let weeklyDiamonds = 0;
    const gifterMap: Record<number, number> = {};

    for (const g of allGifts) {
      const diamonds = g.totalDiamonds || 0;
      totalDiamonds += diamonds;
      if (g.createdAt >= dayAgo) {
        todayDiamonds += diamonds;
      }
      if (g.createdAt >= weekAgo) {
        weeklyDiamonds += diamonds;
      }
      gifterMap[g.senderId] = (gifterMap[g.senderId] || 0) + diamonds;
    }

    // Top gifters list
    const topGifterIds = Object.keys(gifterMap)
      .map(Number)
      .sort((a, b) => (gifterMap[b] || 0) - (gifterMap[a] || 0))
      .slice(0, 5);

    let topGifters: any[] = [];
    if (topGifterIds.length > 0) {
      const gifterUsers = await prisma.user.findMany({
        where: { id: { in: topGifterIds } },
        select: { id: true, numericId: true, username: true, displayName: true, avatar: true, level: true, vipTier: true },
      });
      topGifters = topGifterIds.map((id, index) => {
        const u = gifterUsers.find(gu => gu.id === id);
        return {
          rank: index + 1,
          userId: u?.id || id,
          numericId: u?.numericId || id,
          displayName: u?.displayName || u?.username || `User #${id}`,
          avatar: u?.avatar || '',
          level: u?.level || 1,
          vipTier: u?.vipTier || 'FREE',
          diamonds: gifterMap[id] || 0,
        };
      });
    }

    // 2. Active members count
    const seatedCount = room.seats.filter(s => s.userId != null).length;
    const viewerCount = room.viewers.length;
    const activeMemberCount = Math.max(1, seatedCount + viewerCount);

    // 3. Authoritative Numerical Room Value
    // Formula: Total Diamonds * 1.5 + (Total Gifts * 10) + (Peak/Active Viewers * 25) + (Likes * 2) + rankingScore
    const roomValue = Math.floor(
      (totalDiamonds || room.totalDiamonds || 0) * 1.5 +
      (room.totalGifts || 0) * 10 +
      activeMemberCount * 25 +
      (room.likesCount || 0) * 2 +
      (room.rankingScore || 0)
    );

    return {
      success: true,
      data: {
        roomId: room.roomId,
        roomNumber: room.roomId,
        title: room.title,
        description: room.description || '',
        announcement: room.announcement || 'Welcome to our Live Audio Suite! Respect all speakers and enjoy the vibe.',
        cover: room.cover || room.host?.avatar || '',
        category: room.category,
        countryCode: room.countryCode,
        isLocked: room.isLocked,
        status: room.status,
        createdAt: room.createdAt,
        host: {
          id: room.host.id,
          numericId: room.host.numericId,
          displayName: room.host.displayName,
          username: room.host.username,
          avatar: room.host.avatar,
          level: room.host.level,
          vipTier: room.host.vipTier,
        },
        membersCount: activeMemberCount,
        roomValue,
        rewards: {
          totalDiamonds: totalDiamonds || room.totalDiamonds || 0,
          todayDiamonds,
          weeklyDiamonds,
          hostEarnedCoins: Math.floor((totalDiamonds || room.totalDiamonds || 0) * 0.7),
          topGifters,
        },
        adminUserIds: room.roomAdmins.map(a => a.userId),
      },
    };
  }

  /**
   * 📢 Update Room Announcement (Host or Admin only)
   */
  static async updateRoomAnnouncement(roomId: string, userIdentifier: number, announcement: string) {
    const user = await prisma.user.findFirst({
      where: { OR: [{ id: userIdentifier }, { numericId: userIdentifier }] },
    });

    if (!user) {
      const err = new Error('User not found');
      (err as any).statusCode = 404;
      throw err;
    }

    const room = await prisma.liveRoom.findFirst({
      where: { OR: [{ id: roomId }, { roomId: roomId }] },
      include: { roomAdmins: true },
    });

    if (!room) {
      const err = new Error('Room not found');
      (err as any).statusCode = 404;
      throw err;
    }

    const isHost = room.hostId === user.id;
    const isAdmin = room.roomAdmins.some(a => a.userId === user.id);

    if (!isHost && !isAdmin && user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      const err = new Error('Permission denied. Only Room Host or Admins can update the announcement.');
      (err as any).statusCode = 403;
      throw err;
    }

    const updated = await prisma.liveRoom.update({
      where: { id: room.id },
      data: { announcement },
    });

    return {
      success: true,
      roomId: room.roomId,
      announcement: updated.announcement,
      updatedBy: user.numericId,
    };
  }

  /**
   * 🎙️ Move Target User Directly to a Mic Seat (Host / Admin Only)
   */
  static async moveUserToMic(
    roomId: string,
    adminIdentifier: number,
    targetIdentifier: number,
    requestedSeatNumber?: number
  ) {
    const adminUser = await prisma.user.findFirst({
      where: { OR: [{ id: adminIdentifier }, { numericId: adminIdentifier }] },
    });
    if (!adminUser) {
      const err = new Error('Admin user not found');
      (err as any).statusCode = 404;
      throw err;
    }

    const targetUser = await prisma.user.findFirst({
      where: { OR: [{ id: targetIdentifier }, { numericId: targetIdentifier }] },
    });
    if (!targetUser) {
      const err = new Error('Target user not found');
      (err as any).statusCode = 404;
      throw err;
    }

    const room = await prisma.liveRoom.findFirst({
      where: { OR: [{ id: roomId }, { roomId: roomId }] },
      include: { roomAdmins: true },
    });
    if (!room) {
      const err = new Error('Room not found');
      (err as any).statusCode = 404;
      throw err;
    }

    const isHost = room.hostId === adminUser.id;
    const isAdmin = room.roomAdmins.some((a) => a.userId === adminUser.id);
    if (!isHost && !isAdmin && adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPERADMIN') {
      const err = new Error('Permission denied. Only Room Host or Admins can move users to mic.');
      (err as any).statusCode = 403;
      throw err;
    }

    await this.ensureRoomSeats(room.roomId, room.seatCount, room.hostId);

    // If target user already occupies a seat, find it
    const existingSeat = await prisma.liveRoomSeat.findFirst({
      where: { roomId: room.roomId, userId: targetUser.id },
    });

    let targetSeatNumber = requestedSeatNumber;

    if (targetSeatNumber !== undefined && targetSeatNumber > 0) {
      const seat = await prisma.liveRoomSeat.findUnique({
        where: { roomId_seatNumber: { roomId: room.roomId, seatNumber: targetSeatNumber } },
      });
      if (!seat || seat.isLocked || (seat.userId != null && seat.userId !== targetUser.id)) {
        targetSeatNumber = undefined; // fallback to next available
      }
    }

    if (targetSeatNumber === undefined) {
      // Find first free and unlocked seat (starting from seat 1)
      const freeSeat = await prisma.liveRoomSeat.findFirst({
        where: {
          roomId: room.roomId,
          userId: null,
          isLocked: false,
          seatNumber: { gt: 0 },
        },
        orderBy: { seatNumber: 'asc' },
      });

      if (!freeSeat) {
        const err = new Error('No available mic seat.');
        (err as any).statusCode = 400;
        throw err;
      }
      targetSeatNumber = freeSeat.seatNumber;
    }

    // If target user was on another seat, vacate it
    if (existingSeat && existingSeat.seatNumber !== targetSeatNumber) {
      await prisma.liveRoomSeat.update({
        where: { id: existingSeat.id },
        data: { userId: null, isMuted: false },
      });
    }

    // Assign to new seat
    const updatedSeat = await prisma.liveRoomSeat.update({
      where: { roomId_seatNumber: { roomId: room.roomId, seatNumber: targetSeatNumber } },
      data: {
        userId: targetUser.id,
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

    return {
      success: true,
      roomId: room.roomId,
      seatNumber: updatedSeat.seatNumber,
      seat: updatedSeat,
      user: {
        id: targetUser.id,
        numericId: targetUser.numericId,
        displayName: targetUser.displayName,
        username: targetUser.username,
        avatar: targetUser.avatar,
      },
      assignedBy: adminUser.numericId,
    };
  }

  /**
   * 📩 Invite Target User to Take a Mic Seat (Host / Admin Only)
   */
  static async inviteUserToMic(
    roomId: string,
    adminIdentifier: number,
    targetIdentifier: number,
    requestedSeatNumber?: number
  ) {
    const adminUser = await prisma.user.findFirst({
      where: { OR: [{ id: adminIdentifier }, { numericId: adminIdentifier }] },
    });
    if (!adminUser) {
      const err = new Error('Admin user not found');
      (err as any).statusCode = 404;
      throw err;
    }

    const targetUser = await prisma.user.findFirst({
      where: { OR: [{ id: targetIdentifier }, { numericId: targetIdentifier }] },
    });
    if (!targetUser) {
      const err = new Error('Target user not found');
      (err as any).statusCode = 404;
      throw err;
    }

    const room = await prisma.liveRoom.findFirst({
      where: { OR: [{ id: roomId }, { roomId: roomId }] },
      include: { roomAdmins: true },
    });
    if (!room) {
      const err = new Error('Room not found');
      (err as any).statusCode = 404;
      throw err;
    }

    const isHost = room.hostId === adminUser.id;
    const isAdmin = room.roomAdmins.some((a) => a.userId === adminUser.id);
    if (!isHost && !isAdmin && adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPERADMIN') {
      const err = new Error('Permission denied. Only Room Host or Admins can invite users to mic.');
      (err as any).statusCode = 403;
      throw err;
    }

    await this.ensureRoomSeats(room.roomId, room.seatCount, room.hostId);

    // Check if there is at least 1 free unlocked seat
    const freeSeat = await prisma.liveRoomSeat.findFirst({
      where: {
        roomId: room.roomId,
        userId: null,
        isLocked: false,
        seatNumber: { gt: 0 },
      },
    });

    if (!freeSeat) {
      const err = new Error('No available mic seat.');
      (err as any).statusCode = 400;
      throw err;
    }

    return {
      success: true,
      roomId: room.roomId,
      seatNumber: requestedSeatNumber || freeSeat.seatNumber,
      targetUser: {
        id: targetUser.id,
        numericId: targetUser.numericId,
        displayName: targetUser.displayName,
        username: targetUser.username,
      },
      invitedBy: {
        id: adminUser.id,
        numericId: adminUser.numericId,
        displayName: adminUser.displayName,
        username: adminUser.username,
        avatar: adminUser.avatar,
      },
      timeoutSeconds: 20,
    };
  }
}

