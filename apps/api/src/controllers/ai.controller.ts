// AI Controller (/api/v1/ai)
import { AiRecommendationService } from '../modules/ai/recommendation.service.js';
import { RoomRankingService } from '../modules/ai/ranking.service.js';
import { TranslationService } from '../modules/ai/translation.service.js';
import { HostAnalyticsService } from '../modules/analytics/host-analytics.service.js';

export class AiController {
  private recommendation = new AiRecommendationService();
  private ranking = new RoomRankingService();
  private translation = new TranslationService();
  private hostAnalytics = new HostAnalyticsService();

  async getRecommendations(userId: string) {
    const mockRooms = [
      { id: '101', roomNumber: '888999', title: '🔥 Late Night Music & Gossip', hostId: 'u-host-101', category: 'Music', language: 'UR', activeUsers: 450 },
      { id: '102', roomNumber: '888100', title: '🎤 Global Vocal Club', hostId: 'u-host-102', category: 'Chat', language: 'EN', activeUsers: 1200 }
    ];

    const recommended = this.recommendation.recommendRooms(userId, mockRooms);
    return {
      success: true,
      data: recommended
    };
  }

  async getTrendingRooms() {
    const r1 = this.ranking.calculateRoomScore({ roomId: '101', activeUsers: 450, giftVolumeCoins: 50000, chatCount: 120, viewDurationAvgSeconds: 450, hostReputationScore: 85 });
    const r2 = this.ranking.calculateRoomScore({ roomId: '102', activeUsers: 1200, giftVolumeCoins: 150000, chatCount: 400, viewDurationAvgSeconds: 600, hostReputationScore: 95 });

    return {
      success: true,
      data: [
        { roomId: '102', title: '🎤 Global Vocal Club', score: r2 },
        { roomId: '101', title: '🔥 Late Night Music & Gossip', score: r1 }
      ]
    };
  }

  async translate(body: { text: string; sourceLang: string; targetLang: string }) {
    return this.translation.translateText(body.text, body.sourceLang, body.targetLang);
  }

  async getCreatorAnalytics(userId: string) {
    return {
      success: true,
      data: this.hostAnalytics.getHostPerformance(userId)
    };
  }
}
