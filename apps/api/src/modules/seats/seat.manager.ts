import { SeatEventType } from '../realtime/events/seat.events.js';
import { VoiceRoomWebSocketGateway } from '../realtime/gateway/websocket.gateway.js';

export enum SeatState {
  EMPTY = 'EMPTY',
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  LIVE_SPEAKER = 'LIVE_SPEAKER',
  MUTED = 'MUTED'
}

export interface SeatData {
  seatIndex: number;
  userId: string | null;
  state: SeatState;
  isMuted: boolean;
  requestedAt?: number;
  occupiedAt?: number;
}

export class SeatManager {
  private roomSeats: Map<string, Map<number, SeatData>> = new Map();
  private locks: Set<string> = new Set(); // Distributed Redis Lock Emulator

  constructor(private gateway: VoiceRoomWebSocketGateway) {}

  private acquireLock(key: string): boolean {
    if (this.locks.has(key)) return false;
    this.locks.add(key);
    return true;
  }

  private releaseLock(key: string): void {
    this.locks.delete(key);
  }

  private getSeatsMap(roomId: string): Map<number, SeatData> {
    if (!this.roomSeats.has(roomId)) {
      const seats = new Map<number, SeatData>();
      for (let i = 0; i < 9; i++) {
        seats.set(i, { seatIndex: i, userId: null, state: SeatState.EMPTY, isMuted: false });
      }
      this.roomSeats.set(roomId, seats);
    }
    return this.roomSeats.get(roomId)!;
  }

  async requestSeat(roomId: string, seatIndex: number, userId: string): Promise<boolean> {
    const lockKey = `lock:seat:${roomId}:${seatIndex}`;
    if (!this.acquireLock(lockKey)) {
      throw new Error('Concurrent seat transaction locked');
    }

    try {
      const seats = this.getSeatsMap(roomId);
      const seat = seats.get(seatIndex);

      if (!seat || seat.state !== SeatState.EMPTY) {
        return false;
      }

      seat.state = SeatState.REQUESTED;
      seat.userId = userId;
      seat.requestedAt = Date.now();

      await this.gateway.broadcastToRoom(roomId, {
        event: SeatEventType.SEAT_REQUESTED,
        roomId,
        userId,
        seatIndex,
        timestamp: Date.now()
      });

      return true;
    } finally {
      this.releaseLock(lockKey);
    }
  }

  async approveSeat(roomId: string, seatIndex: number, hostId: string, userId: string): Promise<boolean> {
    const lockKey = `lock:seat:${roomId}:${seatIndex}`;
    if (!this.acquireLock(lockKey)) return false;

    try {
      const seats = this.getSeatsMap(roomId);
      const seat = seats.get(seatIndex);

      if (!seat || seat.userId !== userId || seat.state !== SeatState.REQUESTED) {
        return false;
      }

      seat.state = SeatState.LIVE_SPEAKER;
      seat.occupiedAt = Date.now();

      await this.gateway.broadcastToRoom(roomId, {
        event: SeatEventType.SEAT_ACCEPTED,
        roomId,
        userId,
        seatIndex,
        timestamp: Date.now()
      });

      return true;
    } finally {
      this.releaseLock(lockKey);
    }
  }

  async rejectSeat(roomId: string, seatIndex: number, hostId: string, userId: string): Promise<boolean> {
    const seats = this.getSeatsMap(roomId);
    const seat = seats.get(seatIndex);

    if (!seat || seat.userId !== userId) return false;

    seat.state = SeatState.EMPTY;
    seat.userId = null;

    await this.gateway.broadcastToRoom(roomId, {
      event: SeatEventType.SEAT_REJECTED,
      roomId,
      userId,
      seatIndex,
      timestamp: Date.now()
    });

    return true;
  }

  async leaveSeat(roomId: string, seatIndex: number, userId: string): Promise<boolean> {
    const seats = this.getSeatsMap(roomId);
    const seat = seats.get(seatIndex);

    if (!seat || seat.userId !== userId) return false;

    seat.state = SeatState.EMPTY;
    seat.userId = null;
    seat.isMuted = false;

    await this.gateway.broadcastToRoom(roomId, {
      event: SeatEventType.SPEAKER_REMOVED,
      roomId,
      userId,
      seatIndex,
      timestamp: Date.now()
    });

    return true;
  }

  async muteSpeaker(roomId: string, seatIndex: number, hostId: string, isMuted: boolean): Promise<boolean> {
    const seats = this.getSeatsMap(roomId);
    const seat = seats.get(seatIndex);

    if (!seat || !seat.userId) return false;

    seat.isMuted = isMuted;
    if (isMuted) seat.state = SeatState.MUTED;
    else if (seat.state === SeatState.MUTED) seat.state = SeatState.LIVE_SPEAKER;

    await this.gateway.broadcastToRoom(roomId, {
      event: isMuted ? SeatEventType.MIC_MUTED : SeatEventType.MIC_UNMUTED,
      roomId,
      userId: seat.userId,
      seatIndex,
      isMuted,
      timestamp: Date.now()
    });

    return true;
  }

  async removeSpeaker(roomId: string, seatIndex: number, hostId: string): Promise<boolean> {
    const seats = this.getSeatsMap(roomId);
    const seat = seats.get(seatIndex);

    if (!seat || !seat.userId) return false;

    const removedUserId = seat.userId;
    seat.state = SeatState.EMPTY;
    seat.userId = null;

    await this.gateway.broadcastToRoom(roomId, {
      event: SeatEventType.SPEAKER_REMOVED,
      roomId,
      userId: removedUserId,
      seatIndex,
      timestamp: Date.now()
    });

    return true;
  }

  getRoomSeats(roomId: string): SeatData[] {
    const seats = this.getSeatsMap(roomId);
    return Array.from(seats.values());
  }
}
