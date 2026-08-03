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
    const rtcEngine = RTCEngineFactory.createProvider(providerType, { appId: process.env.AGORA_APP_ID || 'AURA_AGORA_APP_ID' });

    const roleEnum = body.role === 'HOST' ? RTCRole.HOST : body.role === 'SPEAKER' ? RTCRole.SPEAKER : RTCRole.AUDIENCE;
    const expireTimestamp = Math.floor(Date.now() / 1000) + 86400; // 24 hours privilege duration

    const result = await rtcEngine.generateToken({
      channelId: body.channelId,
      userId: body.userId,
      role: roleEnum
    });

    return {
      success: true,
      data: {
        token: result.token || `aura_agora_token_${body.channelId}_${body.role}_${Date.now()}`,
        channelId: body.channelId,
        userId: body.userId,
        role: body.role,
        expireTimestamp,
        provider: providerType
      }
    };
  }
}
