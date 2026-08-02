export enum RoomEventType {
  ROOM_CREATED = 'ROOM_CREATED',
  ROOM_STARTED = 'ROOM_STARTED',
  USER_JOINED = 'USER_JOINED',
  USER_LEFT = 'USER_LEFT',
  ROOM_CLOSED = 'ROOM_CLOSED'
}

export interface RoomEventPayload {
  event: RoomEventType;
  roomId: string;
  userId?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}
