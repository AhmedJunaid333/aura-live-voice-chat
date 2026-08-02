export interface VipLevelConfig {
  tier: number;
  title: string;
  priceCoins: bigint;
  discountPercentage: number;
  badgeUrl: string;
  frameUrl: string;
  entryEffectUrl: string;
}

export class VipService {
  private vipLevels: Map<number, VipLevelConfig> = new Map();
  private userVips: Map<string, { tier: number; expiresAt: Date }> = new Map();

  constructor() {
    // Seed VIP Tiers 1-7
    for (let i = 1; i <= 7; i++) {
      this.vipLevels.set(i, {
        tier: i,
        title: `VIP Level ${i}`,
        priceCoins: BigInt(i * 10000),
        discountPercentage: i * 2, // 2% discount per VIP tier
        badgeUrl: `https://auralive.app/vip/badges/vip_${i}.png`,
        frameUrl: `https://auralive.app/vip/frames/frame_${i}.png`,
        entryEffectUrl: `https://auralive.app/vip/effects/entry_${i}.mp4`
      });
    }
  }

  getVipLevels(): VipLevelConfig[] {
    return Array.from(this.vipLevels.values());
  }

  getUserVip(userId: string): { tier: number; discount: number; frameUrl?: string; entryEffectUrl?: string } {
    const userVip = this.userVips.get(userId);
    if (!userVip || userVip.expiresAt < new Date()) {
      return { tier: 0, discount: 0 };
    }
    const levelConfig = this.vipLevels.get(userVip.tier);
    return {
      tier: userVip.tier,
      discount: levelConfig?.discountPercentage || 0,
      frameUrl: levelConfig?.frameUrl,
      entryEffectUrl: levelConfig?.entryEffectUrl
    };
  }

  purchaseVip(userId: string, tier: number): { success: boolean; expiresAt: Date; tier: number } {
    const config = this.vipLevels.get(tier);
    if (!config) throw new Error(`Invalid VIP tier: ${tier}`);

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 Days
    this.userVips.set(userId, { tier, expiresAt });

    return { success: true, tier, expiresAt };
  }
}
