export class EngagementService {
  private userStreak: Map<string, number> = new Map();

  claimDailyCheckIn(userId: string): { streakDays: number; coinsRewarded: bigint } {
    const currentStreak = (this.userStreak.get(userId) || 0) + 1;
    this.userStreak.set(userId, currentStreak);

    const coinsRewarded = BigInt(currentStreak * 50); // 50 coins * streak
    return {
      streakDays: currentStreak,
      coinsRewarded
    };
  }

  spinLuckyWheel(userId: string): { rewardType: 'COINS' | 'VIP_DAY' | 'BADGE'; rewardAmount: bigint } {
    const rewards: Array<{ rewardType: 'COINS' | 'VIP_DAY' | 'BADGE'; rewardAmount: bigint }> = [
      { rewardType: 'COINS', rewardAmount: BigInt(100) },
      { rewardType: 'COINS', rewardAmount: BigInt(500) },
      { rewardType: 'VIP_DAY', rewardAmount: BigInt(1) },
      { rewardType: 'BADGE', rewardAmount: BigInt(1) }
    ];

    const randomIndex = Math.floor(Math.random() * rewards.length);
    return rewards[randomIndex];
  }
}
