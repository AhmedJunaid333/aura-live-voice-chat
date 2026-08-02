// Aura Live Voice Room - RTC Engine Package Entrypoint
export * from './interfaces/rtc-token.interface.js';
export * from './interfaces/rtc-room.interface.js';
export * from './interfaces/rtc-provider.interface.js';

export * from './providers/agora.provider.js';
export * from './providers/livekit.provider.js';
export * from './providers/mock.provider.js';

import { IRTCProvider } from './interfaces/rtc-provider.interface.js';
import { RTCProviderType } from './interfaces/rtc-token.interface.js';
import { RTCProviderConfig } from './interfaces/rtc-room.interface.js';
import { AgoraRTCProvider } from './providers/agora.provider.js';
import { LiveKitRTCProvider } from './providers/livekit.provider.js';
import { MockRTCProvider } from './providers/mock.provider.js';

export class RTCEngineFactory {
  static createProvider(type: RTCProviderType, config: RTCProviderConfig): IRTCProvider {
    switch (type) {
      case 'AGORA':
        return new AgoraRTCProvider(config);
      case 'LIVEKIT':
        return new LiveKitRTCProvider(config);
      case 'MOCK':
      default:
        return new MockRTCProvider();
    }
  }
}
