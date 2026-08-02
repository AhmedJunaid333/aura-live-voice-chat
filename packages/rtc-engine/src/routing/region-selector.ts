export type RtcRegionCode = 'asia-south' | 'me-central' | 'eu-west' | 'us-east';

export interface RtcEdgeNode {
  region: RtcRegionCode;
  endpointUrl: string;
  latencyMs: number;
  isHealthy: boolean;
}

export class MultiRegionRtcRouter {
  private edgeNodes: Map<RtcRegionCode, RtcEdgeNode> = new Map([
    ['asia-south', { region: 'asia-south', endpointUrl: 'https://rtc-asia.auralive.app', latencyMs: 25, isHealthy: true }],
    ['me-central', { region: 'me-central', endpointUrl: 'https://rtc-me.auralive.app', latencyMs: 40, isHealthy: true }],
    ['eu-west', { region: 'eu-west', endpointUrl: 'https://rtc-eu.auralive.app', latencyMs: 90, isHealthy: true }],
    ['us-east', { region: 'us-east', endpointUrl: 'https://rtc-us.auralive.app', latencyMs: 140, isHealthy: true }]
  ]);

  selectBestRegion(clientCountryCode: string): RtcEdgeNode {
    let preferredRegion: RtcRegionCode = 'asia-south';

    if (['PK', 'IN', 'BD', 'LK'].includes(clientCountryCode)) {
      preferredRegion = 'asia-south';
    } else if (['AE', 'SA', 'QA', 'KW', 'OM', 'BH'].includes(clientCountryCode)) {
      preferredRegion = 'me-central';
    } else if (['GB', 'DE', 'FR', 'NL', 'IT', 'ES'].includes(clientCountryCode)) {
      preferredRegion = 'eu-west';
    } else {
      preferredRegion = 'us-east';
    }

    const node = this.edgeNodes.get(preferredRegion);
    if (node && node.isHealthy) return node;

    // Failover to healthiest fallback region
    for (const fallback of Array.from(this.edgeNodes.values())) {
      if (fallback.isHealthy) return fallback;
    }

    throw new Error('All RTC Edge nodes unavailable');
  }
}
