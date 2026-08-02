export enum GiftEventType {
  GIFT_SENT = 'GIFT_SENT'
}

export interface GiftEventPayload {
  event: GiftEventType;
  roomId: string;
  senderId: string;
  senderNickname: string;
  receiverId: string;
  receiverNickname: string;
  giftId: string;
  giftName: string;
  giftCount: number;
  animationUrl?: string | null;
  timestamp: number;
}
