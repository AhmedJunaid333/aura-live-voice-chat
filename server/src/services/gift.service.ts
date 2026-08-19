import { prisma } from '../config/database.js';
import { emitToRoom, broadcastGlobal, emitToUser } from '../websocket/socketServer.js';

export interface VirtualGiftDefinition {
  id: string;
  name: string;
  emoji: string;
  iconUrl: string;
  costDiamonds: number;
  hostEarnCoins: number;
  category: 'Popular' | 'Luxury' | 'Special FX' | 'Lucky' | 'Romantic' | 'Draw' | 'Multi' | 'Family Prestige' | 'VIP';
  animationType: string;
  svgaUrl?: string;
  lottieUrl?: string;
  soundUrl?: string;
  isLucky?: boolean;
  isNew?: boolean;
  minVipLevel?: number;
}

export const VIRTUAL_GIFTS_CATALOG: VirtualGiftDefinition[] = [
  {
    id: 'GIFT-STAR-GODDESS',
    name: 'Star Goddess',
    emoji: '✨',
    iconUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 200,
    hostEarnCoins: 140,
    category: 'Popular',
    animationType: 'STAR_GODDESS_3D',
    isNew: true,
  },
  {
    id: 'GIFT-LEO',
    name: 'Leo',
    emoji: '🦁',
    iconUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 1,
    hostEarnCoins: 1,
    category: 'Popular',
    animationType: 'LEO_ROAR',
  },
  {
    id: 'GIFT-PICKING-STARS',
    name: 'Picking stars',
    emoji: '⭐',
    iconUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 999,
    hostEarnCoins: 700,
    category: 'Multi',
    animationType: 'STAR_FALL_3D',
    isNew: true,
  },
  {
    id: 'GIFT-SUPER-LEO',
    name: 'Super Leo',
    emoji: '🔥',
    iconUrl: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 2888,
    hostEarnCoins: 2020,
    category: 'VIP',
    animationType: 'SUPER_LEO_FIRE_3D',
  },
  {
    id: 'GIFT-BUBBLE-MILK-TEA',
    name: 'Bubble milk tea',
    emoji: '🧋',
    iconUrl: 'https://images.unsplash.com/photo-1558857563-b37cf5c7774d?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 1,
    hostEarnCoins: 1,
    category: 'Popular',
    animationType: 'BOBA_SPLASH',
  },
  {
    id: 'GIFT-GLOW-STICK',
    name: 'Glow Stick',
    emoji: '🪄',
    iconUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 1,
    hostEarnCoins: 1,
    category: 'Draw',
    animationType: 'GLOW_STICK_FX',
  },
  {
    id: 'GIFT-RECORD-PLAYER',
    name: 'Record Player',
    emoji: '📻',
    iconUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 100,
    hostEarnCoins: 70,
    category: 'Family Prestige',
    animationType: 'VINYL_SPIN_3D',
  },
  {
    id: 'GIFT-TROPHY',
    name: 'Trophy',
    emoji: '🏆',
    iconUrl: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 500,
    hostEarnCoins: 350,
    category: 'Popular',
    animationType: 'GOLDEN_TROPHY_3D',
  },
  {
    id: 'GIFT-101',
    name: 'Red Rose',
    emoji: '🌹',
    iconUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 10,
    hostEarnCoins: 7,
    category: 'Popular',
    animationType: 'ROSE_BURST',
  },
  {
    id: 'GIFT-102',
    name: 'Love Heart',
    emoji: '💖',
    iconUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 50,
    hostEarnCoins: 35,
    category: 'Romantic',
    animationType: 'HEART_FOUNTAIN',
  },
  {
    id: 'GIFT-103',
    name: 'Diamond Ring',
    emoji: '💍',
    iconUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 200,
    hostEarnCoins: 140,
    category: 'Popular',
    animationType: 'DIAMOND_SHINE',
  },
  {
    id: 'GIFT-501',
    name: 'Royal Golden Crown',
    emoji: '👑',
    iconUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 500,
    hostEarnCoins: 350,
    category: 'Luxury',
    animationType: 'ROYAL_CROWN_3D',
  },
  {
    id: 'GIFT-1501',
    name: 'Cyber Supercar',
    emoji: '🏎️',
    iconUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 1500,
    hostEarnCoins: 1050,
    category: 'Luxury',
    animationType: 'SUPERCAR_3D',
  },
  {
    id: 'GIFT-2001',
    name: 'Galaxy Space Rocket',
    emoji: '🚀',
    iconUrl: 'https://images.unsplash.com/photo-1517976487507-58079a40552b?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 2000,
    hostEarnCoins: 1400,
    category: 'Special FX',
    animationType: 'GALAXY_ROCKET_3D',
  },
  {
    id: 'GIFT-5001',
    name: 'Billionaire Yacht',
    emoji: '🛥️',
    iconUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 5000,
    hostEarnCoins: 3500,
    category: 'Luxury',
    animationType: 'SUPER_YACHT_3D',
  },
  {
    id: 'GIFT-8001',
    name: 'Golden Dragon FX',
    emoji: '🐉',
    iconUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 8000,
    hostEarnCoins: 5600,
    category: 'Special FX',
    animationType: 'DRAGON_FIRE_3D',
  },
  {
    id: 'GIFT-10001',
    name: 'Luxury Private Jet',
    emoji: '✈️',
    iconUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 10000,
    hostEarnCoins: 7000,
    category: 'Luxury',
    animationType: 'PRIVATE_JET_3D',
  },
  {
    id: 'GIFT-LUCKY-1',
    name: 'Lucky Treasure Chest',
    emoji: '🎰',
    iconUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 100,
    hostEarnCoins: 70,
    category: 'Draw',
    animationType: 'LUCKY_CHEST_3D',
    isLucky: true,
  },
  {
    id: 'GIFT-2001',
    name: 'Galaxy Space Rocket',
    emoji: '🚀',
    iconUrl: 'https://images.unsplash.com/photo-1517976487507-58079a40552b?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 2000,
    hostEarnCoins: 1400,
    category: 'Special FX',
    animationType: 'GALAXY_ROCKET_3D',
  },
  {
    id: 'GIFT-5001',
    name: 'Billionaire Yacht',
    emoji: '🛥️',
    iconUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 5000,
    hostEarnCoins: 3500,
    category: 'Luxury',
    animationType: 'SUPER_YACHT_3D',
  },
  {
    id: 'GIFT-8001',
    name: 'Golden Dragon FX',
    emoji: '🐉',
    iconUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 8000,
    hostEarnCoins: 5600,
    category: 'Special FX',
    animationType: 'DRAGON_FIRE_3D',
  },
  {
    id: 'GIFT-10001',
    name: 'Luxury Private Jet',
    emoji: '✈️',
    iconUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 10000,
    hostEarnCoins: 7000,
    category: 'Luxury',
    animationType: 'PRIVATE_JET_3D',
  },
  {
    id: 'GIFT-20001',
    name: 'Cosmic Galaxy Portal',
    emoji: '🌌',
    iconUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 20000,
    hostEarnCoins: 14000,
    category: 'Special FX',
    animationType: 'COSMIC_PORTAL_3D',
  },
  {
    id: 'GIFT-25001',
    name: 'Imperial Royal Castle',
    emoji: '🏰',
    iconUrl: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 25000,
    hostEarnCoins: 17500,
    category: 'Luxury',
    animationType: 'ROYAL_CASTLE_3D',
  },
  {
    id: 'GIFT-LUCKY-1',
    name: 'Lucky Treasure Chest',
    emoji: '🎰',
    iconUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 100,
    hostEarnCoins: 70,
    category: 'Lucky',
    animationType: 'LUCKY_CHEST_3D',
    isLucky: true,
  },
  {
    id: 'GIFT-AUTUMN-WINDMILL',
    name: 'Autumn Windmill',
    emoji: '🍂',
    iconUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 1200,
    hostEarnCoins: 840,
    category: 'Popular',
    animationType: 'AUTUMN_WINDMILL_SVGA',
    svgaUrl: '/uploads/svga/Autumn_Windmill_.svga',
    isNew: true,
  },
  {
    id: 'GIFT-BLUE-ENCHANTRESS',
    name: 'Blue Enchantress',
    emoji: '💙',
    iconUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 600,
    hostEarnCoins: 420,
    category: 'Draw',
    animationType: 'BLUE_ENCHANTRESS_SVGA',
    svgaUrl: '/uploads/svga/Blue_Enchantress.svga',
    isNew: true,
  },
  {
    id: 'GIFT-CHILDHOOD-SWEETHEARTS',
    name: 'Childhood Sweethearts',
    emoji: '👫',
    iconUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 1500,
    hostEarnCoins: 1050,
    category: 'Popular',
    animationType: 'CHILDHOOD_SWEETHEARTS_SVGA',
    svgaUrl: '/uploads/svga/Childhood_sweethearts_1.svga',
    isNew: true,
  },
  {
    id: 'GIFT-CROWNING-LOVE',
    name: 'Crowning Love',
    emoji: '👑',
    iconUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 3500,
    hostEarnCoins: 2450,
    category: 'VIP',
    animationType: 'CROWNING_LOVE_SVGA',
    svgaUrl: '/uploads/svga/Crowning_Love_2.svga',
    isNew: true,
  },
  {
    id: 'GIFT-FLOWER-BOAT',
    name: 'Flower Boat',
    emoji: '⛵',
    iconUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 800,
    hostEarnCoins: 560,
    category: 'Popular',
    animationType: 'FLOWER_BOAT_SVGA',
    svgaUrl: '/uploads/svga/Flower_Boat_1.svga',
    isNew: true,
  },
  {
    id: 'GIFT-MERMAID-GIRL',
    name: 'Mermaid Girl',
    emoji: '🧜‍♀️',
    iconUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 2200,
    hostEarnCoins: 1540,
    category: 'Multi',
    animationType: 'MERMAID_GIRL_SVGA',
    svgaUrl: '/uploads/svga/Mermaid_girl_1.svga',
    isNew: true,
  },
  {
    id: 'GIFT-RABBIT-HEARTBEAT',
    name: 'Rabbit Heartbeat',
    emoji: '🐰',
    iconUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 1000,
    hostEarnCoins: 700,
    category: 'Family Prestige',
    animationType: 'RABBIT_HEARTBEAT_SVGA',
    svgaUrl: '/uploads/svga/Rabbit_Heartbeat_1.svga',
    isNew: true,
  },
  {
    id: 'GIFT-RUNAWAY-SWEETHEART',
    name: 'Runaway Sweetheart',
    emoji: '💖',
    iconUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 1800,
    hostEarnCoins: 1260,
    category: 'Popular',
    animationType: 'RUNAWAY_SWEETHEART_SVGA',
    svgaUrl: '/uploads/svga/Runaway_Sweetheart_1.svga',
    isNew: true,
  },
  {
    id: 'GIFT-SECRET-CAGE',
    name: 'Secret Cage',
    emoji: '🕊️',
    iconUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 900,
    hostEarnCoins: 630,
    category: 'Draw',
    animationType: 'SECRET_CAGE_SVGA',
    svgaUrl: '/uploads/svga/Secret_Cage_1.svga',
    isNew: true,
  },
  {
    id: 'GIFT-MAGIC-DEY',
    name: 'Magic Lamp Dream',
    emoji: '🪔',
    iconUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=120&auto=format&fit=crop&q=60',
    costDiamonds: 750,
    hostEarnCoins: 525,
    category: 'Special FX',
    animationType: 'MAGIC_DEY_SVGA',
    svgaUrl: '/uploads/svga/dey_1.svga',
    isNew: true,
  },
];

export class GiftService {
  /**
   * Get all active virtual gifts from DB (with static fallback).
   * Also auto-seeds DB if it's empty.
   */
  static async getGiftCatalog() {
    try {
      // If DB has gifts, return them
      let dbGifts = await prisma.gift.findMany({
        where: { active: true },
        orderBy: { createdAt: 'asc' },
      });

      // Auto-seed on first call if table is empty
      if (dbGifts.length === 0) {
        await GiftService.seedGiftCatalog();
        dbGifts = await prisma.gift.findMany({
          where: { active: true },
          orderBy: { createdAt: 'asc' },
        });
      }

      // Normalise to the shape the mobile/admin expects
      const gifts = dbGifts.map((g) => ({
        id:            g.id,
        giftId:        g.id,
        name:          g.name,
        emoji:         g.icon,
        icon:          g.icon,
        iconUrl:       g.imageUrl || '',
        thumbnailUrl:  g.imageUrl || '',
        animationUrl:  g.svgaUrl || g.lottieUrl || g.imageUrl || '',
        costDiamonds:  g.costCoins,
        diamondCost:   g.costCoins,
        hostEarnCoins: g.rewardDiamonds,
        costCoins:     g.costCoins,
        rewardDiamonds:g.rewardDiamonds,
        category:      g.category,
        animationType: g.animationType,
        svgaUrl:       g.svgaUrl,
        lottieUrl:     g.lottieUrl,
        imageUrl:      g.imageUrl,
        soundUrl:      g.soundUrl,
        xpReward:      g.xpReward,
        isLucky:       g.isLucky,
        multiplierMax: g.multiplierMax,
        active:        g.active,
        createdAt:     g.createdAt,
      }));

      const standardTabs = ['All', 'Popular', 'Luxury', 'Special FX', 'Romantic', 'Lucky', 'Draw', 'Multi', 'Family Prestige', 'VIP'];
      const dynamicCats = [...new Set(gifts.map((g) => g.category))];
      const categories = [...new Set([...standardTabs, ...dynamicCats])];

      return { success: true, categories, gifts };
    } catch (err) {
      // DB unreachable — fall back to static catalog
      console.warn('[GiftService] DB unavailable, returning static catalog:', (err as Error).message);
      return {
        success: true,
        categories: ['All', 'Popular', 'Luxury', 'Special FX', 'Romantic', 'Lucky', 'Draw', 'Multi', 'Family Prestige', 'VIP'],
        gifts: VIRTUAL_GIFTS_CATALOG.map((g) => ({
          ...g,
          giftId: g.id,
          icon: g.emoji,
          costCoins: g.costDiamonds,
          diamondCost: g.costDiamonds,
          rewardDiamonds: g.hostEarnCoins,
          thumbnailUrl: g.iconUrl,
          animationUrl: g.svgaUrl || g.iconUrl,
          xpReward: 100,
          isLucky: g.isLucky || false,
          multiplierMax: 500,
          active: true,
          createdAt: new Date(),
        })),
      };
    }
  }

  /**
   * Seed the DB Gift table from the static VIRTUAL_GIFTS_CATALOG.
   * Uses upsert so it's safe to call multiple times.
   */
  static async seedGiftCatalog() {
    const results: string[] = [];
    for (const g of VIRTUAL_GIFTS_CATALOG) {
      await prisma.gift.upsert({
        where: { id: g.id },
        update: {
          name: g.name,
          icon: g.emoji,
          imageUrl: g.iconUrl,
          svgaUrl: g.svgaUrl,
          costCoins: g.costDiamonds,
          rewardDiamonds: g.hostEarnCoins,
          category: g.category,
          animationType: g.animationType,
          isLucky: g.isLucky || false,
          active: true,
        },
        create: {
          id: g.id,
          name: g.name,
          icon: g.emoji,
          imageUrl: g.iconUrl,
          svgaUrl: g.svgaUrl,
          costCoins: g.costDiamonds,
          rewardDiamonds: g.hostEarnCoins,
          category: g.category,
          animationType: g.animationType,
          isLucky: g.isLucky || false,
          multiplierMax: 500,
          xpReward: 100,
          active: true,
        },
      });
      results.push(g.id);
    }
    console.log(`[GiftService] Seeded ${results.length} gifts into DB.`);
    return results;
  }

  /**
   * Resolve user by ID or NumericId, auto-creating if needed.
   */
  private static async resolveUser(userIdentifier: number) {
    let user = await prisma.user.findFirst({
      where: { OR: [{ id: userIdentifier }, { numericId: userIdentifier }] },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          numericId: userIdentifier,
          username: `user_${userIdentifier}`,
          displayName: `User #${userIdentifier}`,
          email: `user${userIdentifier}@auralive.io`,
          passwordHash: 'dummy_hash',
          role: 'USER',
          status: 'ACTIVE',
          coins: 100000,
          diamonds: 50000,
        },
      });
    }

    return user;
  }

  /**
   * Send Gift inside a Live Room or 1-on-1 atomically.
   */
  static async sendLiveGift(params: {
    senderIdentifier: number;
    receiverIdentifier: number;
    roomId?: string;
    giftId: string;
    quantity?: number;
    comboCount?: number;
  }) {
    const qty = Math.max(1, params.quantity || 1);
    const combo = params.comboCount || 1;

    console.log(`🎁 [GiftService] Gift Transaction Started: GiftID=${params.giftId}, Qty=${qty}, Combo=${combo}, Sender=${params.senderIdentifier}, Receiver=${params.receiverIdentifier}, Room=${params.roomId}`);

    // Look up gift from DB first, then fall back to static catalog
    const dbGiftRecord = await prisma.gift.findFirst({
      where: { OR: [{ id: params.giftId }, { name: params.giftId }] },
    }).catch(() => null);

    const staticGift = VIRTUAL_GIFTS_CATALOG.find((g) => g.id === params.giftId);

    const gift = dbGiftRecord
      ? {
          id:            dbGiftRecord.id,
          name:          dbGiftRecord.name,
          emoji:         dbGiftRecord.icon,
          iconUrl:       dbGiftRecord.imageUrl || '',
          svgaUrl:       dbGiftRecord.svgaUrl || '',
          lottieUrl:     dbGiftRecord.lottieUrl || '',
          imageUrl:      dbGiftRecord.imageUrl || '',
          costDiamonds:  dbGiftRecord.costCoins,
          hostEarnCoins: dbGiftRecord.rewardDiamonds,
          category:      dbGiftRecord.category as any,
          animationType: dbGiftRecord.animationType,
          isLucky:       dbGiftRecord.isLucky,
        }
      : staticGift || {
          id: params.giftId,
          name: 'Special Luxury Gift',
          emoji: '🎁',
          iconUrl: '',
          svgaUrl: '',
          lottieUrl: '',
          imageUrl: '',
          costDiamonds: 100,
          hostEarnCoins: 70,
          category: 'Popular' as any,
          animationType: 'ROYAL_CROWN_3D',
          isLucky: false,
        };

    const totalCostDiamonds   = gift.costDiamonds  * qty;
    const totalHostCoinsEarned = gift.hostEarnCoins * qty;

    const sender = await this.resolveUser(params.senderIdentifier);
    const receiver = await this.resolveUser(params.receiverIdentifier);

    console.log(`💎 [GiftService] Wallet Validation: Sender @${sender.username} (ID: ${sender.numericId}) has ${sender.diamonds} 💎 (Required: ${totalCostDiamonds} 💎)`);

    // Check sender diamond balance
    if (sender.diamonds < totalCostDiamonds) {
      throw new Error(`Insufficient Diamonds! You need ${totalCostDiamonds} 💎 but have ${sender.diamonds} 💎.`);
    }

    const now = new Date();
    const eventId = `EVT_GIFT_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Execute atomic transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Debit diamonds from sender
      const updatedSender = await tx.user.update({
        where: { id: sender.id },
        data: {
          diamonds: { decrement: totalCostDiamonds },
          giftsSent: { increment: qty },
        },
      });

      // 2. Credit host/receiver coins
      const updatedReceiver = await tx.user.update({
        where: { id: receiver.id },
        data: {
          coins: { increment: totalHostCoinsEarned },
          giftsReceived: { increment: qty },
        },
      });

      // 3. Record Sender WalletTransaction
      await tx.walletTransaction.create({
        data: {
          userId: sender.id,
          type: 'GIFT_SENT',
          currency: 'DIAMOND',
          amount: -totalCostDiamonds,
          balanceAfter: updatedSender.diamonds,
          referenceId: `GIFT-TXN-${Date.now()}-S`,
          notes: `Sent ${qty}x ${gift.name} ${gift.emoji} (Combo: x${combo}) to @${receiver.username} in Room ${params.roomId || 'Direct'}`,
        },
      });

      // 4. Record Receiver WalletTransaction
      await tx.walletTransaction.create({
        data: {
          userId: receiver.id,
          type: 'GIFT_RECEIVED',
          currency: 'COIN',
          amount: totalHostCoinsEarned,
          balanceAfter: updatedReceiver.coins,
          referenceId: `GIFT-TXN-${Date.now()}-R`,
          notes: `Earned +${totalHostCoinsEarned} Coins from ${qty}x ${gift.name} ${gift.emoji} (Combo: x${combo}) sent by @${sender.username}`,
        },
      });

      // 5. Ensure Gift record exists in DB
      let dbGift = await tx.gift.findUnique({ where: { id: gift.id } });
      if (!dbGift) {
        dbGift = await tx.gift.create({
          data: {
            id: gift.id,
            name: gift.name,
            icon: gift.emoji,
            imageUrl: (gift as any).imageUrl || gift.iconUrl || null,
            svgaUrl: gift.svgaUrl || null,
            lottieUrl: (gift as any).lottieUrl || null,
            costCoins: gift.costDiamonds,
            rewardDiamonds: gift.hostEarnCoins,
            category: gift.category,
            animationType: gift.animationType,
            active: true,
          },
        });
      }

      // 6. Record GiftTransaction - resolve room by UUID id OR string roomId
      let resolvedRoomId: string | null = null;
      if (params.roomId) {
        // Try by primary key (UUID) first, then by roomId string field
        let room = await tx.liveRoom.findUnique({ where: { id: params.roomId } }).catch(() => null);
        if (!room) {
          room = await tx.liveRoom.findUnique({ where: { roomId: params.roomId } }).catch(() => null);
        }
        if (room) {
          resolvedRoomId = room.id;
          // Increment room total diamonds contribution
          await tx.liveRoom.update({
            where: { id: room.id },
            data: { totalDiamonds: { increment: totalCostDiamonds } },
          }).catch(() => null);
        }
        // If room not found, skip FK — don't fail the whole transaction
      }

      const giftTx = await tx.giftTransaction.create({
        data: {
          roomId: resolvedRoomId,
          senderId: sender.id,
          receiverId: receiver.id,
          giftId: dbGift.id,
          count: qty,
          totalCoins: totalCostDiamonds,
          totalDiamonds: totalHostCoinsEarned,
        },
      });

      // 7. Record AuditLog
      await tx.auditLog.create({
        data: {
          actorId: sender.id,
          actorRole: 'USER',
          action: 'GIFT_SENT_IN_ROOM',
          resource: `Gift:${gift.id}`,
          details: JSON.stringify({
            eventId,
            senderNumericId: sender.numericId,
            receiverNumericId: receiver.numericId,
            giftName: gift.name,
            quantity: qty,
            combo,
            costDiamonds: totalCostDiamonds,
            earnedCoins: totalHostCoinsEarned,
            roomId: params.roomId,
          }),
        },
      });

      return { updatedSender, updatedReceiver, giftTx };
    }, { timeout: 25000, maxWait: 10000 });

    console.log(`✅ [GiftService] Atomic transaction SUCCESS. Sender @${sender.username} deducted -${totalCostDiamonds} 💎 (Remaining: ${result.updatedSender.diamonds} 💎). Receiver @${receiver.username} credited +${totalHostCoinsEarned} Coins.`);

    // Resolve authoritative animation URL & thumbnail URL
    const resolvedThumbUrl = (gift as any).imageUrl || gift.iconUrl || (dbGiftRecord?.imageUrl ?? '');
    const resolvedAnimUrl = gift.svgaUrl || (gift as any).lottieUrl || (gift as any).animationUrl || (gift as any).imageUrl || (dbGiftRecord?.svgaUrl ?? dbGiftRecord?.imageUrl ?? '');
    const resolvedAnimType = gift.animationType || dbGiftRecord?.animationType || (resolvedAnimUrl.endsWith('.svga') ? 'SVGA' : 'ROYAL_CROWN_3D');

    const broadcastPayload = {
      id: eventId,
      eventId: eventId,
      giftId: gift.id,
      giftName: gift.name,
      emoji: gift.emoji,
      iconUrl: resolvedThumbUrl,
      thumbnailUrl: resolvedThumbUrl,
      animationUrl: resolvedAnimUrl,
      svgaUrl: gift.svgaUrl || (dbGiftRecord?.svgaUrl ?? ''),
      lottieUrl: gift.lottieUrl || (dbGiftRecord?.lottieUrl ?? ''),
      imageUrl: resolvedThumbUrl,
      costDiamonds: gift.costDiamonds,
      totalCostDiamonds,
      quantity: qty,
      comboCount: combo,
      animationType: resolvedAnimType,
      category: gift.category,
      sender: {
        id: sender.id,
        numericId: sender.numericId,
        username: sender.username,
        displayName: sender.displayName || sender.username,
        avatar: sender.avatar,
      },
      receiver: {
        id: receiver.id,
        numericId: receiver.numericId,
        username: receiver.username,
        displayName: receiver.displayName || receiver.username,
        avatar: receiver.avatar,
      },
      roomId: params.roomId,
      timestamp: now.toISOString(),
    };

    console.log(`📡 [GiftService] Realtime GIFT_SENT Broadcast: Event=${eventId}, Gift=${gift.name}, AnimType=${resolvedAnimType}, AnimURL=${resolvedAnimUrl}`);

    // Realtime Notifications via Socket.IO
    if (params.roomId) {
      // 1. Broadcast to all users in the active live room
      emitToRoom(params.roomId, 'gift.broadcast', broadcastPayload);
      emitToRoom(params.roomId, 'live.gift', broadcastPayload);
      emitToRoom(params.roomId, 'GIFT_SENT', broadcastPayload);
    }

    // 2. Send private balance updates to sender and receiver
    emitToUser(sender.numericId, 'wallet.updated', {
      diamonds: result.updatedSender.diamonds,
      coins: result.updatedSender.coins,
      timestamp: now.toISOString(),
    });
    emitToUser(receiver.numericId, 'wallet.updated', {
      diamonds: result.updatedReceiver.diamonds,
      coins: result.updatedReceiver.coins,
      timestamp: now.toISOString(),
    });

    // 3. For Luxury Gifts (>= 1000 Diamonds), broadcast VIP Global Banner to all app users
    if (totalCostDiamonds >= 1000) {
      broadcastGlobal('gift.global_banner', broadcastPayload);
    }

    return {
      success: true,
      message: `Successfully sent ${qty}x ${gift.name} ${gift.emoji} to @${receiver.username}!`,
      data: broadcastPayload,
      senderRemainingDiamonds: result.updatedSender.diamonds,
      receiverEarnedCoins: totalHostCoinsEarned,
    };
  }

  /**
   * Directly transfer Diamonds between Host and Guest or Guest and Host atomically.
   */
  static async sendLiveDiamonds(params: {
    senderIdentifier: number;
    receiverIdentifier: number;
    roomId?: string;
    amount: number;
    idempotencyKey?: string;
    notes?: string;
  }) {
    const amount = Math.max(1, parseInt(String(params.amount), 10) || 10);
    const sender = await this.resolveUser(params.senderIdentifier);
    const receiver = await this.resolveUser(params.receiverIdentifier);

    if (sender.diamonds < amount) {
      throw new Error(`Insufficient Diamonds! You need ${amount} 💎 but have ${sender.diamonds} 💎.`);
    }

    const now = new Date();
    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Deduct diamonds from sender
      const updatedSender = await tx.user.update({
        where: { id: sender.id },
        data: { diamonds: { decrement: amount } },
      });

      // 2. Credit coins/diamonds to receiver
      const updatedReceiver = await tx.user.update({
        where: { id: receiver.id },
        data: { coins: { increment: amount } },
      });

      // 3. Sender WalletTransaction
      await tx.walletTransaction.create({
        data: {
          userId: sender.id,
          type: 'GIFT_SENT',
          currency: 'DIAMOND',
          amount: -amount,
          balanceAfter: updatedSender.diamonds,
          referenceId: params.idempotencyKey || `DIAMOND-TXN-${Date.now()}-S`,
          notes: params.notes || `Sent ${amount} 💎 to @${receiver.username} in Room ${params.roomId || 'Direct'}`,
        },
      });

      // 4. Receiver WalletTransaction
      await tx.walletTransaction.create({
        data: {
          userId: receiver.id,
          type: 'GIFT_RECEIVED',
          currency: 'COIN',
          amount: amount,
          balanceAfter: updatedReceiver.coins,
          referenceId: params.idempotencyKey ? `${params.idempotencyKey}-R` : `DIAMOND-TXN-${Date.now()}-R`,
          notes: params.notes || `Received +${amount} 💎 from @${sender.username}`,
        },
      });

      return { updatedSender, updatedReceiver };
    }, { timeout: 25000, maxWait: 10000 });

    const broadcastPayload = {
      id: `DIAMOND_EVENT_${Date.now()}`,
      amount,
      totalCostDiamonds: amount,
      sender: {
        id: sender.id,
        numericId: sender.numericId,
        username: sender.username,
        displayName: sender.displayName || sender.username,
        avatar: sender.avatar,
      },
      receiver: {
        id: receiver.id,
        numericId: receiver.numericId,
        username: receiver.username,
        displayName: receiver.displayName || receiver.username,
        avatar: receiver.avatar,
      },
      roomId: params.roomId,
      timestamp: now.toISOString(),
    };

    if (params.roomId) {
      emitToRoom(params.roomId, 'room.diamond.sent', broadcastPayload);
      emitToRoom(params.roomId, 'gift.broadcast', {
        ...broadcastPayload,
        giftName: 'Diamond Reward',
        emoji: '💎',
        quantity: 1,
        comboCount: 1,
        animationType: 'DIAMOND_SHOWER',
      });
    }

    emitToUser(sender.numericId, 'wallet.updated', {
      diamonds: result.updatedSender.diamonds,
      coins: result.updatedSender.coins,
    });
    emitToUser(receiver.numericId, 'wallet.updated', {
      diamonds: result.updatedReceiver.diamonds,
      coins: result.updatedReceiver.coins,
    });

    return {
      success: true,
      message: `Successfully sent ${amount} 💎 to @${receiver.username}!`,
      data: broadcastPayload,
      senderRemainingDiamonds: result.updatedSender.diamonds,
      receiverEarnedCoins: amount,
    };
  }
}
