import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt.js';
import { prisma } from '../config/database.js';

let ioInstance: SocketIOServer | null = null;
const onlineUsers = new Map<number, Set<string>>(); // numericId -> Set<socketId>

export interface ActiveMemberData {
  userId: number;
  numericId: number;
  username: string;
  displayName: string;
  avatar: string | null;
  vipTier: number;
  level: number;
  role: 'HOST' | 'SPEAKER' | 'VIEWER';
  seatNumber?: number | null;
  isMuted?: boolean;
  joinedAt: string;
}

// In-memory real-time active room members: roomId -> Map<numericId, ActiveMemberData>
const roomActiveMembers = new Map<string, Map<number, ActiveMemberData>>();
// Map socketId -> Set<roomId> for cleanup on disconnect
const socketToRooms = new Map<string, Set<string>>();

export function initSocketServer(httpServer: HttpServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    pingTimeout: 30000,
    pingInterval: 10000,
  });

  ioInstance = io;

  // Socket Authentication Middleware
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token 
      || socket.handshake.headers?.['authorization']
      || socket.handshake.query?.token;

    if (!token || typeof token !== 'string') {
      return next(new Error('Authentication token required for WebSocket'));
    }

    const cleanToken = token.startsWith('Bearer ') ? token.substring(7).trim() : token.trim();
    const payload = verifyAccessToken(cleanToken);
    if (!payload) {
      return next(new Error('Invalid WebSocket authentication token'));
    }

    socket.data.user = payload;
    next();
  });

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user;
    const numericId = user.numericId;

    // Track online user
    if (!onlineUsers.has(numericId)) {
      onlineUsers.set(numericId, new Set());
    }
    onlineUsers.get(numericId)!.add(socket.id);

    // Track rooms for this socket
    if (!socketToRooms.has(socket.id)) {
      socketToRooms.set(socket.id, new Set());
    }

    // Join personal user notification room
    socket.join(`user_${numericId}`);
    socket.broadcast.emit('user.online', { numericId, timestamp: new Date().toISOString() });

    console.log(`🔌 [Socket.IO] User Connected: ${user.username} (ID: ${numericId}) [Socket: ${socket.id}]`);

    // 🎙️ Live Room Joining with Authoritative Active Members & Snapshot
    const handleRoomJoin = async (data: { roomId: string; userId?: string; userName?: string; displayName?: string }) => {
      if (!data?.roomId) return;
      const roomId = data.roomId;
      const roomChannel = `room_${roomId}`;
      socket.join(roomChannel);
      socketToRooms.get(socket.id)?.add(roomId);

      try {
        // Query database for authoritative user and room status
        const [dbUser, liveRoom] = await Promise.all([
          prisma.user.findUnique({
            where: { id: user.userId },
            select: { id: true, numericId: true, username: true, displayName: true, avatar: true, level: true, vipTier: true },
          }),
          prisma.liveRoom.findUnique({
            where: { roomId },
            include: {
              host: { select: { id: true, numericId: true, username: true, displayName: true, avatar: true, level: true, vipTier: true } },
              seats: {
                where: { userId: { not: null } },
                include: { user: { select: { id: true, numericId: true, username: true, displayName: true, avatar: true, level: true, vipTier: true } } },
              },
            },
          }),
        ]);

        if (!roomActiveMembers.has(roomId)) {
          roomActiveMembers.set(roomId, new Map());
          // Seed roomActiveMembers with Host if room exists
          if (liveRoom?.host) {
            roomActiveMembers.get(roomId)!.set(liveRoom.host.numericId, {
              userId: liveRoom.host.id,
              numericId: liveRoom.host.numericId,
              username: liveRoom.host.username,
              displayName: liveRoom.host.displayName || liveRoom.host.username,
              avatar: liveRoom.host.avatar,
              vipTier: liveRoom.host.vipTier,
              level: liveRoom.host.level,
              role: 'HOST',
              seatNumber: 1,
              isMuted: false,
              joinedAt: liveRoom.createdAt.toISOString(),
            });
          }
          // Seed seated speakers
          if (liveRoom?.seats) {
            for (const s of liveRoom.seats) {
              if (s.user) {
                roomActiveMembers.get(roomId)!.set(s.user.numericId, {
                  userId: s.user.id,
                  numericId: s.user.numericId,
                  username: s.user.username,
                  displayName: s.user.displayName || s.user.username,
                  avatar: s.user.avatar,
                  vipTier: s.user.vipTier,
                  level: s.user.level,
                  role: s.user.id === liveRoom.hostId ? 'HOST' : 'SPEAKER',
                  seatNumber: s.seatNumber,
                  isMuted: s.isMuted,
                  joinedAt: s.createdAt.toISOString(),
                });
              }
            }
          }
        }

        // Determine user's role in this room
        let role: 'HOST' | 'SPEAKER' | 'VIEWER' = 'VIEWER';
        let seatNumber: number | null = null;

        if (liveRoom && liveRoom.hostId === user.userId) {
          role = 'HOST';
          seatNumber = 1;
        } else if (liveRoom?.seats) {
          const occupiedSeat = liveRoom.seats.find((s) => s.userId === user.userId);
          if (occupiedSeat) {
            role = 'SPEAKER';
            seatNumber = occupiedSeat.seatNumber;
          }
        }

        // If viewer, record presence in database
        if (role === 'VIEWER' && liveRoom) {
          await prisma.liveRoomViewer.upsert({
            where: { roomId_userId: { roomId, userId: user.userId } },
            create: { roomId, userId: user.userId, socketId: socket.id, lastSeenAt: new Date() },
            update: { socketId: socket.id, lastSeenAt: new Date() },
          }).catch(() => {});
        }

        const memberData: ActiveMemberData = {
          userId: dbUser?.id || user.userId,
          numericId: dbUser?.numericId || numericId,
          username: dbUser?.username || user.username,
          displayName: dbUser?.displayName || data.displayName || data.userName || user.username,
          avatar: dbUser?.avatar || null,
          vipTier: dbUser?.vipTier || 0,
          level: dbUser?.level || 1,
          role,
          seatNumber,
          isMuted: false,
          joinedAt: new Date().toISOString(),
        };

        roomActiveMembers.get(roomId)!.set(memberData.numericId, memberData);

        const currentMembers = Array.from(roomActiveMembers.get(roomId)!.values());

        // 1. Emit Authoritative Snapshot directly to joining socket
        socket.emit('room.members.snapshot', {
          roomId,
          count: currentMembers.length,
          totalMembers: currentMembers.length,
          members: currentMembers,
          timestamp: new Date().toISOString(),
        });

        // 2. Broadcast user joined event to all participants in this room only
        const joinPayload = {
          roomId,
          userId: memberData.numericId,
          userNumericId: memberData.numericId,
          member: memberData,
          totalMembers: currentMembers.length,
          user: {
            id: memberData.userId,
            numericId: memberData.numericId,
            username: memberData.username,
            displayName: memberData.displayName,
            avatar: memberData.avatar,
            role: memberData.role,
            vipTier: memberData.vipTier,
            level: memberData.level,
          },
          timestamp: new Date().toISOString(),
        };

        // 3. Confirm room join to the connecting socket
        const confirmPayload = {
          roomId,
          userId: user.userId,
          numericId,
          socketId: socket.id,
          timestamp: new Date().toISOString(),
        };
        socket.emit('room.join.confirmed', confirmPayload);
        socket.emit('ROOM_JOIN_CONFIRMED', confirmPayload);

        console.log(`✅ [ROOM_JOIN_CONFIRMED] Room: ${roomId} | User: ${user.username} (numericId: ${numericId}) | Socket: ${socket.id} at ${confirmPayload.timestamp}`);

        io.to(roomChannel).emit('live.viewer_joined', joinPayload);
        io.to(roomChannel).emit('room.user.joined', joinPayload);
        io.to(roomChannel).emit('ROOM_USER_JOINED', joinPayload);
      } catch (err) {
        console.error('❌ [handleRoomJoin Error]', err);
      }
    };
    socket.on('live.join', handleRoomJoin);
    socket.on('join-room', handleRoomJoin);
    socket.on('join_room', handleRoomJoin);

    // 🚪 Live Room Leaving with Realtime Member Removal
    const handleRoomLeave = async (data: { roomId: string; userId?: string }) => {
      if (!data?.roomId) return;
      const roomId = data.roomId;
      socketToRooms.get(socket.id)?.delete(roomId);
      socket.leave(`room_${roomId}`);

      if (roomActiveMembers.has(roomId)) {
        roomActiveMembers.get(roomId)!.delete(numericId);
      }

      await prisma.liveRoomViewer.deleteMany({
        where: { roomId, userId: user.userId },
      }).catch(() => {});

      const newCount = roomActiveMembers.get(roomId)?.size || 0;

      const leavePayload = {
        roomId,
        numericId,
        userId: numericId,
        totalMembers: newCount,
        timestamp: new Date().toISOString(),
      };

      io.to(`room_${roomId}`).emit('live.viewer_left', leavePayload);
      io.to(`room_${roomId}`).emit('room.user.left', leavePayload);
      io.to(`room_${roomId}`).emit('ROOM_USER_LEFT', leavePayload);
    };
    socket.on('live.leave', handleRoomLeave);
    socket.on('leave-room', handleRoomLeave);
    socket.on('leave_room', handleRoomLeave);

    // 🔒 Realtime Room Lock Socket Handler
    socket.on('room.lock', (data: { roomId: string; lockMode?: string }) => {
      io.to(`room_${data.roomId}`).emit('room.locked', {
        roomId: data.roomId,
        isLocked: true,
        lockedBy: user.userId,
        lockedAt: new Date().toISOString(),
      });
      io.emit('room.locked', {
        roomId: data.roomId,
        isLocked: true,
        lockedBy: user.userId,
        hostName: user.username,
        lockedAt: new Date().toISOString(),
      });
    });
    socket.on('room-locked', (data: { roomId: string }) => {
      io.to(`room_${data.roomId}`).emit('room.locked', {
        roomId: data.roomId,
        isLocked: true,
        lockedBy: user.userId,
        lockedAt: new Date().toISOString(),
      });
    });

    // 🔓 Realtime Room Unlock Socket Handler
    socket.on('room.unlock', (data: { roomId: string }) => {
      io.to(`room_${data.roomId}`).emit('room.unlocked', {
        roomId: data.roomId,
        isLocked: false,
        timestamp: new Date().toISOString(),
      });
      io.emit('room.unlocked', {
        roomId: data.roomId,
        isLocked: false,
        timestamp: new Date().toISOString(),
      });
    });
    socket.on('room-unlocked', (data: { roomId: string }) => {
      io.to(`room_${data.roomId}`).emit('room.unlocked', {
        roomId: data.roomId,
        isLocked: false,
        timestamp: new Date().toISOString(),
      });
    });

    // 🙋 Realtime Room Join Request
    const handleJoinRequest = (data: { roomId: string; targetHostNumericId?: number; userName?: string; userAvatar?: string }) => {
      io.to(`room_${data.roomId}`).emit('room.join.requested', {
        requestId: `req_${Date.now()}`,
        roomId: data.roomId,
        userId: user.userId,
        userNumericId: numericId,
        userName: data.userName || user.username,
        userAvatar: data.userAvatar,
        timestamp: new Date().toISOString(),
      });
      if (data.targetHostNumericId) {
        io.to(`user_${data.targetHostNumericId}`).emit('room.join.requested', {
          requestId: `req_${Date.now()}`,
          roomId: data.roomId,
          userId: user.userId,
          userNumericId: numericId,
          userName: data.userName || user.username,
          userAvatar: data.userAvatar,
          timestamp: new Date().toISOString(),
        });
      }
    };
    socket.on('room.join.request', handleJoinRequest);
    socket.on('room-join-request', handleJoinRequest);
    socket.on('seat-request', handleJoinRequest);

    // 👑 Realtime Host Join Request Response (Accept/Reject)
    socket.on('room.join.respond', (data: { roomId: string; targetNumericId: number; status: 'ACCEPTED' | 'REJECTED'; seatIndex?: number }) => {
      const eventName = data.status === 'ACCEPTED' ? 'room.join.request.accepted' : 'room.join.request.rejected';
      const payload = {
        roomId: data.roomId,
        targetNumericId: data.targetNumericId,
        targetUserId: String(data.targetNumericId),
        status: data.status,
        seatIndex: data.seatIndex || 2,
        timestamp: new Date().toISOString(),
      };
      io.to(`user_${data.targetNumericId}`).emit(eventName, payload);
      io.to(`user_${data.targetNumericId}`).emit('ROOM_JOIN_REQUEST_ACCEPTED', payload);
      io.to(`room_${data.roomId}`).emit(eventName, payload);
      io.to(`room_${data.roomId}`).emit('ROOM_JOIN_REQUEST_ACCEPTED', payload);
    });
    socket.on('room-join-accept', (data: { roomId: string; targetUserId: string; targetNumericId?: number; seatIndex?: number }) => {
      const targetNumeric = data.targetNumericId || Number(data.targetUserId);
      const payload = {
        roomId: data.roomId,
        targetUserId: data.targetUserId,
        targetNumericId: targetNumeric,
        status: 'ACCEPTED',
        seatIndex: data.seatIndex || 2,
        timestamp: new Date().toISOString(),
      };
      if (targetNumeric) {
        io.to(`user_${targetNumeric}`).emit('room.join.request.accepted', payload);
        io.to(`user_${targetNumeric}`).emit('ROOM_JOIN_REQUEST_ACCEPTED', payload);
      }
      io.to(`room_${data.roomId}`).emit('room.join.request.accepted', payload);
      io.to(`room_${data.roomId}`).emit('ROOM_JOIN_REQUEST_ACCEPTED', payload);
    });
    socket.on('room-join-reject', (data: { roomId: string; targetUserId: string; targetNumericId?: number }) => {
      const targetNumeric = data.targetNumericId || Number(data.targetUserId);
      const payload = {
        roomId: data.roomId,
        targetUserId: data.targetUserId,
        targetNumericId: targetNumeric,
        status: 'REJECTED',
        timestamp: new Date().toISOString(),
      };
      if (targetNumeric) {
        io.to(`user_${targetNumeric}`).emit('room.join.request.rejected', payload);
        io.to(`user_${targetNumeric}`).emit('ROOM_JOIN_REQUEST_REJECTED', payload);
      }
      io.to(`room_${data.roomId}`).emit('room.join.request.rejected', payload);
      io.to(`room_${data.roomId}`).emit('ROOM_JOIN_REQUEST_REJECTED', payload);
    });

    // 🚫 Realtime Kick User from Room
    const handleKickUser = (data: { roomId: string; targetNumericId?: number; targetUserId?: string; seatIndex?: number }) => {
      const targetId = data.targetNumericId || data.targetUserId;
      if (data.targetNumericId) {
        io.to(`user_${data.targetNumericId}`).emit('room.user.removed', {
          roomId: data.roomId,
          targetNumericId: data.targetNumericId,
          message: 'You have been removed from the room by the host.',
        });
      }
      io.to(`room_${data.roomId}`).emit('room.user.removed', {
        roomId: data.roomId,
        targetUserId: targetId,
        targetNumericId: data.targetNumericId,
      });
    };
    socket.on('room.user.remove', handleKickUser);
    socket.on('host-kick-user', handleKickUser);
    socket.on('room-user-removed', handleKickUser);

    // 🔇 Mic Mute/Unmute Realtime Broadcast
    socket.on('mic-muted', (data: { roomId: string; userId: string; isMuted: boolean }) => {
      io.to(`room_${data.roomId}`).emit('room.mic.muted', {
        roomId: data.roomId,
        userId: data.userId,
        isMuted: data.isMuted,
        timestamp: new Date().toISOString(),
      });
    });
    socket.on('mic-unmuted', (data: { roomId: string; userId: string; isMuted: boolean }) => {
      io.to(`room_${data.roomId}`).emit('room.mic.muted', {
        roomId: data.roomId,
        userId: data.userId,
        isMuted: false,
        timestamp: new Date().toISOString(),
      });
    });

    // ⚙️ Room Settings Relays
    socket.on('room.settings.update', (data: { roomId: string, action: string, payload: any }) => {
      io.to(`room_${data.roomId}`).emit(data.action, {
        roomId: data.roomId,
        ...data.payload,
        updatedBy: numericId,
        timestamp: new Date().toISOString(),
      });
    });

    // 💬 Live Room Comment (Real Profile Resolution, Dynamic Role Mapping, Idempotency & Single Event Broadcast)
    const recentCommentIds = new Set<string>();
    const handleComment = async (data: { roomId: string; comment?: string; message?: string; text?: string; senderName?: string; senderBadge?: string; senderRole?: string; senderAvatar?: string; clientMsgId?: string }) => {
      const rawContent = data.comment || data.message || data.text || '';
      const content = rawContent.trim();
      if (!content || !data?.roomId || content.length > 500) return;

      // 🛡️ Idempotency check: Ignore duplicate submissions with same clientMsgId
      if (data.clientMsgId) {
        if (recentCommentIds.has(data.clientMsgId)) {
          return;
        }
        recentCommentIds.add(data.clientMsgId);
        if (recentCommentIds.size > 1000) {
          const firstKey = recentCommentIds.values().next().value;
          if (firstKey) recentCommentIds.delete(firstKey);
        }
      }

      const commentId = data.clientMsgId || `cmt_${Date.now()}_${numericId}_${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Resolve sender's real database user profile
      const parsedUserId = typeof user.userId === 'number' ? user.userId : (parseInt(String(user.userId).replace(/[^0-9]/g, '')) || 0);
      let dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            ...(parsedUserId > 0 ? [{ id: parsedUserId }] : []),
            { numericId: numericId },
            { username: user.username },
          ],
        },
        select: { id: true, numericId: true, username: true, displayName: true, avatar: true, level: true, vipTier: true },
      }).catch(() => null);

      // 2. Dynamically determine sender's current room role (HOST, GUEST, or USER)
      let senderRole: 'HOST' | 'GUEST' | 'USER' = 'USER';
      if (data.senderBadge === 'HOST' || data.senderRole === 'HOST') {
        senderRole = 'HOST';
      }

      const activeMember = roomActiveMembers.get(data.roomId)?.get(numericId);
      if (activeMember) {
        if (activeMember.role === 'HOST') {
          senderRole = 'HOST';
        } else if (activeMember.role === 'SPEAKER' || (activeMember.seatNumber != null && activeMember.seatNumber > 0)) {
          if (senderRole !== 'HOST') senderRole = 'GUEST';
        }
      }

      if (senderRole === 'USER') {
        const liveRoom = await prisma.liveRoom.findUnique({
          where: { roomId: data.roomId },
          include: { seats: true },
        }).catch(() => null);

        if (liveRoom) {
          const isRoomHost = liveRoom.hostId === dbUser?.id ||
            liveRoom.hostId === parsedUserId ||
            data.roomId.includes(`RM-${numericId}-`) ||
            data.roomId.startsWith(`RM-${numericId}-`);
          if (isRoomHost) {
            senderRole = 'HOST';
          } else if (liveRoom.seats.some((s) => (s.userId === dbUser?.id || s.userId === parsedUserId) && s.status === 'OCCUPIED')) {
            senderRole = 'GUEST';
          }
        } else if (data.roomId.includes(`RM-${numericId}-`) || data.roomId.startsWith(`RM-${numericId}-`)) {
          senderRole = 'HOST';
        }
      }

      const senderAvatar = dbUser?.avatar || data.senderAvatar || null;
      const senderUsername = dbUser?.username || user.username;
      const senderDisplayName = dbUser?.displayName || data.senderName || dbUser?.username || user.username;

      // Ensure socket is joined to room channel
      socket.join(`room_${data.roomId}`);
      socketToRooms.get(socket.id)?.add(data.roomId);

      const payload = {
        id: commentId,
        messageId: commentId,
        clientMsgId: data.clientMsgId || commentId,
        roomId: data.roomId,
        senderId: dbUser?.id || user.userId,
        numericId: dbUser?.numericId || numericId,
        sender: {
          id: dbUser?.id || user.userId,
          numericId: dbUser?.numericId || numericId,
          username: senderUsername,
          displayName: senderDisplayName,
          avatar: senderAvatar,
          role: senderRole,
          badge: senderRole,
          level: dbUser?.level || 1,
          vipTier: dbUser?.vipTier || 0,
        },
        user: senderDisplayName,
        username: senderUsername,
        displayName: senderDisplayName,
        avatar: senderAvatar,
        role: senderRole,
        badge: senderRole,
        comment: content,
        message: content,
        text: content,
        type: 'USER',
        timestamp: new Date().toISOString(),
      };

      // 3. Increment total room comments count in database asynchronously
      prisma.liveRoom.update({
        where: { roomId: data.roomId },
        data: { totalComments: { increment: 1 } },
      }).catch(() => {});

      // 4. Broadcast EXACTLY ONCE to participants in this room only
      io.to(`room_${data.roomId}`).emit('live.comment', payload);
      console.log(`💬 [COMMENT_RENDERED] Room: ${data.roomId} | Message: ${commentId} | From: ${senderUsername} (UID: ${numericId}) | Text: "${content}"`);
    };

    socket.on('live.comment', handleComment);
    socket.on('send-comment', handleComment);

    // Direct Chat Messaging
    socket.on('chat.send', (data: { conversationId: string; targetNumericId: number; message: any }) => {
      io.to(`user_${data.targetNumericId}`).emit('chat.message', data.message);
      socket.emit('chat.message_sent', data.message);
    });

    // Realtime Typing Indicators
    socket.on('chat.typing_start', (data: { conversationId: string; targetNumericId: number }) => {
      io.to(`user_${data.targetNumericId}`).emit('chat.typing_started', {
        conversationId: data.conversationId,
        senderNumericId: numericId,
        username: user.username,
      });
    });

    socket.on('chat.typing_stop', (data: { conversationId: string; targetNumericId: number }) => {
      io.to(`user_${data.targetNumericId}`).emit('chat.typing_stopped', {
        conversationId: data.conversationId,
        senderNumericId: numericId,
      });
    });

    // 👨‍👩‍👧‍👦 Realtime Family Room & Chat Socket Handlers
    socket.on('family.join', (data: { familyId: string }) => {
      socket.join(`room_family_${data.familyId}`);
      io.to(`room_family_${data.familyId}`).emit('family.member.online', {
        familyId: data.familyId,
        numericId,
        username: user.username,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('family.leave', (data: { familyId: string }) => {
      socket.leave(`room_family_${data.familyId}`);
      io.to(`room_family_${data.familyId}`).emit('family.member.offline', {
        familyId: data.familyId,
        numericId,
        username: user.username,
      });
    });

    socket.on('family.chat.send', (data: { familyId: string; message: any }) => {
      io.to(`room_family_${data.familyId}`).emit('family.chat.message', data.message);
    });

    // Disconnect Handler with Automatic Room Member Cleanup
    socket.on('disconnect', async () => {
      const userSockets = onlineUsers.get(numericId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(numericId);
          io.emit('user.offline', { numericId, timestamp: new Date().toISOString() });
        }
      }

      // Clean up user from all rooms this socket joined
      const rooms = socketToRooms.get(socket.id);
      if (rooms && rooms.size > 0) {
        for (const rId of rooms) {
          if (roomActiveMembers.has(rId)) {
            roomActiveMembers.get(rId)!.delete(numericId);
            const remainingCount = roomActiveMembers.get(rId)!.size;
            io.to(`room_${rId}`).emit('live.viewer_left', {
              roomId: rId,
              numericId,
              userId: numericId,
              totalMembers: remainingCount,
              timestamp: new Date().toISOString(),
            });
            io.to(`room_${rId}`).emit('room.user.left', {
              roomId: rId,
              userId: numericId,
              totalMembers: remainingCount,
              timestamp: new Date().toISOString(),
            });
            io.to(`room_${rId}`).emit('ROOM_USER_LEFT', {
              roomId: rId,
              userId: numericId,
              totalMembers: remainingCount,
              timestamp: new Date().toISOString(),
            });
          }
          // Remove from PostgreSQL LiveRoomViewer
          prisma.liveRoomViewer.deleteMany({
            where: { roomId: rId, userId: user.userId },
          }).catch(() => {});
        }
      }
      socketToRooms.delete(socket.id);

      console.log(`🔌 [Socket.IO] User Disconnected: ${user.username} (ID: ${numericId})`);
    });
  });

  return io;
}

export function updateRoomMemberRole(
  roomId: string,
  numericId: number,
  role: 'HOST' | 'SPEAKER' | 'VIEWER',
  seatNumber?: number | null,
  isMuted?: boolean
): void {
  if (roomActiveMembers.has(roomId) && roomActiveMembers.get(roomId)!.has(numericId)) {
    const member = roomActiveMembers.get(roomId)!.get(numericId)!;
    member.role = role;
    if (seatNumber !== undefined) member.seatNumber = seatNumber;
    if (isMuted !== undefined) member.isMuted = isMuted;

    if (ioInstance) {
      ioInstance.to(`room_${roomId}`).emit('room.member.updated', {
        roomId,
        member,
        totalMembers: roomActiveMembers.get(roomId)!.size,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export function getIO(): SocketIOServer {
  if (!ioInstance) {
    throw new Error('Socket.IO is not initialized');
  }
  return ioInstance;
}

export function emitToUser(numericId: number, event: string, payload: any): void {
  if (ioInstance) {
    ioInstance.to(`user_${numericId}`).emit(event, payload);
  }
}

export function emitToRoom(roomId: string, event: string, payload: any): void {
  if (ioInstance) {
    ioInstance.to(`room_${roomId}`).emit(event, payload);
  }
}

export function broadcastGlobal(event: string, payload: any): void {
  if (ioInstance) {
    ioInstance.emit(event, payload);
  }
}

export function getRoomActiveMembers(roomId: string): ActiveMemberData[] {
  if (roomActiveMembers.has(roomId)) {
    return Array.from(roomActiveMembers.get(roomId)!.values());
  }
  return [];
}

