export type CreatorTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Legend';

export interface HostPerformanceSummary {
  userId: string;
  tier: CreatorTier;
  totalLiveMinutes: number;
  viewerRetentionRate: number; // 0.00 to 1.00
  giftConversionRate: number;  // 0.00 to 1.00
  totalDiamondsEarned: bigint;
}

export class HostAnalyticsService {
  calculateCreatorTier(totalLiveMinutes: number, totalDiamonds: bigint): CreatorTier {
    const diamondsNum = Number(totalDiamonds);

    if (totalLiveMinutes >= 6000 && diamondsNum >= 1000000) return 'Legend';
    if (totalLiveMinutes >= 3000 && diamondsNum >= 500000) return 'Diamond';
    if (totalLiveMinutes >= 1500 && diamondsNum >= 200000) return 'Platinum';
    if (totalLiveMinutes >= 600 && diamondsNum >= 50000) return 'Gold';
    if (totalLiveMinutes >= 200 && diamondsNum >= 10000) return 'Silver';
    return 'Bronze';
  }

  getHostPerformance(userId: string): HostPerformanceSummary {
    const totalLiveMinutes = 1800;
    const totalDiamondsEarned = BigInt(250000);
    const tier = this.calculateCreatorTier(totalLiveMinutes, totalDiamondsEarned);

    return {
      userId,
      tier,
      totalLiveMinutes,
      viewerRetentionRate: 0.78,
      giftConversionRate: 0.18,
      totalDiamondsEarned
    };
  }
}
