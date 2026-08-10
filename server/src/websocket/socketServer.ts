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

    // Live Room Joining
    socket.on('live.join', (data: { roomId: string }) => {
      socket.join(`room_${data.roomId}`);
      io.to(`room_${data.roomId}`).emit('live.viewer_joined', {
        roomId: data.roomId,
        user: { numericId, username: user.username },
        timestamp: new Date().toISOString(),
      });
    });

    // Live Room Leaving
    socket.on('live.leave', (data: { roomId: string }) => {
      socket.leave(`room_${data.roomId}`);
      io.to(`room_${data.roomId}`).emit('live.viewer_left', {
        roomId: data.roomId,
        numericId,
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
      // Broadcast to target user and sender
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
