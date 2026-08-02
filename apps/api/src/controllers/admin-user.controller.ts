// Admin User Controller (/api/v1/admin/users)
import { ModerationService } from '../modules/moderation/moderation.service.js';
import { AdminAuditService } from '../modules/admin/audit.service.js';

export class AdminUserController {
  private moderation = new ModerationService();
  private audit = new AdminAuditService();

  async getUsers(search?: string, countryCode?: string) {
    return {
      success: true,
      data: [
        { id: 'u-101', userTag: 'superstar_1', nickname: 'Aura Melody', countryCode: 'PK', status: 'ACTIVE', level: 15, vipTier: 3 },
        { id: 'u-102', userTag: 'bad_user_99', nickname: 'Spammer', countryCode: 'IN', status: 'BANNED', level: 1, vipTier: 0 }
      ]
    };
  }

  async banUser(adminId: string, userId: string, reason: string) {
    this.moderation.banUser(userId, reason);
    await this.audit.logAction({
      adminId,
      action: 'BAN_USER',
      targetType: 'USER',
      targetId: userId,
      oldValue: { status: 'ACTIVE' },
      newValue: { status: 'BANNED', reason }
    });

    return {
      success: true,
      message: `User ${userId} banned successfully`
    };
  }
}
