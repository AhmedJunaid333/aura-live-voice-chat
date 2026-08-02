export interface RankingWeights {
  activeUsersWeight: number; // 0.30 (30%)
  giftVolumeWeight: number; // 0.25 (25%)
  chatEngagementWeight: number; // 0.20 (20%)
  viewDurationWeight: number; // 0.15 (15%)
  hostReputationWeight: number; // 0.10 (10%)
}

export interface RoomMetricsInput {
  roomId: string;
  activeUsers: number;
  giftVolumeCoins: number;
  chatCount: number;
  viewDurationAvgSeconds: number;
  hostReputationScore: number;
}

export class RoomRankingService {
  private weights: RankingWeights = {
    activeUsersWeight: 0.30,
    giftVolumeWeight: 0.25,
    chatEngagementWeight: 0.20,
    viewDurationWeight: 0.15,
    hostReputationWeight: 0.10
  };

  updateWeights(newWeights: Partial<RankingWeights>): RankingWeights {
    this.weights = { ...this.weights, ...newWeights };
    return this.weights;
  }

  calculateRoomScore(metrics: RoomMetricsInput): number {
    // Normalized component scores
    const activeUsersScore = Math.min(100, metrics.activeUsers * 2);
    const giftVolumeScore = Math.min(100, metrics.giftVolumeCoins / 100);
    const chatEngagementScore = Math.min(100, metrics.chatCount * 5);
    const viewDurationScore = Math.min(100, metrics.viewDurationAvgSeconds / 10);
    const hostReputationScore = Math.min(100, metrics.hostReputationScore);

    const totalScore =
      activeUsersScore * this.weights.activeUsersWeight +
      giftVolumeScore * this.weights.giftVolumeWeight +
      chatEngagementScore * this.weights.chatEngagementWeight +
      viewDurationScore * this.weights.viewDurationWeight +
      hostReputationScore * this.weights.hostReputationWeight;

    return parseFloat(totalScore.toFixed(2));
  }
}
