// VIP Controller (/api/v1/vip)
import { VipService } from '../modules/economy/vip.service.js';

export class VipController {
  private vipService = new VipService();

  async getVipLevels() {
    return {
      success: true,
      data: this.vipService.getVipLevels()
    };
  }

  async purchaseVip(userId: string, tier: number) {
    const result = this.vipService.purchaseVip(userId, tier);
    return {
      success: true,
      message: `Successfully upgraded to VIP Tier ${tier}`,
      data: result
    };
  }
}
