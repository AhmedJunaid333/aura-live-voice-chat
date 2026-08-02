export enum SeatEventType {
  SEAT_REQUESTED = 'SEAT_REQUESTED',
  SEAT_ACCEPTED = 'SEAT_ACCEPTED',
  SEAT_REJECTED = 'SEAT_REJECTED',
  MIC_MUTED = 'MIC_MUTED',
  MIC_UNMUTED = 'MIC_UNMUTED',
  SPEAKER_REMOVED = 'SPEAKER_REMOVED'
}

export interface SeatEventPayload {
  event: SeatEventType;
  roomId: string;
  userId: string;
  seatIndex: number;
  timestamp: number;
  isMuted?: boolean;
}
