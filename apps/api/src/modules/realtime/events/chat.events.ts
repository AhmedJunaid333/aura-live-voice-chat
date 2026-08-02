export enum ChatEventType {
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  EMOJI_SENT = 'EMOJI_SENT'
}

export interface ChatEventPayload {
  event: ChatEventType;
  roomId: string;
  senderId: string;
  senderNickname: string;
  content: string;
  timestamp: number;
}
