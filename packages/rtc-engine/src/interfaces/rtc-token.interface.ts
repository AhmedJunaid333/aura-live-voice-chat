export type RTCProviderType = 'AGORA' | 'LIVEKIT' | 'MOCK' | 'WEBRTC';

export enum RTCRole {
  HOST = 'HOST',
  SPEAKER = 'SPEAKER',
  AUDIENCE = 'AUDIENCE'
}

export interface RTCChannelOptions {
  channelId: string;
  userId: string;
  role: RTCRole;
  expirationSeconds?: number;
}

export interface RTCTokenResult {
  token: string;
  channelId: string;
  userId: string;
  role: RTCRole;
  expiresAt: number;
  provider: RTCProviderType;
}
