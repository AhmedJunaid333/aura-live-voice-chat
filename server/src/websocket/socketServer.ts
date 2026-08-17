import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt.js';

let ioInstance: SocketIOServer | null = null;
const onlineUsers = new Map<number, Set<string>>(); // numericId -> Set<socketId>

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
    const token = socket.handshake.auth.token || socket.handshake.headers['authorization'];
    if (!token) {
      return next(new Error('Authentication token required for WebSocket'));
    }

    const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
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

    // Join personal user notification room
    socket.join(`user_${numericId}`);
    socket.broadcast.emit('user.online', { numericId, timestamp: new Date().toISOString() });

    console.log(`🔌 [Socket.IO] User Connected: ${user.username} (ID: ${numericId}) [Socket: ${socket.id}]`);

    // 🎙️ Live Room Joining (Supports both live.join and join-room)
    const handleRoomJoin = (data: { roomId: string; userId?: string }) => {
      if (!data?.roomId) return;
      socket.join(`room_${data.roomId}`);
      io.to(`room_${data.roomId}`).emit('live.viewer_joined', {
        roomId: data.roomId,
        user: { numericId, username: user.username },
        timestamp: new Date().toISOString(),
      });
      io.to(`room_${data.roomId}`).emit('room.user.joined', {
        roomId: data.roomId,
        userId: numericId,
        user: { numericId, username: user.username },
        timestamp: new Date().toISOString(),
      });
    };
    socket.on('live.join', handleRoomJoin);
    socket.on('join-room', handleRoomJoin);
    socket.on('join_room', handleRoomJoin);

    // 🚪 Live Room Leaving (Supports both live.leave and leave-room)
    const handleRoomLeave = (data: { roomId: string; userId?: string }) => {
      if (!data?.roomId) return;
      socket.leave(`room_${data.roomId}`);
      io.to(`room_${data.roomId}`).emit('live.viewer_left', {
        roomId: data.roomId,
        numericId,
        timestamp: new Date().toISOString(),
      });
      io.to(`room_${data.roomId}`).emit('room.user.left', {
        roomId: data.roomId,
        userId: numericId,
        timestamp: new Date().toISOString(),
      });
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
    socket.on('room.join.respond', (data: { roomId: string; targetNumericId: number; status: 'ACCEPTED' | 'REJECTED' }) => {
      const eventName = data.status === 'ACCEPTED' ? 'room.join.request.accepted' : 'room.join.request.rejected';
      io.to(`user_${data.targetNumericId}`).emit(eventName, {
        roomId: data.roomId,
        targetNumericId: data.targetNumericId,
        status: data.status,
        timestamp: new Date().toISOString(),
      });
      io.to(`room_${data.roomId}`).emit(eventName, {
        roomId: data.roomId,
        targetNumericId: data.targetNumericId,
        status: data.status,
        timestamp: new Date().toISOString(),
      });
    });
    socket.on('room-join-accept', (data: { roomId: string; targetUserId: string }) => {
      io.to(`room_${data.roomId}`).emit('room.join.request.accepted', {
        roomId: data.roomId,
        targetUserId: data.targetUserId,
        status: 'ACCEPTED',
        timestamp: new Date().toISOString(),
      });
    });
    socket.on('room-join-reject', (data: { roomId: string; targetUserId: string }) => {
      io.to(`room_${data.roomId}`).emit('room.join.request.rejected', {
        roomId: data.roomId,
        targetUserId: data.targetUserId,
        status: 'REJECTED',
        timestamp: new Date().toISOString(),
      });
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

    // Live Room Comment
    socket.on('live.comment', (data: { roomId: string; comment: string }) => {
      io.to(`room_${data.roomId}`).emit('live.comment', {
        roomId: data.roomId,
        sender: { numericId, username: user.username },
        comment: data.comment,
        timestamp: new Date().toISOString(),
      });
    });

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

    // Disconnect Handler
    socket.on('disconnect', () => {
      const userSockets = onlineUsers.get(numericId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(numericId);
          io.emit('user.offline', { numericId, timestamp: new Date().toISOString() });
        }
      }
      console.log(`🔌 [Socket.IO] User Disconnected: ${user.username} (ID: ${numericId})`);
    });
  });

  return io;
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
