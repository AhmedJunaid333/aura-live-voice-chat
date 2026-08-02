// Users Controller (/api/v1/users)
import { UserProfileDto } from '../../../../packages/shared-types/src/index.js';

export class UsersController {
  async getProfile(userId: string): Promise<{ success: boolean; data: UserProfileDto }> {
    return {
      success: true,
      data: {
        id: userId,
        userTag: 'aura_superstar',
        nickname: 'Aura Superstar',
        email: 'star@auralive.app',
        phone: '+1234567890',
        avatarUrl: 'https://auralive.app/avatars/star.png',
        bio: 'Official Host on Aura Live Voice Room',
        gender: 'FEMALE',
        level: 15,
        vipTier: 3,
        isVerifiedHost: true,
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      }
    };
  }
}
