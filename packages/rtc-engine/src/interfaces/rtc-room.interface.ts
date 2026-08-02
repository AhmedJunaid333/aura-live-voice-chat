import { RTCRole } from './rtc-token.interface.js';

export interface SpeakerStatus {
  userId: string;
  isMuted: boolean;
  audioVolume: number;
}

export interface RTCRoomSession {
  channelId: string;
  activeSpeakers: SpeakerStatus[];
  totalConnected: number;
}

export interface RTCProviderConfig {
  appId: string;
  appCertificate?: string;
  apiUrl?: string;
}
