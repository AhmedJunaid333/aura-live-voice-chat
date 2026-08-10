import { prisma } from '../config/database.js';

export class StoreService {
  // ─── VIP Tier Configs ───

  static async getVipTiers() {
    const tiers = await prisma.vipTierConfig.findMany({
      orderBy: { level: 'asc' },
    });
    if (tiers.length === 0) {
      // Seed default VIP tiers if empty
      const defaultTiers = [
        { level: 1, tierName: 'VIP 1 Bronze Knight 🥉', shortBadge: 'VIP 1', colorHex: '#CD7F32', expRequired: 1000, priceUsd: 10.0, perksJson: JSON.stringify(['Bronze Frame 🥉', '1.1x EXP Boost', 'Voice Seat Soundwave', 'Exclusive Gift']) },
        { level: 2, tierName: 'VIP 2 Silver Baron 🥈', shortBadge: 'VIP 2', colorHex: '#C0C0C0', expRequired: 5000, priceUsd: 50.0, perksJson: JSON.stringify(['Silver Username 🥈', '1.2x EXP Boost', 'Mustang Sports Car 🏎️', 'VIP 2 Gift Pack']) },
        { level: 3, tierName: 'VIP 3 Gold Count 🥇', shortBadge: 'VIP 3', colorHex: '#FFD700', expRequired: 20000, priceUsd: 200.0, perksJson: JSON.stringify(['Gold Crown 👑', '1.5x EXP Boost', 'Golden Helicopter 🚁', 'VIP 3 Gift Pack']) },
        { level: 4, tierName: 'VIP 4 Platinum Marquis 💎', shortBadge: 'VIP 4', colorHex: '#E5E4E2', expRequired: 50000, priceUsd: 500.0, perksJson: JSON.stringify(['Platinum Aura 💎', '2.0x EXP Boost', 'Private Jet ✈️', 'VIP 4 Gift Pack']) },
        { level: 5, tierName: 'VIP 5 SVIP Royal Duke 👑', shortBadge: 'SVIP 5', colorHex: '#9333EA', expRequired: 100000, priceUsd: 1000.0, perksJson: JSON.stringify(['SVIP Crown 👑', '2.5x EXP Boost', 'Cosmic Starship 🚀', 'SVIP Room Takeover']) },
        { level: 6, tierName: 'VIP 6 VVIP Sovereign Emperor 👑⚡', shortBadge: 'VVIP 6', colorHex: '#EC4899', expRequired: 250000, priceUsd: 2500.0, perksJson: JSON.stringify(['VVIP Godlike Realm ⚡', '3.0x EXP Boost', 'Dragon Fleet 🐉', 'Immunity Shield']) },
      ];
      await prisma.vipTierConfig.createMany({ data: defaultTiers });
      return prisma.vipTierConfig.findMany({ orderBy: { level: 'asc' } });
    }
    return tiers;
  }

  static async updateVipTier(level: number, data: Partial<{ tierName: string; shortBadge: string; colorHex: string; expRequired: number; priceUsd: number; active: boolean; perksJson: string }>) {
    return prisma.vipTierConfig.update({
      where: { level },
      data,
    });
  }

  // ─── Store Virtual Items ───

  static async getStoreItems(category?: string) {
    const where = category && category !== 'ALL' ? { category } : {};
    const items = await prisma.storeItem.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    if (items.length === 0 && (!category || category === 'ALL')) {
      // Seed default Store Items if empty
      const defaultItems = [
        { name: 'Golden Phantom Rolls 🚗', category: 'Entry Effects', priceCoins: 50000, priceDiamonds: 500, durationDays: 30, description: 'Gold supercar entrance animation when joining live rooms.', icon: 'car', colorHex: '#FFD700', sortOrder: 1 },
        { name: 'Dragon Wings Jet ✈️', category: 'Entry Effects', priceCoins: 120000, priceDiamonds: 1200, durationDays: 30, description: 'Mythic dragon plane entrance animation.', icon: 'airplane', colorHex: '#9333EA', sortOrder: 2 },
        { name: 'Phoenix Flame Entrance 🔥', category: 'Entry Effects', priceCoins: 80000, priceDiamonds: 800, durationDays: 30, description: 'Fire phoenix soaring room entrance animation.', icon: 'flash', colorHex: '#FF5E00', sortOrder: 3 },
        { name: 'Neon Cyber Mic Wave ⚡', category: 'Mic Waves', priceCoins: 25000, priceDiamonds: 250, durationDays: 30, description: 'Audio seat reactive neon soundwave aura effect when speaking.', icon: 'activity', colorHex: '#00E5FF', sortOrder: 4 },
        { name: 'Flame Aura Mic Wave 🔥', category: 'Mic Waves', priceCoins: 35000, priceDiamonds: 350, durationDays: 30, description: 'Fire animated mic seat ring with pulsing soundwaves.', icon: 'smallcaps', colorHex: '#FF3D00', sortOrder: 5 },
        { name: 'Royal Dragon Flame Frame 🐉', category: 'Room Frames', priceCoins: 100000, priceDiamonds: 1000, durationDays: 30, description: 'Level 25 Royal Dragon animated frame for live room seats.', icon: 'crown', colorHex: '#EC4899', sortOrder: 6 },
        { name: 'Gold Emperor Avatar Ring 👑', category: 'Profile Cards', priceCoins: 60000, priceDiamonds: 600, durationDays: 30, description: 'Golden glowing profile avatar ring & chat card.', icon: 'user', colorHex: '#FFD700', sortOrder: 7 },
      ];
      await prisma.storeItem.createMany({ data: defaultItems });
      return prisma.storeItem.findMany({ orderBy: { sortOrder: 'asc' } });
    }
    return items;
  }

  static async createStoreItem(data: { name: string; category: string; priceCoins: number; priceDiamonds?: number; durationDays?: number; description: string; icon?: string; colorHex?: string }) {
    return prisma.storeItem.create({
      data: {
        name: data.name,
        category: data.category,
        priceCoins: data.priceCoins,
        priceDiamonds: data.priceDiamonds ?? Math.floor(data.priceCoins / 100),
        durationDays: data.durationDays ?? 30,
        description: data.description,
        icon: data.icon ?? 'car',
        colorHex: data.colorHex ?? '#00E5FF',
      },
    });
  }

  static async updateStoreItem(id: string, data: Partial<{ name: string; category: string; priceCoins: number; priceDiamonds: number; durationDays: number; description: string; active: boolean; colorHex: string; icon: string }>) {
    return prisma.storeItem.update({
      where: { id },
      data,
    });
  }

  static async deleteStoreItem(id: string) {
    return prisma.storeItem.delete({
      where: { id },
    });
  }
}
