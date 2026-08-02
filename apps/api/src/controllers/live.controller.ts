// Live Controller (/api/v1/live)
import { CreateLiveRoomDto, LiveRoomDto, JoinRoomRequestDto, JoinRoomResponseDto } from '../../../../packages/shared-types/src/index.js';
import { RTCEngineFactory } from '../../../../packages/rtc-engine/src/index.js';

export class LiveController {
  async createRoom(hostId: string, body: CreateLiveRoomDto): Promise<{ success: boolean; data: JoinRoomResponseDto }> {
    const roomId = `room-${Date.now()}`;
    const roomNumber = Math.floor(100000 + Math.random() * 900000).toString();
    const rtcChannelId = `channel_${roomNumber}`;

    const rtcEngine = RTCEngineFactory.createProvider('AGORA', { appId: 'MOCK_AGORA_APP_ID' });
    const rtcTokenResult = await rtcEngine.generateToken({
      channelId: rtcChannelId,
      userId: hostId,
      role: 'HOST' as any
    });

    const room: LiveRoomDto = {
      id: roomId,
      roomNumber,
      title: body.title,
      description: body.description || null,
      coverUrl: body.coverUrl || null,
      hostId,
      hostNickname: 'Room Host',
      hostAvatarUrl: null,
      category: body.category || 'Chat',
      isPrivate: body.isPrivate || false,
      status: 'LIVE',
      maxSeats: body.maxSeats || 9,
      rtcChannelId,
      totalViewers: 1,
      peakViewers: 1,
      startedAt: new Date().toISOString()
    };

    return {
      success: true,
      data: {
        room,
        rtcToken: rtcTokenResult.token,
        userRole: 'HOST',
        seats: Array.from({ length: room.maxSeats }, (_, i) => ({
          id: `seat-${i}`,
          seatIndex: i,
          userId: i === 0 ? hostId : null,
          userNickname: i === 0 ? 'Room Host' : null,
          userAvatarUrl: null,
          status: i === 0 ? 'OCCUPIED' : 'EMPTY',
          isLocked: false,
          isMuted: false
        }))
      }
    };
  }

  async listRooms(category?: string): Promise<{ success: boolean; data: LiveRoomDto[] }> {
    return {
      success: true,
      data: [
        {
          id: 'room-101',
          roomNumber: '888999',
          title: '🔥 Midnight Chill & Songs',
          description: 'Welcome everyone! Singing and audio games.',
          coverUrl: 'https://auralive.app/covers/chill.png',
          hostId: 'u-1001',
          hostNickname: 'Aura Melody',
          hostAvatarUrl: 'https://auralive.app/avatars/melody.png',
          category: category || 'Music',
          isPrivate: false,
          status: 'LIVE',
          maxSeats: 9,
          rtcChannelId: 'channel_888999',
          totalViewers: 450,
          peakViewers: 620,
          startedAt: new Date().toISOString()
        }
      ]
    };
  }

  async joinRoom(userId: string, body: JoinRoomRequestDto): Promise<{ success: boolean; data: JoinRoomResponseDto }> {
    const rtcEngine = RTCEngineFactory.createProvider('AGORA', { appId: 'MOCK_AGORA_APP_ID' });
    const rtcTokenResult = await rtcEngine.generateToken({
      channelId: `channel_${body.roomId}`,
      userId,
      role: 'AUDIENCE' as any
    });

    return {
      success: true,
      data: {
        room: {
          id: body.roomId,
          roomNumber: '888999',
          title: '🔥 Midnight Chill & Songs',
          description: null,
          coverUrl: null,
          hostId: 'u-1001',
          hostNickname: 'Aura Melody',
          hostAvatarUrl: null,
          category: 'Music',
          isPrivate: false,
          status: 'LIVE',
          maxSeats: 9,
          rtcChannelId: `channel_${body.roomId}`,
          totalViewers: 451,
          peakViewers: 620,
          startedAt: new Date().toISOString()
        },
        rtcToken: rtcTokenResult.token,
        userRole: 'LISTENER',
        seats: []
      }
    };
  }

  async leaveRoom(userId: string, roomId: string): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `User ${userId} successfully left room ${roomId}`
    };
  }
}
