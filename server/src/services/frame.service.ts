import { prisma } from '../config/database.js';
import { emitToUser, broadcastGlobal } from '../websocket/socketServer.js';
import { randomUUID } from 'crypto';

export interface FrameFilterOptions {
  category?: string;
  status?: string;
  rarity?: string;
  search?: string;
  country?: string;
  vipTier?: number;
  userLevel?: number;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateFrameDto {
  name: string;
  description?: string;
  slug?: string;
  assetUrl: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  animationType?: string;
  category?: string;
  price?: number;
  currency?: string;
  durationDays?: number;
  isPermanent?: boolean;
  requiredVipLevel?: number;
  requiredUserLevel?: number;
  countryAvailability?: string;
  rarity?: string;
  status?: string;
  isFeatured?: boolean;
  sortOrder?: number;
  startAt?: Date | string;
  endAt?: Date | string;
}

export interface UpdateFrameDto extends Partial<CreateFrameDto> {}

export class FrameService {
  /**
   * Seed default avatar frames if none exist in the database.
   */
  static async seedDefaultFramesIfEmpty(): Promise<void> {
    try {
      const count = await (prisma as any).avatarFrame.count();
      if (count > 0) return;

      const defaultFrames = [
        {
          name: '👑 Royal Emperor Crown Frame',
          description: 'Imperial gold crown adorned with shimmering diamonds for sovereign royalty.',
          slug: 'royal-emperor-crown',
          assetUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=60',
          thumbnailUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150&auto=format&fit=crop&q=60',
          previewUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=60',
          animationType: 'svga',
          category: 'LUXURY',
          price: 15000,
          currency: 'DIAMOND',
          durationDays: 30,
          isPermanent: false,
          requiredVipLevel: 3,
          requiredUserLevel: 10,
          rarity: 'LEGENDARY',
          status: 'ACTIVE',
          isFeatured: true,
          sortOrder: 1,
        },
        {
          name: '🔥 Cyber Neon Wings Frame',
          description: 'Electric violet wings radiating pulsed cybernetic plasma waves.',
          slug: 'cyber-neon-wings',
          assetUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
          thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60',
          previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
          animationType: 'lottie',
          category: 'PREMIUM',
          price: 8000,
          currency: 'DIAMOND',
          durationDays: 30,
          isPermanent: false,
          requiredVipLevel: 1,
          requiredUserLevel: 5,
          rarity: 'EPIC',
          status: 'ACTIVE',
          isFeatured: true,
          sortOrder: 2,
        },
        {
          name: '🐉 Golden Dragon Sovereign Frame',
          description: 'Legendary mythical golden dragon circling the avatar with eternal dragon breath.',
          slug: 'golden-dragon-sovereign',
          assetUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60',
          thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=60',
          previewUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60',
          animationType: 'svga',
          category: 'LUXURY',
          price: 50000,
          currency: 'DIAMOND',
          durationDays: null,
          isPermanent: true,
          requiredVipLevel: 5,
          requiredUserLevel: 20,
          rarity: 'MYTHIC',
          status: 'ACTIVE',
          isFeatured: true,
          sortOrder: 3,
        },
        {
          name: '✨ Neon Rose Halo Frame',
          description: 'Soft glowing neon rose petals creating a gentle romantic ambiance.',
          slug: 'neon-rose-halo',
          assetUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=60',
          thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=150&auto=format&fit=crop&q=60',
          previewUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=60',
          animationType: 'static',
          category: 'CLASSIC',
          price: 3000,
          currency: 'DIAMOND',
          durationDays: 30,
          isPermanent: false,
          requiredVipLevel: 0,
          requiredUserLevel: 1,
          rarity: 'RARE',
          status: 'ACTIVE',
          isFeatured: false,
          sortOrder: 4,
        },
        {
          name: '💎 Diamond Crystal Tiara',
          description: 'Prismatic crystal diamond ring reflecting royal violet light.',
          slug: 'diamond-crystal-tiara',
          assetUrl: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=500&auto=format&fit=crop&q=60',
          thumbnailUrl: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=150&auto=format&fit=crop&q=60',
          previewUrl: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=500&auto=format&fit=crop&q=60',
          animationType: 'lottie',
          category: 'VIP',
          price: 10000,
          currency: 'DIAMOND',
          durationDays: 30,
          isPermanent: false,
          requiredVipLevel: 2,
          requiredUserLevel: 8,
          rarity: 'EPIC',
          status: 'ACTIVE',
          isFeatured: true,
          sortOrder: 5,
        },
        {
          name: '🇵🇰 Crescent Gold National Frame',
          description: 'Golden national crest with emerald star and crescent moon emblem.',
          slug: 'crescent-gold-national',
          assetUrl: 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=500&auto=format&fit=crop&q=60',
          thumbnailUrl: 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=150&auto=format&fit=crop&q=60',
          previewUrl: 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=500&auto=format&fit=crop&q=60',
          animationType: 'static',
          category: 'COUNTRY',
          price: 5000,
          currency: 'DIAMOND',
          durationDays: 30,
          isPermanent: false,
          requiredVipLevel: 0,
          requiredUserLevel: 1,
          countryAvailability: JSON.stringify(['PK']),
          rarity: 'RARE',
          status: 'ACTIVE',
          isFeatured: false,
          sortOrder: 6,
        },
        {
          name: '🦁 Golden Lion Guardian Frame',
          description: 'Sovereign family guild frame with roaring twin golden lion heads.',
          slug: 'golden-lion-guardian',
          assetUrl: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=500&auto=format&fit=crop&q=60',
          thumbnailUrl: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=150&auto=format&fit=crop&q=60',
          previewUrl: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=500&auto=format&fit=crop&q=60',
          animationType: 'svga',
          category: 'FAMILY',
          price: 12000,
          currency: 'DIAMOND',
          durationDays: 30,
          isPermanent: false,
          requiredVipLevel: 2,
          requiredUserLevel: 10,
          rarity: 'EPIC',
          status: 'ACTIVE',
          isFeatured: false,
          sortOrder: 7,
        },
        {
          name: '⚡ Cyberpunk Quantum Ring',
          description: 'Futuristic rotating holographic ring with cyan energy pulses.',
          slug: 'cyberpunk-quantum-ring',
          assetUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&auto=format&fit=crop&q=60',
          thumbnailUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=150&auto=format&fit=crop&q=60',
          previewUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&auto=format&fit=crop&q=60',
          animationType: 'lottie',
          category: 'PREMIUM',
          price: 6000,
          currency: 'DIAMOND',
          durationDays: 30,
          isPermanent: false,
          requiredVipLevel: 1,
          requiredUserLevel: 3,
          rarity: 'RARE',
          status: 'ACTIVE',
          isFeatured: false,
          sortOrder: 8,
        },
        {
          name: '🌸 Sakura Blossom Dream',
          description: 'Delicate falling Japanese cherry blossom petals with pink shimmer.',
          slug: 'sakura-blossom-dream',
          assetUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=500&auto=format&fit=crop&q=60',
          thumbnailUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=150&auto=format&fit=crop&q=60',
          previewUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=500&auto=format&fit=crop&q=60',
          animationType: 'static',
          category: 'FESTIVAL',
          price: 4500,
          currency: 'DIAMOND',
          durationDays: 30,
          isPermanent: false,
          requiredVipLevel: 0,
          requiredUserLevel: 1,
          rarity: 'RARE',
          status: 'ACTIVE',
          isFeatured: false,
          sortOrder: 9,
        },
        {
          name: '🎖️ Baron Royalty Ascent Frame',
          description: 'Special achievement badge frame awarded upon reaching User Level 10.',
          slug: 'baron-royalty-ascent',
          assetUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=60',
          thumbnailUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150&auto=format&fit=crop&q=60',
          previewUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=60',
          animationType: 'static',
          category: 'LEVEL',
          price: 0,
          currency: 'DIAMOND',
          durationDays: null,
          isPermanent: true,
          requiredVipLevel: 0,
          requiredUserLevel: 10,
          rarity: 'EPIC',
          status: 'ACTIVE',
          isFeatured: false,
          sortOrder: 10,
        },
        {
          name: '🌟 Starter Sparkle Glow Frame',
          description: 'Beginner welcoming sparkle ring that gives any avatar a clean radiant aura.',
          slug: 'starter-sparkle-glow',
          assetUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60',
          thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=60',
          previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60',
          animationType: 'static',
          category: 'CLASSIC',
          price: 500,
          currency: 'DIAMOND',
          durationDays: null,
          isPermanent: true,
          requiredVipLevel: 0,
          requiredUserLevel: 1,
          rarity: 'COMMON',
          status: 'ACTIVE',
          isFeatured: false,
          sortOrder: 11,
        },
      ];

      for (const item of defaultFrames) {
        await (prisma as any).avatarFrame.upsert({
          where: { slug: item.slug },
          update: {},
          create: item,
        });
      }

      console.log(`✨ [FrameService] Seeded ${defaultFrames.length} default avatar frames into database.`);
    } catch (error) {
      console.error('❌ [FrameService] Error seeding default avatar frames:', error);
    }
  }

  /**
   * Get public frame catalog with filtering and pagination.
   */
  static async getFrameCatalog(options: FrameFilterOptions = {}) {
    await this.seedDefaultFramesIfEmpty();

    const {
      category,
      status = 'ACTIVE',
      rarity,
      search,
      country,
      vipTier,
      userLevel,
      isFeatured,
      page = 1,
      limit = 20,
    } = options;

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (rarity && rarity !== 'ALL') {
      where.rarity = rarity;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (vipTier !== undefined) {
      where.requiredVipLevel = { lte: vipTier };
    }

    if (userLevel !== undefined) {
      where.requiredUserLevel = { lte: userLevel };
    }

    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search.trim() } },
        { description: { contains: search.trim() } },
        { slug: { contains: search.trim().toLowerCase() } },
      ];
    }

    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      (prisma as any).avatarFrame.count({ where }),
      (prisma as any).avatarFrame.findMany({
        where,
        orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
    ]);

    // Format items and check country availability
    const filteredItems = items.filter((frame: any) => {
      if (!country || !frame.countryAvailability) return true;
      try {
        const allowedCountries: string[] = JSON.parse(frame.countryAvailability);
        return allowedCountries.includes(country.toUpperCase());
      } catch {
        return true;
      }
    });

    return {
      frames: filteredItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single frame details by ID or Slug.
   */
  static async getFrameById(identifier: string) {
    const frame = await (prisma as any).avatarFrame.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        _count: {
          select: { ownerships: true, purchases: true },
        },
      },
    });

    if (!frame) {
      throw new Error('Avatar frame not found');
    }

    return frame;
  }

  /**
   * Get all active categories with counts.
   */
  static async getCategories() {
    await this.seedDefaultFramesIfEmpty();

    const frames = await (prisma as any).avatarFrame.findMany({
      where: { status: 'ACTIVE' },
      select: { category: true },
    });

    const categoryMap: Record<string, number> = {};
    for (const frame of frames) {
      categoryMap[frame.category] = (categoryMap[frame.category] || 0) + 1;
    }

    const categories = Object.entries(categoryMap).map(([category, count]) => ({
      category,
      count,
    }));

    return categories;
  }

  /**
   * Get user's purchased / granted avatar frame inventory.
   */
  static async getUserInventory(userId: number) {
    const now = new Date();

    // Fetch all user ownerships
    const ownerships = await (prisma as any).avatarFrameOwnership.findMany({
      where: { userId },
      include: {
        frame: true,
      },
      orderBy: [{ isEquipped: 'desc' }, { acquiredAt: 'desc' }],
    });

    // Check and auto-expire expired frames
    const processed = [];
    for (const item of ownerships) {
      if (item.status === 'ACTIVE' && item.expiresAt && new Date(item.expiresAt) < now) {
        // Mark expired
        await (prisma as any).avatarFrameOwnership.update({
          where: { id: item.id },
          data: { status: 'EXPIRED', isEquipped: false },
        });

        // If this frame was equipped on the user, clear equippedFrameId
        await (prisma as any).user.updateMany({
          where: { id: userId, equippedFrameId: item.frameId },
          data: { equippedFrameId: null },
        });

        item.status = 'EXPIRED';
        item.isEquipped = false;
      }

      const isExpired = item.status === 'EXPIRED';
      const remainingSeconds =
        item.expiresAt && !isExpired
          ? Math.max(0, Math.floor((new Date(item.expiresAt).getTime() - now.getTime()) / 1000))
          : null;

      processed.push({
        id: item.id,
        frameId: item.frameId,
        source: item.source,
        status: item.status,
        isEquipped: item.isEquipped,
        acquiredAt: item.acquiredAt,
        expiresAt: item.expiresAt,
        remainingSeconds,
        frame: item.frame,
      });
    }

    return processed;
  }

  /**
   * Purchase an avatar frame atomically.
   */
  static async purchaseFrame(userId: number, frameId: string, idempotencyKey?: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        numericId: true,
        username: true,
        diamonds: true,
        coins: true,
        vipTier: true,
        level: true,
        walletFrozen: true,
        equippedFrameId: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.walletFrozen) {
      throw new Error('Your wallet is frozen by administration. Cannot complete purchase.');
    }

    const frame = await (prisma as any).avatarFrame.findUnique({
      where: { id: frameId },
    });

    if (!frame) {
      throw new Error('Avatar frame not found');
    }

    if (frame.status !== 'ACTIVE') {
      throw new Error('This avatar frame is currently not available for purchase.');
    }

    // Check time-limited availability
    const now = new Date();
    if (frame.startAt && new Date(frame.startAt) > now) {
      throw new Error('This frame sale has not started yet.');
    }
    if (frame.endAt && new Date(frame.endAt) < now) {
      throw new Error('This frame sale has ended.');
    }

    // Check VIP requirement
    if (frame.requiredVipLevel > 0 && user.vipTier < frame.requiredVipLevel) {
      throw new Error(`This frame requires VIP Level ${frame.requiredVipLevel} or higher.`);
    }

    // Check User Level requirement
    if (frame.requiredUserLevel > 0 && user.level < frame.requiredUserLevel) {
      throw new Error(`This frame requires User Level ${frame.requiredUserLevel} or higher.`);
    }

    const finalKey = idempotencyKey || randomUUID();

    // Check existing purchase idempotency
    const existingPurchase = await (prisma as any).avatarFramePurchase.findUnique({
      where: { idempotencyKey: finalKey },
    });
    if (existingPurchase) {
      return {
        success: true,
        message: 'Frame already purchased with this idempotency key.',
        purchase: existingPurchase,
      };
    }

    // Check price & balance
    const currency = frame.currency || 'DIAMOND';
    const price = frame.price;

    if (currency === 'DIAMOND' && user.diamonds < price) {
      throw new Error(`Insufficient Diamonds. You have ${user.diamonds} Diamonds, but this frame costs ${price} Diamonds.`);
    } else if (currency === 'COIN' && user.coins < price) {
      throw new Error(`Insufficient Coins. You have ${user.coins} Coins, but this frame costs ${price} Coins.`);
    }

    // Atomic transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Deduct currency
      let updatedUser;
      if (currency === 'DIAMOND') {
        updatedUser = await tx.user.update({
          where: { id: userId },
          data: {
            diamonds: { decrement: price },
          },
          select: { id: true, numericId: true, diamonds: true, coins: true, equippedFrameId: true },
        });
      } else {
        updatedUser = await tx.user.update({
          where: { id: userId },
          data: {
            coins: { decrement: price },
          },
          select: { id: true, numericId: true, diamonds: true, coins: true, equippedFrameId: true },
        });
      }

      // 2. Record WalletTransaction ledger entry
      await tx.walletTransaction.create({
        data: {
          userId,
          type: 'COSMETIC_PURCHASE',
          currency,
          amount: -price,
          balanceAfter: currency === 'DIAMOND' ? updatedUser.diamonds : updatedUser.coins,
          referenceId: frame.id,
          notes: `Purchased avatar frame: ${frame.name} (${frame.durationDays ? `${frame.durationDays} Days` : 'Permanent'})`,
        },
      });

      // 3. Check existing active ownership
      const existingOwnership = await tx.avatarFrameOwnership.findFirst({
        where: {
          userId,
          frameId: frame.id,
          status: 'ACTIVE',
        },
      });

      let ownership;
      if (existingOwnership) {
        if (existingOwnership.expiresAt && frame.durationDays) {
          // Extend existing duration
          const currentExpiry = new Date(existingOwnership.expiresAt);
          const baseDate = currentExpiry > now ? currentExpiry : now;
          const newExpiresAt = new Date(baseDate.getTime() + frame.durationDays * 86400000);

          ownership = await tx.avatarFrameOwnership.update({
            where: { id: existingOwnership.id },
            data: {
              expiresAt: newExpiresAt,
              status: 'ACTIVE',
            },
            include: { frame: true },
          });
        } else {
          // Already permanent
          ownership = existingOwnership;
        }
      } else {
        // Create new ownership
        const expiresAt = frame.durationDays ? new Date(now.getTime() + frame.durationDays * 86400000) : null;
        ownership = await tx.avatarFrameOwnership.create({
          data: {
            userId,
            frameId: frame.id,
            source: 'PURCHASE',
            status: 'ACTIVE',
            isEquipped: false,
            acquiredAt: now,
            expiresAt,
          },
          include: { frame: true },
        });
      }

      // 4. Record AvatarFramePurchase
      const purchase = await tx.avatarFramePurchase.create({
        data: {
          userId,
          frameId: frame.id,
          amount: price,
          currency,
          idempotencyKey: finalKey,
          status: 'COMPLETED',
        },
      });

      // 5. Update frame sales and owner counts
      await tx.avatarFrame.update({
        where: { id: frame.id },
        data: {
          salesCount: { increment: 1 },
          ...(!existingOwnership ? { ownersCount: { increment: 1 } } : {}),
        },
      });

      // 6. Write AuditLog
      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: 'AVATAR_FRAME_PURCHASED',
          entityType: 'AvatarFrame',
          entityId: frame.id,
          details: JSON.stringify({
            frameName: frame.name,
            price,
            currency,
            durationDays: frame.durationDays,
            remainingBalance: currency === 'DIAMOND' ? updatedUser.diamonds : updatedUser.coins,
          }),
        },
      });

      return { updatedUser, ownership, purchase };
    });

    // Realtime notifications
    emitToUser(user.numericId, 'wallet.updated', {
      diamonds: result.updatedUser.diamonds,
      coins: result.updatedUser.coins,
    });

    emitToUser(user.numericId, 'frame.purchase.completed', {
      frame,
      ownership: result.ownership,
      purchase: result.purchase,
    });

    return {
      success: true,
      message: `Successfully purchased "${frame.name}"!`,
      ownership: result.ownership,
      purchase: result.purchase,
      diamonds: result.updatedUser.diamonds,
      coins: result.updatedUser.coins,
    };
  }

  /**
   * Equip an avatar frame.
   */
  static async equipFrame(userId: number, frameIdOrOwnershipId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, numericId: true, username: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Find ownership by ID or by frameId
    const ownership = await (prisma as any).avatarFrameOwnership.findFirst({
      where: {
        userId,
        OR: [{ id: frameIdOrOwnershipId }, { frameId: frameIdOrOwnershipId }],
        status: 'ACTIVE',
      },
      include: { frame: true },
    });

    if (!ownership) {
      throw new Error('You do not own this avatar frame or it has expired.');
    }

    // Check expiry
    const now = new Date();
    if (ownership.expiresAt && new Date(ownership.expiresAt) < now) {
      await (prisma as any).avatarFrameOwnership.update({
        where: { id: ownership.id },
        data: { status: 'EXPIRED', isEquipped: false },
      });
      throw new Error('This avatar frame has expired and can no longer be equipped.');
    }

    await prisma.$transaction([
      // Unequip all other frames
      (prisma as any).avatarFrameOwnership.updateMany({
        where: { userId },
        data: { isEquipped: false },
      }),
      // Equip target frame
      (prisma as any).avatarFrameOwnership.update({
        where: { id: ownership.id },
        data: { isEquipped: true },
      }),
      // Update User equippedFrameId
      prisma.user.update({
        where: { id: userId },
        data: { equippedFrameId: ownership.frameId } as any,
      }),
    ]);

    // Emit realtime Socket.IO events
    emitToUser(user.numericId, 'user.frame.equipped', {
      frame: ownership.frame,
      ownershipId: ownership.id,
    });

    broadcastGlobal('user.frame.updated', {
      userId,
      numericId: user.numericId,
      equippedFrameId: ownership.frameId,
      frame: ownership.frame,
    });

    return {
      success: true,
      message: `Equipped "${ownership.frame.name}"!`,
      equippedFrame: ownership.frame,
    };
  }

  /**
   * Unequip currently active avatar frame.
   */
  static async unequipFrame(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, numericId: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    await prisma.$transaction([
      (prisma as any).avatarFrameOwnership.updateMany({
        where: { userId },
        data: { isEquipped: false },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { equippedFrameId: null } as any,
      }),
    ]);

    emitToUser(user.numericId, 'user.frame.unequipped', {});

    broadcastGlobal('user.frame.updated', {
      userId,
      numericId: user.numericId,
      equippedFrameId: null,
      frame: null,
    });

    return {
      success: true,
      message: 'Avatar frame unequipped successfully.',
    };
  }

  /**
   * Get equipped frame for any user by numericId or userId.
   */
  static async getEquippedFrameForUser(identifier: number) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ id: identifier }, { numericId: identifier }],
      },
      select: {
        id: true,
        numericId: true,
        username: true,
        avatar: true,
        equippedFrameId: true,
      } as any,
    });

    if (!user || !(user as any).equippedFrameId) {
      return null;
    }

    const frame = await (prisma as any).avatarFrame.findUnique({
      where: { id: (user as any).equippedFrameId },
    });

    return frame;
  }

  /**
   * Admin: Create new avatar frame asset.
   */
  static async createFrame(data: CreateFrameDto) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await (prisma as any).avatarFrame.findUnique({ where: { slug } });
    if (existing) {
      throw new Error(`Frame with slug "${slug}" already exists. Please choose a unique name/slug.`);
    }

    const frame = await (prisma as any).avatarFrame.create({
      data: {
        name: data.name,
        description: data.description,
        slug,
        assetUrl: data.assetUrl,
        thumbnailUrl: data.thumbnailUrl || data.assetUrl,
        previewUrl: data.previewUrl || data.assetUrl,
        animationType: data.animationType || 'static',
        category: data.category || 'CLASSIC',
        price: data.price || 0,
        currency: data.currency || 'DIAMOND',
        durationDays: data.durationDays !== undefined ? data.durationDays : 30,
        isPermanent: data.isPermanent || false,
        requiredVipLevel: data.requiredVipLevel || 0,
        requiredUserLevel: data.requiredUserLevel || 0,
        countryAvailability: data.countryAvailability || null,
        rarity: data.rarity || 'COMMON',
        status: data.status || 'ACTIVE',
        isFeatured: data.isFeatured || false,
        sortOrder: data.sortOrder || 0,
        startAt: data.startAt ? new Date(data.startAt) : null,
        endAt: data.endAt ? new Date(data.endAt) : null,
      },
    });

    broadcastGlobal('cosmetic.catalog_updated', { type: 'AVATAR_FRAME', frame });

    return frame;
  }

  /**
   * Admin: Update avatar frame asset.
   */
  static async updateFrame(frameId: string, data: UpdateFrameDto) {
    const frame = await (prisma as any).avatarFrame.findUnique({ where: { id: frameId } });
    if (!frame) {
      throw new Error('Avatar frame not found');
    }

    const updated = await (prisma as any).avatarFrame.update({
      where: { id: frameId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.assetUrl && { assetUrl: data.assetUrl }),
        ...(data.thumbnailUrl && { thumbnailUrl: data.thumbnailUrl }),
        ...(data.previewUrl && { previewUrl: data.previewUrl }),
        ...(data.animationType && { animationType: data.animationType }),
        ...(data.category && { category: data.category }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.currency && { currency: data.currency }),
        ...(data.durationDays !== undefined && { durationDays: data.durationDays }),
        ...(data.isPermanent !== undefined && { isPermanent: data.isPermanent }),
        ...(data.requiredVipLevel !== undefined && { requiredVipLevel: data.requiredVipLevel }),
        ...(data.requiredUserLevel !== undefined && { requiredUserLevel: data.requiredUserLevel }),
        ...(data.countryAvailability !== undefined && { countryAvailability: data.countryAvailability }),
        ...(data.rarity && { rarity: data.rarity }),
        ...(data.status && { status: data.status }),
        ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.startAt !== undefined && { startAt: data.startAt ? new Date(data.startAt) : null }),
        ...(data.endAt !== undefined && { endAt: data.endAt ? new Date(data.endAt) : null }),
      },
    });

    broadcastGlobal('cosmetic.catalog_updated', { type: 'AVATAR_FRAME', frame: updated });

    return updated;
  }

  /**
   * Admin: Delete/Archive avatar frame.
   */
  static async deleteFrame(frameId: string) {
    const frame = await (prisma as any).avatarFrame.findUnique({ where: { id: frameId } });
    if (!frame) {
      throw new Error('Avatar frame not found');
    }

    // Soft delete: set status to ARCHIVED
    const archived = await (prisma as any).avatarFrame.update({
      where: { id: frameId },
      data: { status: 'ARCHIVED' },
    });

    broadcastGlobal('cosmetic.catalog_updated', { type: 'AVATAR_FRAME', frameId, archived: true });

    return archived;
  }

  /**
   * Admin: Grant frame to user.
   */
  static async grantFrameToUser(
    adminId: number,
    targetUserId: number,
    frameId: string,
    durationDays?: number,
    reason?: string
  ) {
    const [targetUser, frame] = await Promise.all([
      prisma.user.findFirst({
        where: { OR: [{ id: targetUserId }, { numericId: targetUserId }] },
      }),
      (prisma as any).avatarFrame.findUnique({ where: { id: frameId } }),
    ]);

    if (!targetUser) throw new Error('Target user not found');
    if (!frame) throw new Error('Avatar frame not found');

    const now = new Date();
    const days = durationDays !== undefined ? durationDays : frame.durationDays;
    const expiresAt = days ? new Date(now.getTime() + days * 86400000) : null;

    const result = await prisma.$transaction(async (tx: any) => {
      // Create or update ownership
      const existing = await tx.avatarFrameOwnership.findFirst({
        where: { userId: targetUser.id, frameId: frame.id },
      });

      let ownership;
      if (existing) {
        ownership = await tx.avatarFrameOwnership.update({
          where: { id: existing.id },
          data: {
            status: 'ACTIVE',
            source: 'ADMIN_GRANT',
            expiresAt,
          },
          include: { frame: true },
        });
      } else {
        ownership = await tx.avatarFrameOwnership.create({
          data: {
            userId: targetUser.id,
            frameId: frame.id,
            source: 'ADMIN_GRANT',
            status: 'ACTIVE',
            isEquipped: false,
            acquiredAt: now,
            expiresAt,
          },
          include: { frame: true },
        });

        await tx.avatarFrame.update({
          where: { id: frame.id },
          data: { ownersCount: { increment: 1 } },
        });
      }

      // Record Grant
      await tx.avatarFrameGrant.create({
        data: {
          adminId,
          userId: targetUser.id,
          frameId: frame.id,
          durationDays: days,
          reason: reason || 'Granted by administration',
        },
      });

      // Write AuditLog
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          action: 'AVATAR_FRAME_GRANTED_BY_ADMIN',
          entityType: 'AvatarFrame',
          entityId: frame.id,
          details: JSON.stringify({
            targetUserId: targetUser.id,
            targetNumericId: targetUser.numericId,
            frameName: frame.name,
            durationDays: days,
            reason,
          }),
        },
      });

      return ownership;
    });

    // Notify user
    emitToUser(targetUser.numericId, 'frame.granted', {
      frame,
      ownership: result,
      reason,
    });

    return {
      success: true,
      message: `Granted frame "${frame.name}" to ${targetUser.username} (ID: ${targetUser.numericId})`,
      ownership: result,
    };
  }

  /**
   * Admin: Revoke frame ownership from user.
   */
  static async revokeFrameFromUser(
    adminId: number,
    targetUserId: number,
    ownershipId: string,
    reason?: string
  ) {
    const targetUser = await prisma.user.findFirst({
      where: { OR: [{ id: targetUserId }, { numericId: targetUserId }] },
    });

    if (!targetUser) throw new Error('Target user not found');

    const ownership = await (prisma as any).avatarFrameOwnership.findUnique({
      where: { id: ownershipId },
      include: { frame: true },
    });

    if (!ownership || ownership.userId !== targetUser.id) {
      throw new Error('Frame ownership record not found for this user');
    }

    await prisma.$transaction(async (tx: any) => {
      await tx.avatarFrameOwnership.update({
        where: { id: ownershipId },
        data: {
          status: 'REVOKED',
          isEquipped: false,
          revokedAt: new Date(),
          revokedReason: reason || 'Revoked by administration',
        },
      });

      // If user had this equipped, clear it
      if ((targetUser as any).equippedFrameId === ownership.frameId) {
        await tx.user.update({
          where: { id: targetUser.id },
          data: { equippedFrameId: null },
        });
      }

      await tx.avatarFrame.update({
        where: { id: ownership.frameId },
        data: { ownersCount: { decrement: 1 } },
      });

      await tx.auditLog.create({
        data: {
          actorId: adminId,
          action: 'AVATAR_FRAME_REVOKED_BY_ADMIN',
          entityType: 'AvatarFrame',
          entityId: ownership.frameId,
          details: JSON.stringify({
            targetUserId: targetUser.id,
            targetNumericId: targetUser.numericId,
            frameName: ownership.frame.name,
            reason,
          }),
        },
      });
    });

    emitToUser(targetUser.numericId, 'frame.revoked', {
      frameId: ownership.frameId,
      reason,
    });

    broadcastGlobal('user.frame.updated', {
      userId: targetUser.id,
      numericId: targetUser.numericId,
      equippedFrameId: null,
      frame: null,
    });

    return {
      success: true,
      message: `Revoked frame "${ownership.frame.name}" from ${targetUser.username}`,
    };
  }

  /**
   * Get telemetry and sales analytics for Avatar Frames.
   */
  static async getFrameAnalytics() {
    await this.seedDefaultFramesIfEmpty();

    const [totalFrames, activeFrames, totalPurchases, purchaseAgg] = await Promise.all([
      (prisma as any).avatarFrame.count(),
      (prisma as any).avatarFrame.count({ where: { status: 'ACTIVE' } }),
      (prisma as any).avatarFramePurchase.count(),
      (prisma as any).avatarFramePurchase.aggregate({
        _sum: { amount: true },
      }),
    ]);

    const topSelling = await (prisma as any).avatarFrame.findMany({
      orderBy: { salesCount: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        category: true,
        price: true,
        salesCount: true,
        ownersCount: true,
        rarity: true,
        thumbnailUrl: true,
      },
    });

    const recentPurchases = await (prisma as any).avatarFramePurchase.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: { select: { id: true, numericId: true, username: true, avatar: true } },
        frame: { select: { id: true, name: true, rarity: true, price: true, currency: true } },
      },
    });

    return {
      overview: {
        totalFrames,
        activeFrames,
        totalPurchases,
        totalDiamondVolume: purchaseAgg._sum.amount || 0,
      },
      topSelling,
      recentPurchases,
    };
  }

  /**
   * Cron / Periodic task to process expired frames.
   */
  static async processExpiredFrames() {
    const now = new Date();
    const expiredList = await (prisma as any).avatarFrameOwnership.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: { lt: now },
      },
      include: {
        user: { select: { id: true, numericId: true, equippedFrameId: true } },
        frame: { select: { id: true, name: true } },
      },
    });

    let count = 0;
    for (const item of expiredList) {
      await prisma.$transaction([
        (prisma as any).avatarFrameOwnership.update({
          where: { id: item.id },
          data: { status: 'EXPIRED', isEquipped: false },
        }),
        ...(item.user.equippedFrameId === item.frameId
          ? [
              prisma.user.update({
                where: { id: item.userId },
                data: { equippedFrameId: null } as any,
              }),
            ]
          : []),
      ]);

      emitToUser(item.user.numericId, 'frame.expired', {
        frameId: item.frameId,
        frameName: item.frame.name,
      });

      if (item.user.equippedFrameId === item.frameId) {
        broadcastGlobal('user.frame.updated', {
          userId: item.userId,
          numericId: item.user.numericId,
          equippedFrameId: null,
          frame: null,
        });
      }

      count++;
    }

    return { processedCount: count };
  }
}
