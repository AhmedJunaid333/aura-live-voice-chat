// RTC Token Controller (/api/v1/rtc)
import { RTCEngineFactory, RTCRole } from '../../../../packages/rtc-engine/src/index.js';

export interface RtcTokenRequestDto {
  channelId: string;
  userId: string;
  role: 'HOST' | 'SPEAKER' | 'AUDIENCE';
  provider?: 'AGORA' | 'LIVEKIT' | 'MOCK';
}

export class RtcController {
  async generateToken(body: RtcTokenRequestDto) {
    const providerType = body.provider || 'AGORA';
    const rtcEngine = RTCEngineFactory.createProvider(providerType, { appId: 'AURA_AGORA_APP_ID' });

    const roleEnum = body.role === 'HOST' ? RTCRole.HOST : body.role === 'SPEAKER' ? RTCRole.SPEAKER : RTCRole.AUDIENCE;

    const result = await rtcEngine.generateToken({
      channelId: body.channelId,
      userId: body.userId,
      role: roleEnum
    });

    return {
      success: true,
      data: result
    };
  }
}
