export interface UserInterestProfileData {
  userId: string;
  favoriteCategories: string[];
  followedHostIds: string[];
  preferredLanguages: string[];
  giftPropensityScore: number;
}

export interface LiveRoomScored {
  roomId: string;
  roomNumber: string;
  title: string;
  hostId: string;
  category: string;
  language: string;
  activeUsers: number;
  recommendationScore: number;
}

export class AiRecommendationService {
  private userProfiles: Map<string, UserInterestProfileData> = new Map();
  private userBehaviorEvents: Array<{ userId: string; event: string; roomId?: string; timestamp: number }> = [];

  recordEvent(userId: string, event: 'ROOM_JOINED' | 'ROOM_LEFT' | 'GIFT_SENT' | 'HOST_FOLLOWED' | 'SEARCH_USED' | 'WATCH_DURATION', roomId?: string): void {
    this.userBehaviorEvents.push({ userId, event, roomId, timestamp: Date.now() });

    // Dynamic Interest Profile Update
    const profile = this.getUserProfile(userId);
    if (event === 'GIFT_SENT' && profile.giftPropensityScore < 0.95) {
      profile.giftPropensityScore = Math.min(1.0, profile.giftPropensityScore + 0.05);
    }
  }

  getUserProfile(userId: string): UserInterestProfileData {
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, {
        userId,
        favoriteCategories: ['Music', 'Chat'],
        followedHostIds: ['u-host-101'],
        preferredLanguages: ['UR', 'EN'],
        giftPropensityScore: 0.60
      });
    }
    return this.userProfiles.get(userId)!;
  }

  recommendRooms(userId: string, availableRooms: Array<{ id: string; roomNumber: string; title: string; hostId: string; category: string; language: string; activeUsers: number }>): LiveRoomScored[] {
    const profile = this.getUserProfile(userId);

    const scoredRooms = availableRooms.map(room => {
      let score = 0;

      // 1. Category Affinity Match
      if (profile.favoriteCategories.includes(room.category)) score += 35;

      // 2. Followed Host Affinity Match
      if (profile.followedHostIds.includes(room.hostId)) score += 40;

      // 3. Language Preference Match
      if (profile.preferredLanguages.includes(room.language)) score += 15;

      // 4. Popularity multiplier
      score += Math.min(10, room.activeUsers / 50);

      return {
        roomId: room.id,
        roomNumber: room.roomNumber,
        title: room.title,
        hostId: room.hostId,
        category: room.category,
        language: room.language,
        activeUsers: room.activeUsers,
        recommendationScore: parseFloat(score.toFixed(2))
      };
    });

    return scoredRooms.sort((a, b) => b.recommendationScore - a.recommendationScore);
  }
}
