// Gift Controller (/api/v1/gift)
import { SendGiftDto, GiftDto } from '../../../../packages/shared-types/src/index.js';

export class GiftController {
  async sendGift(senderId: string, body: SendGiftDto): Promise<{ success: boolean; transactionId: string; message: string }> {
    return {
      success: true,
      transactionId: `gift-tx-${Date.now()}`,
      message: `Sent ${body.giftCount} x Gift ${body.giftId} to User ${body.receiverId} in room ${body.roomId}`
    };
  }

  async getCatalog(): Promise<{ success: boolean; data: GiftDto[] }> {
    return {
      success: true,
      data: [
        { id: 'g-1', name: '🌹 Red Rose', iconUrl: 'https://auralive.app/gifts/rose.png', coinPrice: 1, category: 'Popular', isVipOnly: false },
        { id: 'g-2', name: '👑 Royal Crown', iconUrl: 'https://auralive.app/gifts/crown.png', coinPrice: 500, category: 'Luxury', isVipOnly: false },
        { id: 'g-3', name: '🚀 Super Rocket', iconUrl: 'https://auralive.app/gifts/rocket.png', coinPrice: 5000, category: 'SVIP', isVipOnly: true }
      ]
    };
  }
}
