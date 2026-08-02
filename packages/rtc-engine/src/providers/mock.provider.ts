import { IRTCProvider } from '../interfaces/rtc-provider.interface.js';
import { RTCChannelOptions, RTCTokenResult, RTCProviderType, RTCRole } from '../interfaces/rtc-token.interface.js';
import { SpeakerStatus } from '../interfaces/rtc-room.interface.js';

export class MockRTCProvider implements IRTCProvider {
  readonly providerType: RTCProviderType = 'MOCK';

  async generateToken(options: RTCChannelOptions): Promise<RTCTokenResult> {
    const expiresAt = Math.floor(Date.now() / 1000) + 86400;
    return {
      token: `MOCK_RTC_TOKEN_${options.channelId}_${options.userId}`,
      channelId: options.channelId,
      userId: options.userId,
      role: options.role,
      expiresAt,
      provider: 'MOCK'
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
    return [
      { userId: 'u-host', isMuted: false, audioVolume: 85 },
      { userId: 'u-speaker-1', isMuted: false, audioVolume: 40 }
    ];
  }

  async heartbeat(): Promise<boolean> {
    return true;
  }
}
