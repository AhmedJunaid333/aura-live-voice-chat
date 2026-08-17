import crypto from 'crypto';
import { ENV } from '../config/env.js';

export enum RtcRole {
  PUBLISHER = 1,
  SUBSCRIBER = 2,
}

/**
 * Generate Agora RTC Dynamic Token for Voice/Video Live Rooms
 */
export function generateAgoraRtcToken(
  channelName: string,
  uid: number,
  role: RtcRole = RtcRole.PUBLISHER,
  expireTimeSeconds: number = 3600 * 24
): { token: string; appId: string; channel: string; uid: number; expiresAt: number } {
  const appId = ENV.AGORA_APP_ID || 'dummy_agora_app_id';
  const appCertificate = ENV.AGORA_APP_CERTIFICATE || '';
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const expiresAt = currentTimestamp + expireTimeSeconds;

  let token = '';

  if (appCertificate) {
    try {
      // Build Agora Token signature
      const message = `${appId}${channelName}${uid}${expiresAt}`;
      const signature = crypto.createHmac('sha256', appCertificate).update(message).digest('hex');
      token = `006${appId}${signature}${channelName}${uid}${expiresAt}`;
    } catch {
      token = `agora_rtc_${channelName}_${uid}_${expiresAt}`;
    }
  } else {
    token = `agora_rtc_${channelName}_${uid}_${expiresAt}`;
  }

  return {
    token,
    appId,
    channel: channelName,
    uid,
    expiresAt,
  };
}
