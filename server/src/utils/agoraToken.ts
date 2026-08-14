// @ts-ignore
import { RtcTokenBuilder2, RtcRole as AgoraRtcRole } from 'agora-token';
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
  const expiresAt = currentTimestamp + expireTimeSeconds;

  const token = RtcTokenBuilder2.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    role as unknown as AgoraRtcRole,
    expireTimeSeconds,
    expireTimeSeconds
  );

  return {
    token,
    appId,
    channel: channelName,
    uid,
    expiresAt,
  };
}
