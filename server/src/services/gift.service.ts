import { prisma } from '../config/database.js';
import { emitToRoom, broadcastGlobal, emitToUser } from '../websocket/socketServer.js';

export interface VirtualGiftDefinition {
  id: string;
  name: string;
  emoji: string;
  iconUrl: string;
  costDiamonds: number;
  hostEarnCoins: number;
  category: 'Popular' | 'Luxury' | 'Special FX' | 'Lucky' | 'Romantic';
  animationType: string;
  isLucky?: boolean;
  minVipLevel?: number;
}

export const VIRTUAL_GIFTS_CATALOG: VirtualGiftDefinition[] = [
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
        name:          g.name,
        emoji:         g.icon,
        icon:          g.icon,
        iconUrl:       g.imageUrl || '',
        costDiamonds:  g.costCoins,
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

      const categories = [...new Set(gifts.map((g) => g.category)), 'All'];

      return { success: true, categories, gifts };
    } catch (err) {
      // DB unreachable — fall back to static catalog
      console.warn('[GiftService] DB unavailable, returning static catalog:', (err as Error).message);
      return {
        success: true,
        categories: ['Popular', 'Luxury', 'Special FX', 'Romantic', 'Lucky', 'All'],
        gifts: VIRTUAL_GIFTS_CATALOG.map((g) => ({
          ...g, icon: g.emoji, costCoins: g.costDiamonds, rewardDiamonds: g.hostEarnCoins,
          xpReward: 100, isLucky: g.isLucky || false, multiplierMax: 500, active: true, createdAt: new Date(),
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
          name: g.name, icon: g.emoji,
          costCoins: g.costDiamonds, rewardDiamonds: g.hostEarnCoins,
          category: g.category, animationType: g.animationType,
          isLucky: g.isLucky || false, active: true,
        },
        create: {
          id: g.id,
          name: g.name, icon: g.emoji,
          costCoins: g.costDiamonds, rewardDiamonds: g.hostEarnCoins,
          category: g.category, animationType: g.animationType,
          isLucky: g.isLucky || false, multiplierMax: 500, xpReward: 100, active: true,
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

    if (sender.id === receiver.id) {
      // Allow for testing, but typically users don't gift themselves
    }

    // Check sender diamond balance
    if (sender.diamonds < totalCostDiamonds) {
      throw new Error(`Insufficient Diamonds! You need ${totalCostDiamonds} 💎 but have ${sender.diamonds} 💎.`);
    }

    const now = new Date();

    // Execute atomic transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Debit diamonds from sender
      const updatedSender = await tx.user.update({
        where: { id: sender.id },
        data: { diamonds: { decrement: totalCostDiamonds } },
      });

      // 2. Credit host/receiver coins
      const updatedReceiver = await tx.user.update({
        where: { id: receiver.id },
        data: { coins: { increment: totalHostCoinsEarned } },
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

    const broadcastPayload = {
      id: `GIFT_EVENT_${Date.now()}`,
      giftId: gift.id,
      giftName: gift.name,
      emoji: gift.emoji,
      iconUrl: gift.iconUrl,
      costDiamonds: gift.costDiamonds,
      totalCostDiamonds,
      quantity: qty,
      comboCount: combo,
      animationType: gift.animationType,
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

    // Realtime Notifications via Socket.IO
    if (params.roomId) {
      // 1. Broadcast to all users in the active live room
      emitToRoom(params.roomId, 'gift.broadcast', broadcastPayload);
      emitToRoom(params.roomId, 'live.gift', broadcastPayload);
    }

    // 2. Send private balance updates to sender and receiver
    emitToUser(sender.numericId, 'wallet.updated', {
      diamonds: result.updatedSender.diamonds,
      coins: result.updatedSender.coins,
    });
    emitToUser(receiver.numericId, 'wallet.updated', {
      diamonds: result.updatedReceiver.diamonds,
      coins: result.updatedReceiver.coins,
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
}
