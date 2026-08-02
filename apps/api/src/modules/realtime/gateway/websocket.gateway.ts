import { RedisPubSubService } from '../redis/pubsub.service.js';

export class VoiceRoomWebSocketGateway {
  private pubsub = new RedisPubSubService();
  private roomSubscriptions: Map<string, Set<string>> = new Map();

  async handleConnection(socketId: string, userId: string): Promise<void> {
    console.log(`🔌 WebSocket Client Connected: ${socketId} (User: ${userId})`);
  }

  async joinRoomChannel(socketId: string, roomId: string): Promise<void> {
    const roomSet = this.roomSubscriptions.get(roomId) || new Set();
    roomSet.add(socketId);
    this.roomSubscriptions.set(roomId, roomSet);

    // Subscribe socket to Redis PubSub channel
    await this.pubsub.subscribe(`room:${roomId}`, (channel, message) => {
      this.broadcastToRoom(roomId, JSON.parse(message));
    });
  }

  async leaveRoomChannel(socketId: string, roomId: string): Promise<void> {
    const roomSet = this.roomSubscriptions.get(roomId);
    if (roomSet) {
      roomSet.delete(socketId);
      if (roomSet.size === 0) {
        this.roomSubscriptions.delete(roomId);
      }
    }
  }

  async broadcastToRoom(roomId: string, payload: any): Promise<void> {
    // High-concurrency room broadcast
    await this.pubsub.publish(`room:${roomId}`, payload);
  }
}
