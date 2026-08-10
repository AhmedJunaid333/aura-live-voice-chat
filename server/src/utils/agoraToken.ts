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
  const appId = ENV.AGORA_APP_ID;
  const appCertificate = ENV.AGORA_APP_CERTIFICATE;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expireTimeSeconds;

  // Simple token signature mechanism for RTC channel authorization
  const rawSignature = `${appId}${channelName}${uid}${role}${privilegeExpiredTs}`;
  const signature = crypto
    .createHmac('sha256', appCertificate)
    .update(rawSignature)
    .digest('hex');

  const token = `AGORA_V1_${appId}_${signature}_${privilegeExpiredTs}`;

  return {
    token,
    appId,
    channel: channelName,
    uid,
    expiresAt: privilegeExpiredTs,
  };
}
