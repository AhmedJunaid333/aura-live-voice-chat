import { RTCChannelOptions, RTCTokenResult, RTCProviderType, RTCRole } from './rtc-token.interface.js';
import { SpeakerStatus } from './rtc-room.interface.js';

export interface IRTCProvider {
  readonly providerType: RTCProviderType;

  /**
   * Generates authentication token for joining an RTC audio channel
   */
  generateToken(options: RTCChannelOptions): Promise<RTCTokenResult>;

  /**
   * Evicts/kicks a participant from an active channel
   */
  kickUser(channelId: string, userId: string): Promise<boolean>;

  /**
   * Modifies participant stream mute state
   */
  setMuteState(channelId: string, userId: string, isMuted: boolean): Promise<boolean>;

  /**
   * Switches user role between Host/Speaker and Audience
   */
  switchRole(channelId: string, userId: string, newRole: RTCRole): Promise<boolean>;

  /**
   * Retrieves current active speakers and audio volumes
   */
  getSpeakerLevels(channelId: string): Promise<SpeakerStatus[]>;

  /**
   * Performs provider heartbeat health check
   */
  heartbeat(): Promise<boolean>;
}
