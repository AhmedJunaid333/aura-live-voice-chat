import { IRTCProvider } from '../interfaces/rtc-provider.interface.js';
import { RTCChannelOptions, RTCTokenResult, RTCProviderType, RTCRole } from '../interfaces/rtc-token.interface.js';
import { SpeakerStatus, RTCProviderConfig } from '../interfaces/rtc-room.interface.js';

export class LiveKitRTCProvider implements IRTCProvider {
  readonly providerType: RTCProviderType = 'LIVEKIT';

  constructor(private config: RTCProviderConfig) {}

  async generateToken(options: RTCChannelOptions): Promise<RTCTokenResult> {
    const expiration = options.expirationSeconds || 86400;
    const expiresAt = Math.floor(Date.now() / 1000) + expiration;

    const rawToken = `LIVEKIT_JWT_TOKEN:${this.config.appId}:${options.channelId}:${options.userId}:${expiresAt}`;

    return {
      token: rawToken,
      channelId: options.channelId,
      userId: options.userId,
      role: options.role,
      expiresAt,
      provider: 'LIVEKIT'
    };
  }

  async kickUser(channelId: string, userId: string): Promise<boolean> {
    return true;
  }

  async setMuteState(channelId: string, userId: string, isMuted: boolean): Promise<boolean> {
    return true;
  }

  async switchRole(channelId: string, userId: string, newRole: RTCRole): Promise<boolean> {
    return true;
  }

  async getSpeakerLevels(channelId: string): Promise<SpeakerStatus[]> {
    return [];
  }

  async heartbeat(): Promise<boolean> {
    return true;
  }
}
