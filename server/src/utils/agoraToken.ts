import pkg from 'agora-token';
const { RtcTokenBuilder, RtcRole: AgoraRtcRole } = pkg;
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
  const privilegeExpiredTs = currentTimestamp + expireTimeSeconds;

  let token = '';

  if (appCertificate && appCertificate.length > 5) {
    try {
      const agoraRole = role === RtcRole.PUBLISHER ? AgoraRtcRole.PUBLISHER : AgoraRtcRole.SUBSCRIBER;
      token = RtcTokenBuilder.buildTokenWithUid(
        appId,
        appCertificate,
        channelName,
        uid,
        agoraRole,
        expireTimeSeconds,
        privilegeExpiredTs
      );
    } catch (err) {
      console.warn('⚠️ Agora token builder fallback:', err);
      token = `006${appId}${channelName}${uid}${privilegeExpiredTs}`;
    }
  } else {
    token = `006${appId}${channelName}${uid}${privilegeExpiredTs}`;
  }

  return {
    token,
    appId,
    channel: channelName,
    uid,
    expiresAt: privilegeExpiredTs,
  };
}

