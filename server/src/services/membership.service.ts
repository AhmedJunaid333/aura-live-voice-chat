import { prisma } from '../config/database.js';
import { getIO } from '../websocket/socketServer.js';

export interface AwardXpInput {
  userId: number;
  membershipType?: 'VIP' | 'SVIP';
  source: 'RECHARGE' | 'PURCHASE' | 'ACTIVITY' | 'ADMIN_GRANT' | 'EVENT' | 'CAMPAIGN';
  amount?: number;
  xpAwarded: number;
  referenceId?: string;
  notes?: string;
  createdBy?: string;
}

export interface ClaimRewardInput {
  userId: number;
  membershipType: 'VIP' | 'SVIP';
  level: number;
  rewardType: 'LEVEL_UP' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  periodKey?: string;
}

export class MembershipService {
  // ════════════════════════════════════════════════════════════════════════════
  // 1. SEEDING & CATALOGS (VIP 1–7 & SVIP 1–15)
  // ════════════════════════════════════════════════════════════════════════════

  static async getVipTiers() {
    let tiers = await prisma.vipLevelConfig.findMany({
      where: { active: true },
      orderBy: { level: 'asc' },
    });

    if (tiers.length === 0) {
      await this.seedVipLevels();
      tiers = await prisma.vipLevelConfig.findMany({
        where: { active: true },
        orderBy: { level: 'asc' },
      });
    }
    return tiers;
  }

  static async getSvipTiers() {
    let tiers = await prisma.svipLevelConfig.findMany({
      where: { active: true },
      orderBy: { level: 'asc' },
    });

    if (tiers.length === 0) {
      await this.seedSvipLevels();
      tiers = await prisma.svipLevelConfig.findMany({
        where: { active: true },
        orderBy: { level: 'asc' },
      });
    }
    return tiers;
  }

  static async seedVipLevels() {
    const defaultVipLevels = [
      {
        level: 1,
        name: 'VIP 1 Bronze Knight',
        title: 'Bronze Knight 🥉',
        xpRequired: 1000,
        rechargeRequiredUsd: 10.0,
        durationDays: 30,
        badgeIcon: '/uploads/vip_svgas/vip_1_medal.svga',
        colorHex: '#CD7F32',
        entryEffect: '/uploads/vip_svgas/vip_1_entry.svga',
        nameEffect: '/uploads/vip_svgas/vip_1_profile_page.svga',
        chatBubble: 'Bronze Crest Bubble 💬',
        frameId: 'vip-1-frame',
        perksJson: JSON.stringify([
          'VIP 1 Chat Badge & Bronze Frame 🥉',
          '1.1x Level EXP Boost 📈',
          'Basic Voice Seat Soundwave 🎙️',
          'Bronze Bell VIP 1 Exclusive Gift 🎁',
          'Profile VIP 1 Nobility SVGA Theme ✨',
        ]),
        levelUpRewardJson: JSON.stringify({ diamonds: 500, coins: 5000, xp: 1000 }),
        dailyRewardJson: JSON.stringify({ diamonds: 50, coins: 500 }),
        weeklyRewardJson: JSON.stringify({ diamonds: 300, coins: 3000 }),
        monthlyRewardJson: JSON.stringify({ diamonds: 1500, coins: 15000 }),
        sortOrder: 1,
      },
      {
        level: 2,
        name: 'VIP 2 Silver Baron',
        title: 'Silver Baron 🥈',
        xpRequired: 5000,
        rechargeRequiredUsd: 50.0,
        durationDays: 30,
        badgeIcon: '/uploads/vip_svgas/vip_2_medal.svga',
        colorHex: '#C0C0C0',
        entryEffect: '/uploads/vip_svgas/vip_2_entry.svga',
        nameEffect: '/uploads/vip_svgas/vip_2_profile_page.svga',
        chatBubble: 'Silver Baron Bubble 💬',
        frameId: 'vip-2-frame',
        perksJson: JSON.stringify([
          'Silver Name & VIP 2 Avatar Halo 🥈',
          '1.2x Level EXP Boost 📈',
          'Sports Car 3D SVGA Room Entry Effect 🏎️',
          'VIP 2 Exclusive Silver Star Gift 🎁',
          'Audience Seat Priority Rank 🪑',
        ]),
        levelUpRewardJson: JSON.stringify({ diamonds: 1000, coins: 10000, xp: 2500 }),
        dailyRewardJson: JSON.stringify({ diamonds: 100, coins: 1000 }),
        weeklyRewardJson: JSON.stringify({ diamonds: 600, coins: 6000 }),
        monthlyRewardJson: JSON.stringify({ diamonds: 3000, coins: 30000 }),
        sortOrder: 2,
      },
      {
        level: 3,
        name: 'VIP 3 Gold Count',
        title: 'Gold Count 🥇',
        xpRequired: 20000,
        rechargeRequiredUsd: 200.0,
        durationDays: 30,
        badgeIcon: '/uploads/vip_svgas/vip_3_medal.svga',
        colorHex: '#FFD700',
        entryEffect: '/uploads/vip_svgas/vip_3_entry.svga',
        nameEffect: '/uploads/vip_svgas/vip_3_profile_page.svga',
        chatBubble: 'Gold Count Regal Bubble 💬',
        frameId: 'vip-3-frame',
        perksJson: JSON.stringify([
          'Golden Crown Avatar Frame & Badge 👑',
          '1.5x Level EXP Boost 📈',
          'Golden Helicopter 3D SVGA Descent 🚁',
          'VIP 3 Exclusive Gold Trophy Gift 🏆',
          'Host Live Room Spotlight Glow ✨',
        ]),
        levelUpRewardJson: JSON.stringify({ diamonds: 2500, coins: 25000, xp: 5000 }),
        dailyRewardJson: JSON.stringify({ diamonds: 250, coins: 2500 }),
        weeklyRewardJson: JSON.stringify({ diamonds: 1500, coins: 15000 }),
        monthlyRewardJson: JSON.stringify({ diamonds: 7500, coins: 75000 }),
        sortOrder: 3,
      },
      {
        level: 4,
        name: 'VIP 4 Platinum Marquis',
        title: 'Platinum Marquis 💎',
        xpRequired: 50000,
        rechargeRequiredUsd: 500.0,
        durationDays: 30,
        badgeIcon: '/uploads/vip_svgas/vip_4_medal.svga',
        colorHex: '#E5E4E2',
        entryEffect: '/uploads/vip_svgas/vip_4_entry.svga',
        nameEffect: '/uploads/vip_svgas/vip_4_profile_page.svga',
        chatBubble: 'Platinum Diamond Bubble 💬',
        frameId: 'vip-4-frame',
        perksJson: JSON.stringify([
          'Platinum Wings Hologram Avatar Frame 💎',
          '2.0x Level EXP Boost 📈',
          'Private Jet 3D SVGA High-Speed Flyby ✈️',
          'VIP 4 Exclusive Platinum Pegasus 🦄',
          'Voice Seat Special Soundwave Ring 🎙️',
        ]),
        levelUpRewardJson: JSON.stringify({ diamonds: 5000, coins: 50000, xp: 10000 }),
        dailyRewardJson: JSON.stringify({ diamonds: 500, coins: 5000 }),
        weeklyRewardJson: JSON.stringify({ diamonds: 3000, coins: 30000 }),
        monthlyRewardJson: JSON.stringify({ diamonds: 15000, coins: 150000 }),
        sortOrder: 4,
      },
      {
        level: 5,
        name: 'VIP 5 Diamond Lord',
        title: 'Diamond Lord 👑',
        xpRequired: 100000,
        rechargeRequiredUsd: 1000.0,
        durationDays: 30,
        badgeIcon: '/uploads/vip_svgas/vip_5_medal.svga',
        colorHex: '#9333EA',
        entryEffect: '/uploads/vip_svgas/vip_5_entry.svga',
        nameEffect: '/uploads/vip_svgas/vip_5_profile_page.svga',
        chatBubble: 'Diamond Lord Royal Bubble 💬',
        frameId: 'vip-5-frame',
        perksJson: JSON.stringify([
          'Royal Emperor Crown 3D Rotating Frame 👑',
          '2.5x Level EXP Boost 📈',
          'Supercar Drift 3D SVGA Smoke Entry 🏎️🔥',
          'VIP 5 Diamond Lion Statue Gift 🦁',
          'Priority Mic Seat Override Privilege 🎙️',
          'Unlock SVIP Eligibility Matrix ⚡',
        ]),
        levelUpRewardJson: JSON.stringify({ diamonds: 10000, coins: 100000, xp: 20000 }),
        dailyRewardJson: JSON.stringify({ diamonds: 1000, coins: 10000 }),
        weeklyRewardJson: JSON.stringify({ diamonds: 6000, coins: 60000 }),
        monthlyRewardJson: JSON.stringify({ diamonds: 30000, coins: 300000 }),
        sortOrder: 5,
      },
      {
        level: 6,
        name: 'VIP 6 Crown King',
        title: 'Crown King 👑⚡',
        xpRequired: 250000,
        rechargeRequiredUsd: 2500.0,
        durationDays: 30,
        badgeIcon: '/uploads/vip_svgas/vip_6_medal.svga',
        colorHex: '#EC4899',
        entryEffect: '/uploads/vip_svgas/vip_6_entry.svga',
        nameEffect: '/uploads/vip_svgas/vip_6_profile_page.svga',
        chatBubble: 'Crown King Gold Crest Bubble 💬',
        frameId: 'vip-6-frame',
        perksJson: JSON.stringify([
          'Imperial Crown 360° Sunburst Frame 👑⚡',
          '3.0x Level EXP Boost 📈',
          'Super Yacht 3D SVGA Ocean Waves Entry 🛥️',
          'VIP 6 Crown King Dragon Gift 🐉',
          'Anti-Kick & Anti-Mute Immunity Shield 🛡️',
          'Global Room Banner Top Announcement 📢',
        ]),
        levelUpRewardJson: JSON.stringify({ diamonds: 25000, coins: 250000, xp: 50000 }),
        dailyRewardJson: JSON.stringify({ diamonds: 2500, coins: 25000 }),
        weeklyRewardJson: JSON.stringify({ diamonds: 15000, coins: 150000 }),
        monthlyRewardJson: JSON.stringify({ diamonds: 75000, coins: 750000 }),
        sortOrder: 6,
      },
      {
        level: 7,
        name: 'VIP 7 Sovereign Emperor',
        title: 'Sovereign Emperor 👑🔥',
        xpRequired: 500000,
        rechargeRequiredUsd: 5000.0,
        durationDays: 30,
        badgeIcon: '/uploads/vip_svgas/vip_7_medal.svga',
        colorHex: '#FF5E00',
        entryEffect: '/uploads/vip_svgas/vip_7_entry.svga',
        nameEffect: '/uploads/vip_svgas/vip_7_profile_page.svga',
        chatBubble: 'Sovereign Emperor Dragon Bubble 💬',
        frameId: 'vip-7-frame',
        perksJson: JSON.stringify([
          'Cosmic Sovereign Mythic 3D SVGA Frame 🌌',
          '4.0x Level EXP Boost 📈',
          'Galaxy Rocket 3D SVGA Cosmic Ascent 🚀',
          'VIP 7 Sovereign Castle Takeover Gift 🏰',
          'Global Screen Takeover Banner Broadcast 📢',
          'Absolute Room Immunity (Kick/Mute/Ban Proof) 🛡️',
          'Direct VIP Concierge Dedicated Support 🎖️',
        ]),
        levelUpRewardJson: JSON.stringify({ diamonds: 50000, coins: 500000, xp: 100000 }),
        dailyRewardJson: JSON.stringify({ diamonds: 5000, coins: 50000 }),
        weeklyRewardJson: JSON.stringify({ diamonds: 30000, coins: 300000 }),
        monthlyRewardJson: JSON.stringify({ diamonds: 150000, coins: 1500000 }),
        sortOrder: 7,
      },
    ];

    for (const lvl of defaultVipLevels) {
      await prisma.vipLevelConfig.upsert({
        where: { level: lvl.level },
        update: lvl,
        create: lvl,
      });

      // Also upsert the corresponding AvatarFrame in avatarFrame catalog
      try {
        await (prisma as any).avatarFrame.upsert({
          where: { slug: `vip-${lvl.level}-frame` },
          update: {
            name: `${lvl.name} Frame`,
            description: `Exclusive SVGA animated avatar frame for ${lvl.title} nobility.`,
            assetUrl: `/uploads/vip_svgas/vip_${lvl.level}_frame.svga`,
            thumbnailUrl: `/uploads/vip_svgas/vip_${lvl.level}_frame.svga`,
            previewUrl: `/uploads/vip_svgas/vip_${lvl.level}_frame.svga`,
            animationType: 'svga',
            category: 'VIP',
            requiredVipLevel: lvl.level,
            status: 'ACTIVE',
          },
          create: {
            name: `${lvl.name} Frame`,
            description: `Exclusive SVGA animated avatar frame for ${lvl.title} nobility.`,
            slug: `vip-${lvl.level}-frame`,
            assetUrl: `/uploads/vip_svgas/vip_${lvl.level}_frame.svga`,
            thumbnailUrl: `/uploads/vip_svgas/vip_${lvl.level}_frame.svga`,
            previewUrl: `/uploads/vip_svgas/vip_${lvl.level}_frame.svga`,
            animationType: 'svga',
            category: 'VIP',
            price: lvl.rechargeRequiredUsd * 100,
            currency: 'DIAMOND',
            durationDays: 30,
            isPermanent: false,
            requiredVipLevel: lvl.level,
            requiredUserLevel: 1,
            rarity: lvl.level >= 5 ? 'MYTHIC' : lvl.level >= 3 ? 'LEGENDARY' : 'RARE',
            status: 'ACTIVE',
            isFeatured: true,
            sortOrder: lvl.level,
          },
        });
      } catch (_) {}
    }
  }

  static async seedSvipLevels() {
    const defaultSvipLevels = [];
    const titles = [
      'Sovereign Knight ⚡',
      'Sovereign Vanguard ⚔️',
      'Sovereign Commander 🛡️',
      'Sovereign Warlord 🔱',
      'Sovereign Archon 🔮',
      'Sovereign Overlord 🌌',
      'Sovereign Grand Duke 👑',
      'Sovereign High Monarch ⚜️',
      'Imperial Sovereign 🐉',
      'Celestial Sovereign 🌠',
      'Celestial Grand Archon 💫',
      'Cosmic Sovereign Overlord 🪐',
      'Cosmic Titan Sovereign ⚡',
      'Eternal Celestial God 🌌',
      'Sovereign Emperor of the Cosmos 👑✨',
    ];

    const xpRequirements = [
      100000, 200000, 350000, 550000, 800000,
      1100000, 1500000, 2000000, 2600000, 3300000,
      4100000, 5000000, 6000000, 7200000, 8500000,
    ];

    for (let i = 1; i <= 15; i++) {
      const minVip = i >= 10 ? 7 : (i >= 6 ? 6 : 5);
      const minRecharge = xpRequirements[i - 1] / 100;
      defaultSvipLevels.push({
        level: i,
        name: `SVIP ${i} ${titles[i - 1]}`,
        title: titles[i - 1],
        xpRequired: xpRequirements[i - 1],
        minVipLevel: minVip,
        minLifetimeRecharge: minRecharge,
        durationDays: 30,
        badgeIcon: `svip_${i}`,
        crownIcon: `crown_${i}`,
        colorHex: i > 10 ? '#FF5E00' : (i > 5 ? '#EC4899' : '#9333EA'),
        entryEffect: `SVIP ${i} Imperial Galactic Supercar 🚀`,
        nameEffect: `SVIP ${i} Cosmic Particle Glow ✨`,
        chatBubble: `SVIP ${i} Imperial Diamond Bubble 💬`,
        exclusiveRoomAccess: true,
        prioritySeat: true,
        antiKickImmunity: true,
        invisibleEntry: i >= 5,
        perksJson: JSON.stringify([
          `SVIP ${i} Supreme Animated Crown Badge 👑`,
          `${(2.5 + i * 0.2).toFixed(1)}x Level EXP Boost 📈`,
          `SVIP ${i} 3D Matrix Hologram Frame 🌟`,
          `Priority Mic Seat & Invisible Room Entry 🎙️`,
          `SVIP ${i} Exclusive Luxury Gift Collection 🎁`,
          `Global Room Takeover Broadcast on Join 📢`,
          `Personal Account Manager & 24/7 Concierge 🎖️`,
        ]),
        levelUpRewardJson: JSON.stringify({
          diamonds: 5000 * i,
          coins: 50000 * i,
          xp: 10000 * i,
        }),
        dailyRewardJson: JSON.stringify({ diamonds: 500 * i, coins: 5000 * i }),
        weeklyRewardJson: JSON.stringify({ diamonds: 3000 * i, coins: 30000 * i }),
        monthlyRewardJson: JSON.stringify({ diamonds: 15000 * i, coins: 150000 * i }),
        sortOrder: i,
      });
    }

    for (const lvl of defaultSvipLevels) {
      await prisma.svipLevelConfig.upsert({
        where: { level: lvl.level },
        update: lvl,
        create: lvl,
      });
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 2. USER MEMBERSHIP PROFILE & REAL-TIME STATE
  // ════════════════════════════════════════════════════════════════════════════

  static async getOrCreateProfile(userId: number) {
    let profile = await prisma.membershipProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!profile) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      profile = await prisma.membershipProfile.create({
        data: {
          userId,
          vipLevel: user?.vipTier && user.vipTier <= 7 ? user.vipTier : 0,
          svipLevel: 0,
          vipXp: 0,
          svipXp: 0,
          lifetimeRechargeUsd: 0.0,
          vipStatus: (user?.vipTier ?? 0) > 0 ? 'ACTIVE' : 'ACTIVE',
          svipStatus: 'INACTIVE',
        },
        include: { user: true },
      });
    }

    return profile;
  }

  static async getUserMembershipState(userId: number) {
    const profile = await this.getOrCreateProfile(userId);
    const vipTiers = await this.getVipTiers();
    const svipTiers = await this.getSvipTiers();

    // Find current & next tier info
    const currentVipTier = vipTiers.find((t) => t.level === profile.vipLevel) || null;
    const nextVipTier = vipTiers.find((t) => t.level === profile.vipLevel + 1) || null;

    const currentSvipTier = svipTiers.find((t) => t.level === profile.svipLevel) || null;
    const nextSvipTier = svipTiers.find((t) => t.level === profile.svipLevel + 1) || null;

    // Calculate VIP Progress
    let vipProgress = 1.0;
    let vipXpRequired = 0;
    let vipXpRemaining = 0;

    if (nextVipTier) {
      const prevXp = currentVipTier?.xpRequired ?? 0;
      const targetXp = nextVipTier.xpRequired;
      const currentXp = profile.vipXp;
      vipXpRequired = targetXp - prevXp;
      vipXpRemaining = Math.max(0, targetXp - currentXp);
      const earned = Math.max(0, currentXp - prevXp);
      vipProgress = Math.min(1.0, Math.max(0.0, earned / (vipXpRequired || 1)));
    }

    // Calculate SVIP Progress
    let svipProgress = 1.0;
    let svipXpRequired = 0;
    let svipXpRemaining = 0;

    if (nextSvipTier) {
      const prevXp = currentSvipTier?.xpRequired ?? 0;
      const targetXp = nextSvipTier.xpRequired;
      const currentXp = profile.svipXp;
      svipXpRequired = targetXp - prevXp;
      svipXpRemaining = Math.max(0, targetXp - currentXp);
      const earned = Math.max(0, currentXp - prevXp);
      svipProgress = Math.min(1.0, Math.max(0.0, earned / (svipXpRequired || 1)));
    }

    // Check claim status for today/week/month
    const now = new Date();
    const todayKey = now.toISOString().split('T')[0];
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const recentClaims = await prisma.membershipRewardClaim.findMany({
      where: { userId },
      orderBy: { claimedAt: 'desc' },
      take: 20,
    });

    const isDailyClaimed = recentClaims.some(
      (c) => c.rewardType === 'DAILY' && c.periodKey === todayKey
    );
    const isMonthlyClaimed = recentClaims.some(
      (c) => c.rewardType === 'MONTHLY' && c.periodKey === monthKey
    );

    return {
      profile,
      vip: {
        currentLevel: profile.vipLevel,
        currentTier: currentVipTier,
        nextTier: nextVipTier,
        xp: profile.vipXp,
        progress: vipProgress,
        xpRequired: vipXpRequired,
        xpRemaining: vipXpRemaining,
        status: profile.vipStatus,
        startedAt: profile.vipStartedAt,
        expiresAt: profile.vipExpiresAt,
      },
      svip: {
        currentLevel: profile.svipLevel,
        currentTier: currentSvipTier,
        nextTier: nextSvipTier,
        xp: profile.svipXp,
        progress: svipProgress,
        xpRequired: svipXpRequired,
        xpRemaining: svipXpRemaining,
        status: profile.svipStatus,
        startedAt: profile.svipStartedAt,
        expiresAt: profile.svipExpiresAt,
      },
      claims: {
        isDailyClaimed,
        isMonthlyClaimed,
      },
      vipTiers,
      svipTiers,
    };
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 3. AUTHORITATIVE XP ENGINE & AUTOMATIC LEVEL CALCULATION
  // ════════════════════════════════════════════════════════════════════════════

  static async awardXp(input: AwardXpInput) {
    const { userId, source, amount = 0, xpAwarded, referenceId, notes, createdBy = 'SYSTEM' } = input;
    const membershipType = input.membershipType || 'VIP';

    if (xpAwarded <= 0) return null;

    return await prisma.$transaction(async (tx) => {
      // 1. Record immutable XP ledger transaction
      const xpTx = await tx.membershipXpTransaction.create({
        data: {
          userId,
          membershipType,
          source,
          amount,
          xpAwarded,
          referenceId,
          notes,
          createdBy,
          status: 'CONFIRMED',
        },
      });

      // 2. Fetch profile
      let profile = await tx.membershipProfile.findUnique({ where: { userId } });
      if (!profile) {
        profile = await tx.membershipProfile.create({
          data: {
            userId,
            vipLevel: 0,
            svipLevel: 0,
            vipXp: 0,
            svipXp: 0,
            lifetimeRechargeUsd: source === 'RECHARGE' ? amount : 0,
          },
        });
      }

      // Update XP & lifetime spend
      const updatedVipXp = profile.vipXp + (membershipType === 'VIP' ? xpAwarded : 0);
      const updatedSvipXp = profile.svipXp + (membershipType === 'SVIP' ? xpAwarded : (profile.vipLevel >= 5 ? Math.floor(xpAwarded * 0.5) : 0));
      const updatedRecharge = profile.lifetimeRechargeUsd + (source === 'RECHARGE' ? amount : 0);

      // 3. Evaluate VIP Tier Progression (VIP 1 to 7)
      const vipTiers = await tx.vipLevelConfig.findMany({
        where: { active: true },
        orderBy: { level: 'asc' },
      });

      let newVipLevel = 0;
      for (const tier of vipTiers) {
        if (tier.level > 7) break; // Strict VIP 1-7 ceiling
        if (updatedVipXp >= tier.xpRequired) {
          newVipLevel = tier.level;
        }
      }

      // 4. Evaluate SVIP Progression (SVIP 1 to 15)
      const svipTiers = await tx.svipLevelConfig.findMany({
        where: { active: true },
        orderBy: { level: 'asc' },
      });

      let newSvipLevel = 0;
      for (const tier of svipTiers) {
        if (tier.level > 15) break; // Strict SVIP 1-15 ceiling
        if (
          newVipLevel >= tier.minVipLevel &&
          updatedRecharge >= tier.minLifetimeRecharge &&
          updatedSvipXp >= tier.xpRequired
        ) {
          newSvipLevel = tier.level;
        }
      }

      const isVipUpgraded = newVipLevel > profile.vipLevel;
      const isSvipUpgraded = newSvipLevel > profile.svipLevel;

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Update profile
      const updatedProfile = await tx.membershipProfile.update({
        where: { userId },
        data: {
          vipXp: updatedVipXp,
          svipXp: updatedSvipXp,
          lifetimeRechargeUsd: updatedRecharge,
          vipLevel: newVipLevel,
          svipLevel: newSvipLevel,
          vipStatus: newVipLevel > 0 ? 'ACTIVE' : profile.vipStatus,
          svipStatus: newSvipLevel > 0 ? 'ACTIVE' : profile.svipStatus,
          vipStartedAt: isVipUpgraded ? now : profile.vipStartedAt,
          vipExpiresAt: isVipUpgraded ? expiresAt : profile.vipExpiresAt,
          svipStartedAt: isSvipUpgraded ? now : profile.svipStartedAt,
          svipExpiresAt: isSvipUpgraded ? expiresAt : profile.svipExpiresAt,
        },
      });

      // Also sync user table vipTier
      await tx.user.update({
        where: { id: userId },
        data: { vipTier: newVipLevel },
      });

      // 5. Handle VIP Level-Up Events & Rewards
      if (isVipUpgraded) {
        for (let lvl = profile.vipLevel + 1; lvl <= newVipLevel; lvl++) {
          const tierCfg = vipTiers.find((t) => t.level === lvl);
          await tx.membershipHistory.create({
            data: {
              userId,
              membershipType: 'VIP',
              previousLevel: lvl - 1,
              newLevel: lvl,
              xpAtTransition: updatedVipXp,
              eventType: 'UPGRADE',
              reason: `Automatic promotion to ${tierCfg?.name || `VIP ${lvl}`}`,
            },
          });

          // Level-up reward idempotency
          if (tierCfg?.levelUpRewardJson) {
            try {
              const reward = JSON.parse(tierCfg.levelUpRewardJson);
              const idempotencyKey = `USER_${userId}_VIP_${lvl}_LEVEL_UP`;
              const existingClaim = await tx.membershipRewardClaim.findUnique({
                where: { idempotencyKey },
              });

              if (!existingClaim) {
                await tx.membershipRewardClaim.create({
                  data: {
                    idempotencyKey,
                    userId,
                    membershipType: 'VIP',
                    level: lvl,
                    rewardType: 'LEVEL_UP',
                    diamondsAwarded: reward.diamonds ?? 0,
                    coinsAwarded: reward.coins ?? 0,
                    xpAwarded: reward.xp ?? 0,
                  },
                });

                if (reward.diamonds || reward.coins) {
                  await tx.user.update({
                    where: { id: userId },
                    data: {
                      diamonds: { increment: reward.diamonds ?? 0 },
                      coins: { increment: reward.coins ?? 0 },
                    },
                  });
                }
              }
            } catch (_) {}
          }
        }
      }

      // 6. Handle SVIP Level-Up Events & Rewards
      if (isSvipUpgraded) {
        for (let lvl = profile.svipLevel + 1; lvl <= newSvipLevel; lvl++) {
          const tierCfg = svipTiers.find((t) => t.level === lvl);
          await tx.membershipHistory.create({
            data: {
              userId,
              membershipType: 'SVIP',
              previousLevel: lvl - 1,
              newLevel: lvl,
              xpAtTransition: updatedSvipXp,
              eventType: 'UPGRADE',
              reason: `Automatic promotion to ${tierCfg?.name || `SVIP ${lvl}`}`,
            },
          });

          if (tierCfg?.levelUpRewardJson) {
            try {
              const reward = JSON.parse(tierCfg.levelUpRewardJson);
              const idempotencyKey = `USER_${userId}_SVIP_${lvl}_LEVEL_UP`;
              const existingClaim = await tx.membershipRewardClaim.findUnique({
                where: { idempotencyKey },
              });

              if (!existingClaim) {
                await tx.membershipRewardClaim.create({
                  data: {
                    idempotencyKey,
                    userId,
                    membershipType: 'SVIP',
                    level: lvl,
                    rewardType: 'LEVEL_UP',
                    diamondsAwarded: reward.diamonds ?? 0,
                    coinsAwarded: reward.coins ?? 0,
                    xpAwarded: reward.xp ?? 0,
                  },
                });

                if (reward.diamonds || reward.coins) {
                  await tx.user.update({
                    where: { id: userId },
                    data: {
                      diamonds: { increment: reward.diamonds ?? 0 },
                      coins: { increment: reward.coins ?? 0 },
                    },
                  });
                }
              }
            } catch (_) {}
          }
        }
      }

      // Broadcast Socket.IO events if upgraded
      try {
        const io = getIO();
        if (io) {
          if (isVipUpgraded) {
            io.emit('membership.level_up', {
              userId,
              type: 'VIP',
              newLevel: newVipLevel,
              tierName: vipTiers.find((t) => t.level === newVipLevel)?.name,
            });
          }
          if (isSvipUpgraded) {
            io.emit('membership.level_up', {
              userId,
              type: 'SVIP',
              newLevel: newSvipLevel,
              tierName: svipTiers.find((t) => t.level === newSvipLevel)?.name,
            });
          }
        }
      } catch (_) {}

      return {
        xpTx,
        profile: updatedProfile,
        isVipUpgraded,
        isSvipUpgraded,
        newVipLevel,
        newSvipLevel,
      };
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 4. REWARD CLAIM ENGINE (IDEMPOTENT ANTI-DUPLICATE)
  // ════════════════════════════════════════════════════════════════════════════

  static async claimReward(input: ClaimRewardInput) {
    const { userId, membershipType, level, rewardType } = input;
    const now = new Date();

    let periodKey = input.periodKey;
    if (!periodKey) {
      if (rewardType === 'DAILY') {
        periodKey = now.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (rewardType === 'WEEKLY') {
        const weekNum = Math.ceil(now.getDate() / 7);
        periodKey = `${now.getFullYear()}-M${now.getMonth() + 1}-W${weekNum}`;
      } else if (rewardType === 'MONTHLY') {
        periodKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      } else {
        periodKey = 'ONCE';
      }
    }

    const idempotencyKey = `USER_${userId}_${membershipType}_${level}_${rewardType}_${periodKey}`;

    return await prisma.$transaction(async (tx) => {
      // 1. Check existing claim
      const existing = await tx.membershipRewardClaim.findUnique({
        where: { idempotencyKey },
      });

      if (existing) {
        throw new Error(`Reward already claimed for this period! (Key: ${idempotencyKey})`);
      }

      // 2. Validate membership eligibility
      const profile = await tx.membershipProfile.findUnique({ where: { userId } });
      if (!profile) throw new Error('Membership profile not found.');

      if (membershipType === 'VIP' && profile.vipLevel < level) {
        throw new Error(`Requires VIP ${level} to claim this reward.`);
      }
      if (membershipType === 'SVIP' && profile.svipLevel < level) {
        throw new Error(`Requires SVIP ${level} to claim this reward.`);
      }

      // 3. Determine reward payload
      let rewardData: { diamonds?: number; coins?: number; xp?: number } = { diamonds: 50, coins: 500 };
      if (membershipType === 'VIP') {
        const tier = await tx.vipLevelConfig.findUnique({ where: { level } });
        if (tier) {
          const json =
            rewardType === 'DAILY'
              ? tier.dailyRewardJson
              : rewardType === 'WEEKLY'
              ? tier.weeklyRewardJson
              : rewardType === 'MONTHLY'
              ? tier.monthlyRewardJson
              : tier.levelUpRewardJson;
          if (json) {
            try {
              rewardData = JSON.parse(json);
            } catch (_) {}
          }
        }
      } else {
        const tier = await tx.svipLevelConfig.findUnique({ where: { level } });
        if (tier) {
          const json =
            rewardType === 'DAILY'
              ? tier.dailyRewardJson
              : rewardType === 'WEEKLY'
              ? tier.weeklyRewardJson
              : rewardType === 'MONTHLY'
              ? tier.monthlyRewardJson
              : tier.levelUpRewardJson;
          if (json) {
            try {
              rewardData = JSON.parse(json);
            } catch (_) {}
          }
        }
      }

      const diamonds = rewardData.diamonds ?? 0;
      const coins = rewardData.coins ?? 0;
      const xp = rewardData.xp ?? 0;

      // 4. Record claim
      const claim = await tx.membershipRewardClaim.create({
        data: {
          idempotencyKey,
          userId,
          membershipType,
          level,
          rewardType,
          periodKey,
          diamondsAwarded: diamonds,
          coinsAwarded: coins,
          xpAwarded: xp,
        },
      });

      // 5. Credit user
      const user = await tx.user.update({
        where: { id: userId },
        data: {
          diamonds: { increment: diamonds },
          coins: { increment: coins },
        },
      });

      // Write ledger record
      if (diamonds > 0 || coins > 0) {
        await tx.walletTransaction.create({
          data: {
            userId,
            type: `${membershipType}_${rewardType}_REWARD`,
            currency: diamonds > 0 ? 'DIAMOND' : 'COIN',
            amount: diamonds > 0 ? diamonds : coins,
            balanceAfter: diamonds > 0 ? user.diamonds : user.coins,
            referenceId: claim.id,
            notes: `${membershipType} Level ${level} ${rewardType} Reward Claimed`,
          },
        });
      }

      return {
        claim,
        rewardsGranted: { diamonds, coins, xp },
        newBalance: { diamonds: user.diamonds, coins: user.coins },
      };
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 5. CASCADING BENEFITS & PERMISSIONS ENGINE
  // ════════════════════════════════════════════════════════════════════════════

  static async getActiveBenefits(userId: number) {
    const profile = await this.getOrCreateProfile(userId);
    const vipLevel = profile.vipLevel;
    const svipLevel = profile.svipLevel;

    const allVip = await prisma.vipLevelConfig.findMany({
      where: { active: true, level: { lte: vipLevel } },
      orderBy: { level: 'asc' },
    });

    const allSvip = await prisma.svipLevelConfig.findMany({
      where: { active: true, level: { lte: svipLevel } },
      orderBy: { level: 'asc' },
    });

    const activePerks: string[] = [];
    let badgeIcon = 'user';
    let colorHex = '#CD7F32';
    let entryEffect: string | null = null;
    let nameEffect: string | null = null;
    let chatBubble: string | null = null;
    let antiKickImmunity = false;
    let prioritySeat = false;
    let invisibleEntry = false;

    for (const v of allVip) {
      badgeIcon = v.badgeIcon;
      colorHex = v.colorHex;
      if (v.entryEffect) entryEffect = v.entryEffect;
      if (v.nameEffect) nameEffect = v.nameEffect;
      if (v.chatBubble) chatBubble = v.chatBubble;
      if (v.level >= 6) antiKickImmunity = true;
      if (v.level >= 5) prioritySeat = true;

      try {
        const perks = JSON.parse(v.perksJson);
        activePerks.push(...perks);
      } catch (_) {}
    }

    for (const s of allSvip) {
      badgeIcon = s.badgeIcon;
      colorHex = s.colorHex;
      if (s.entryEffect) entryEffect = s.entryEffect;
      if (s.nameEffect) nameEffect = s.nameEffect;
      if (s.chatBubble) chatBubble = s.chatBubble;
      if (s.antiKickImmunity) antiKickImmunity = true;
      if (s.prioritySeat) prioritySeat = true;
      if (s.invisibleEntry) invisibleEntry = true;

      try {
        const perks = JSON.parse(s.perksJson);
        activePerks.push(...perks);
      } catch (_) {}
    }

    return {
      vipLevel,
      svipLevel,
      badgeIcon,
      colorHex,
      entryEffect,
      nameEffect,
      chatBubble,
      antiKickImmunity,
      prioritySeat,
      invisibleEntry,
      activePerks: Array.from(new Set(activePerks)),
    };
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 6. RENEWAL & EXPIRY ENGINE
  // ════════════════════════════════════════════════════════════════════════════

  static async renewMembership(userId: number, membershipType: 'VIP' | 'SVIP' = 'VIP', days: number = 30) {
    const costDiamonds = membershipType === 'VIP' ? 500 : 5000;

    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user || user.diamonds < costDiamonds) {
        throw new Error(`Insufficient diamonds for renewal (${costDiamonds} required)`);
      }

      await tx.user.update({
        where: { id: userId },
        data: { diamonds: { decrement: costDiamonds } },
      });

      const profile = await tx.membershipProfile.findUnique({ where: { userId } });
      const currentExpiry =
        membershipType === 'VIP'
          ? (profile?.vipExpiresAt && profile.vipExpiresAt > new Date() ? profile.vipExpiresAt : new Date())
          : (profile?.svipExpiresAt && profile.svipExpiresAt > new Date() ? profile.svipExpiresAt : new Date());

      const newExpiry = new Date(currentExpiry.getTime() + days * 24 * 60 * 60 * 1000);

      const updateData =
        membershipType === 'VIP'
          ? { vipExpiresAt: newExpiry, vipStatus: 'ACTIVE', lastRenewalAt: new Date() }
          : { svipExpiresAt: newExpiry, svipStatus: 'ACTIVE', lastRenewalAt: new Date() };

      const updatedProfile = await tx.membershipProfile.update({
        where: { userId },
        data: updateData,
      });

      await tx.membershipHistory.create({
        data: {
          userId,
          membershipType,
          previousLevel: membershipType === 'VIP' ? profile?.vipLevel ?? 0 : profile?.svipLevel ?? 0,
          newLevel: membershipType === 'VIP' ? profile?.vipLevel ?? 0 : profile?.svipLevel ?? 0,
          eventType: 'RENEWAL',
          reason: `Renewed ${membershipType} for ${days} days`,
        },
      });

      return {
        success: true,
        expiresAt: newExpiry,
        profile: updatedProfile,
      };
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 6.1 DIRECT VIP PURCHASE WITH DIAMONDS
  // ════════════════════════════════════════════════════════════════════════════

  static async purchaseVipTier(userId: number, targetLevel: number, durationDays: number = 30) {
    if (targetLevel < 1 || targetLevel > 7) {
      throw new Error('Valid VIP level (1–7) is required.');
    }

    const vipTier = await prisma.vipLevelConfig.findUnique({
      where: { level: targetLevel },
    });

    if (!vipTier || !vipTier.active) {
      throw new Error(`VIP level ${targetLevel} is currently not available for purchase.`);
    }

    // Price formula: 1 USD = 100 Diamonds
    const costDiamonds = Math.max(500, Math.round(vipTier.rechargeRequiredUsd * 100));

    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user || user.diamonds < costDiamonds) {
        throw new Error(`Insufficient diamonds (${costDiamonds} 💎 required, current balance: ${user?.diamonds ?? 0} 💎)`);
      }

      // Deduct diamonds
      await tx.user.update({
        where: { id: userId },
        data: {
          diamonds: { decrement: costDiamonds },
          vipTier: targetLevel,
        },
      });

      // Update / Upsert Membership Profile
      const now = new Date();
      const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

      const profile = await tx.membershipProfile.upsert({
        where: { userId },
        create: {
          userId,
          vipLevel: targetLevel,
          svipLevel: 0,
          vipXp: vipTier.xpRequired,
          svipXp: 0,
          lifetimeRechargeUsd: vipTier.rechargeRequiredUsd,
          vipStatus: 'ACTIVE',
          vipStartedAt: now,
          vipExpiresAt: expiresAt,
        },
        update: {
          vipLevel: targetLevel,
          vipXp: { increment: vipTier.xpRequired },
          vipStatus: 'ACTIVE',
          vipStartedAt: now,
          vipExpiresAt: expiresAt,
        },
      });

      // Grant corresponding AvatarFrame if exists
      const frame = await (tx as any).avatarFrame.findFirst({
        where: { requiredVipLevel: targetLevel, category: 'VIP' },
      });

      if (frame) {
        await (tx as any).avatarFrameOwnership.upsert({
          where: {
            userId_frameId: {
              userId,
              frameId: frame.id,
            },
          },
          update: {
            expiresAt,
            isEquipped: true,
          },
          create: {
            userId,
            frameId: frame.id,
            expiresAt,
            isEquipped: true,
            source: 'VIP_PURCHASE',
          },
        });

        // Set equipped frame on user
        await tx.user.update({
          where: { id: userId },
          data: { equippedFrameId: frame.id },
        });
      }

      // Record transaction & history
      await tx.membershipHistory.create({
        data: {
          userId,
          membershipType: 'VIP',
          previousLevel: user.vipTier ?? 0,
          newLevel: targetLevel,
          xpAtTransition: profile.vipXp,
          eventType: 'UPGRADE',
          reason: `Direct purchase of ${vipTier.name} for ${costDiamonds} Diamonds`,
        },
      });

      // Award Level-Up gift if applicable
      if (vipTier.levelUpRewardJson) {
        try {
          const reward = JSON.parse(vipTier.levelUpRewardJson);
          const idempotencyKey = `USER_${userId}_VIP_${targetLevel}_LEVEL_UP`;
          const existingClaim = await tx.membershipRewardClaim.findUnique({
            where: { idempotencyKey },
          });

          if (!existingClaim) {
            await tx.membershipRewardClaim.create({
              data: {
                idempotencyKey,
                userId,
                membershipType: 'VIP',
                level: targetLevel,
                rewardType: 'LEVEL_UP',
                diamondsAwarded: reward.diamonds ?? 0,
                coinsAwarded: reward.coins ?? 0,
                xpAwarded: reward.xp ?? 0,
              },
            });

            if (reward.coins) {
              await tx.user.update({
                where: { id: userId },
                data: { coins: { increment: reward.coins } },
              });
            }
          }
        } catch (_) {}
      }

      return {
        success: true,
        message: `🎉 Congratulations! ${vipTier.title} activated successfully for ${durationDays} days!`,
        profile,
        vipLevel: targetLevel,
        expiresAt,
      };
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 7. ADMIN MANAGEMENT & METRICS
  // ════════════════════════════════════════════════════════════════════════════

  static async adminManualGrant(params: {
    adminId: number;
    targetUserId: number;
    membershipType: 'VIP' | 'SVIP';
    targetLevel: number;
    durationDays?: number;
    reason: string;
    ipAddress?: string;
  }) {
    const { adminId, targetUserId, membershipType, targetLevel, durationDays = 30, reason, ipAddress } = params;

    if (!reason || reason.trim().length < 4) {
      throw new Error('Mandatory compliance reason required for manual VIP/SVIP adjustments.');
    }

    return await prisma.$transaction(async (tx) => {
      const profile = await tx.membershipProfile.findUnique({ where: { userId: targetUserId } });
      const prevState = profile ? JSON.stringify(profile) : '{}';

      const now = new Date();
      const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

      const updateData =
        membershipType === 'VIP'
          ? {
              vipLevel: targetLevel,
              vipStatus: targetLevel > 0 ? 'ACTIVE' : 'EXPIRED',
              vipStartedAt: targetLevel > 0 ? now : undefined,
              vipExpiresAt: targetLevel > 0 ? expiresAt : undefined,
            }
          : {
              svipLevel: targetLevel,
              svipStatus: targetLevel > 0 ? 'ACTIVE' : 'INACTIVE',
              svipStartedAt: targetLevel > 0 ? now : undefined,
              svipExpiresAt: targetLevel > 0 ? expiresAt : undefined,
            };

      const updated = await tx.membershipProfile.upsert({
        where: { userId: targetUserId },
        create: {
          userId: targetUserId,
          vipLevel: membershipType === 'VIP' ? targetLevel : 0,
          svipLevel: membershipType === 'SVIP' ? targetLevel : 0,
          vipStatus: membershipType === 'VIP' && targetLevel > 0 ? 'ACTIVE' : 'ACTIVE',
          svipStatus: membershipType === 'SVIP' && targetLevel > 0 ? 'ACTIVE' : 'INACTIVE',
          vipExpiresAt: expiresAt,
        },
        update: updateData,
      });

      if (membershipType === 'VIP') {
        await tx.user.update({
          where: { id: targetUserId },
          data: { vipTier: targetLevel },
        });
      }

      // Record Audit Log
      const audit = await tx.membershipAuditLog.create({
        data: {
          adminId,
          targetUserId,
          action: `GRANT_${membershipType}_L${targetLevel}`,
          previousStateJson: prevState,
          newStateJson: JSON.stringify(updated),
          reason,
          ipAddress,
        },
      });

      return { updated, audit };
    });
  }

  static async getDashboardStats() {
    const totalUsers = await prisma.user.count();
    const profiles = await prisma.membershipProfile.findMany();

    const vipDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
    const svipDist: Record<number, number> = {};
    for (let i = 1; i <= 15; i++) svipDist[i] = 0;

    let activeVips = 0;
    let activeSvips = 0;

    for (const p of profiles) {
      if (p.vipLevel >= 1 && p.vipLevel <= 7) {
        vipDist[p.vipLevel] = (vipDist[p.vipLevel] || 0) + 1;
        if (p.vipStatus === 'ACTIVE') activeVips++;
      }
      if (p.svipLevel >= 1 && p.svipLevel <= 15) {
        svipDist[p.svipLevel] = (svipDist[p.svipLevel] || 0) + 1;
        if (p.svipStatus === 'ACTIVE') activeSvips++;
      }
    }

    return {
      totalUsers,
      totalVipUsers: activeVips,
      totalSvipUsers: activeSvips,
      vipDistribution: vipDist,
      svipDistribution: svipDist,
    };
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 8. GIFT VIP (GIVE TO FRIEND)
  // ════════════════════════════════════════════════════════════════════════════

  static async giveVipTier(params: {
    senderId: number;
    recipientId: number;
    targetLevel: number;
    durationDays?: number;
  }) {
    const { senderId, recipientId, targetLevel, durationDays = 30 } = params;

    if (senderId === recipientId) {
      throw new Error('You cannot gift VIP to yourself. Please use direct purchase.');
    }

    if (targetLevel < 1 || targetLevel > 7) {
      throw new Error('Valid VIP level (1–7) is required.');
    }

    const vipTier = await prisma.vipLevelConfig.findUnique({
      where: { level: targetLevel },
    });

    if (!vipTier || !vipTier.active) {
      throw new Error(`VIP level ${targetLevel} is currently not available.`);
    }

    const costDiamonds = Math.max(500, Math.round(vipTier.rechargeRequiredUsd * 100));

    return await prisma.$transaction(async (tx) => {
      const sender = await tx.user.findUnique({ where: { id: senderId } });
      if (!sender || sender.diamonds < costDiamonds) {
        throw new Error(`Insufficient diamonds (${costDiamonds} 💎 required, current balance: ${sender?.diamonds ?? 0} 💎)`);
      }

      const recipient = await tx.user.findUnique({ where: { id: recipientId } });
      if (!recipient) {
        throw new Error('Recipient user not found.');
      }

      // Deduct from sender
      await tx.user.update({
        where: { id: senderId },
        data: { diamonds: { decrement: costDiamonds } },
      });

      // Update recipient's VIP
      const now = new Date();
      const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

      const updatedProfile = await tx.membershipProfile.upsert({
        where: { userId: recipientId },
        create: {
          userId: recipientId,
          vipLevel: targetLevel,
          svipLevel: 0,
          vipXp: vipTier.xpRequired,
          svipXp: 0,
          lifetimeRechargeUsd: vipTier.rechargeRequiredUsd,
          vipStatus: 'ACTIVE',
          vipStartedAt: now,
          vipExpiresAt: expiresAt,
        },
        update: {
          vipLevel: targetLevel,
          vipXp: { increment: vipTier.xpRequired },
          vipStatus: 'ACTIVE',
          vipExpiresAt: expiresAt,
        },
      });

      await tx.user.update({
        where: { id: recipientId },
        data: { vipTier: targetLevel },
      });

      // Grant recipient the Frame
      const frame = await (tx as any).avatarFrame.findFirst({
        where: { requiredVipLevel: targetLevel, category: 'VIP' },
      });

      if (frame) {
        await (tx as any).avatarFrameOwnership.upsert({
          where: {
            userId_frameId: {
              userId: recipientId,
              frameId: frame.id,
            },
          },
          update: {
            expiresAt,
            isEquipped: true,
          },
          create: {
            userId: recipientId,
            frameId: frame.id,
            expiresAt,
            isEquipped: true,
            source: 'GIFT_RECEIVED',
          },
        });

        await tx.user.update({
          where: { id: recipientId },
          data: { equippedFrameId: frame.id },
        });
      }

      // History for recipient
      await tx.membershipHistory.create({
        data: {
          userId: recipientId,
          membershipType: 'VIP',
          previousLevel: recipient.vipTier ?? 0,
          newLevel: targetLevel,
          eventType: 'GIFT_RECEIVED',
          reason: `Received ${vipTier.name} as a gift from ${sender.displayName || sender.username || sender.id}`,
        },
      });

      // History for sender
      await tx.membershipHistory.create({
        data: {
          userId: senderId,
          membershipType: 'VIP',
          previousLevel: sender.vipTier ?? 0,
          newLevel: sender.vipTier ?? 0,
          eventType: 'GIFT_SENT',
          reason: `Gifted ${vipTier.name} to ${recipient.displayName || recipient.username || recipient.id} for ${costDiamonds} Diamonds`,
        },
      });

      return {
        success: true,
        message: `🎁 Successfully gifted ${vipTier.title} to ${recipient.displayName || recipient.username}!`,
        recipient: {
          id: recipient.id,
          username: recipient.username,
          displayName: recipient.displayName,
          vipTier: targetLevel,
        },
      };
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 9. VIP & SVIP TASKS ENGINE
  // ════════════════════════════════════════════════════════════════════════════

  static async getVipTasks(userId: number) {
    const today = new Date().toISOString().slice(0, 10);

    const taskDefinitions = [
      {
        id: 'task_daily_checkin',
        title: 'Daily Nobility Check-In',
        description: 'Open the VIP Center daily to claim your check-in VIP EXP.',
        category: 'DAILY',
        icon: 'Iconsax.calendar',
        targetProgress: 1,
        currentProgress: 1,
        xpReward: 50,
        diamondsReward: 5,
      },
      {
        id: 'task_send_gifts',
        title: 'Send 5 Eligible Gifts',
        description: 'Send gifts in voice/video live rooms to earn VIP EXP.',
        category: 'DAILY',
        icon: 'Iconsax.gift',
        targetProgress: 5,
        currentProgress: 5,
        xpReward: 150,
        diamondsReward: 10,
      },
      {
        id: 'task_join_rooms',
        title: 'Join 3 Live Voice Rooms',
        description: 'Visit and interact in at least 3 live voice chat rooms.',
        category: 'DAILY',
        icon: 'Iconsax.microphone',
        targetProgress: 3,
        currentProgress: 3,
        xpReward: 100,
        diamondsReward: 5,
      },
      {
        id: 'task_topup_diamonds',
        title: 'Top-Up Diamonds ($5+)',
        description: 'Recharge 500 or more diamonds to boost your VIP nobility.',
        category: 'WEEKLY',
        icon: 'Iconsax.card_tick',
        targetProgress: 500,
        currentProgress: 500,
        xpReward: 500,
        diamondsReward: 50,
      },
      {
        id: 'task_stay_mic',
        title: 'Speak on Mic for 15 Mins',
        description: 'Stay active on an audio seat for 15 cumulative minutes.',
        category: 'DAILY',
        icon: 'Iconsax.headphone',
        targetProgress: 15,
        currentProgress: 15,
        xpReward: 120,
        diamondsReward: 15,
      },
    ];

    const claims = await prisma.membershipRewardClaim.findMany({
      where: {
        userId,
        rewardType: 'TASK',
        periodKey: today,
      },
    });

    const claimedTaskIds = new Set(claims.map((c) => c.idempotencyKey.split('_')[3]));

    return taskDefinitions.map((t) => ({
      ...t,
      isCompleted: t.currentProgress >= t.targetProgress,
      isClaimed: claimedTaskIds.has(t.id),
    }));
  }

  static async claimVipTask(userId: number, taskId: string) {
    const today = new Date().toISOString().slice(0, 10);
    const tasks = await this.getVipTasks(userId);
    const targetTask = tasks.find((t) => t.id === taskId);

    if (!targetTask) {
      throw new Error('Task not found.');
    }

    if (targetTask.isClaimed) {
      throw new Error('Task reward has already been claimed today.');
    }

    const idempotencyKey = `USER_${userId}_TASK_${taskId}_${today}`;

    return await prisma.$transaction(async (tx) => {
      await tx.membershipRewardClaim.create({
        data: {
          idempotencyKey,
          userId,
          membershipType: 'VIP',
          level: 1,
          rewardType: 'TASK',
          periodKey: today,
          diamondsAwarded: targetTask.diamondsReward,
          xpAwarded: targetTask.xpReward,
        },
      });

      // Award XP & Diamonds
      if (targetTask.diamondsReward > 0) {
        await tx.user.update({
          where: { id: userId },
          data: { diamonds: { increment: targetTask.diamondsReward } },
        });
      }

      await tx.membershipProfile.upsert({
        where: { userId },
        create: {
          userId,
          vipLevel: 0,
          svipLevel: 0,
          vipXp: targetTask.xpReward,
          svipXp: 0,
        },
        update: {
          vipXp: { increment: targetTask.xpReward },
        },
      });

      return {
        success: true,
        message: `🎉 Claimed ${targetTask.xpReward} VIP EXP + ${targetTask.diamondsReward} 💎 Diamonds!`,
        task: targetTask,
      };
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 10. VIP & SVIP NOBILITY LEADERBOARD
  // ════════════════════════════════════════════════════════════════════════════

  static async getVipLeaderboard(membershipType: 'VIP' | 'SVIP' = 'VIP', timeframe: 'all' | 'weekly' | 'monthly' = 'all') {
    const profiles = await prisma.membershipProfile.findMany({
      where: membershipType === 'VIP' ? { vipLevel: { gt: 0 } } : { svipLevel: { gt: 0 } },
      orderBy: membershipType === 'VIP' ? { vipXp: 'desc' } : { svipXp: 'desc' },
      take: 50,
    });

    const userIds = profiles.map((p) => p.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        vipTier: true,
        equippedFrameId: true,
      },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    return profiles.map((p, idx) => {
      const u = userMap.get(p.userId);
      return {
        rank: idx + 1,
        userId: p.userId,
        username: u?.displayName || u?.username || `User ${p.userId}`,
        avatar: u?.avatar || '',
        equippedFrameId: u?.equippedFrameId,
        vipLevel: p.vipLevel,
        svipLevel: p.svipLevel,
        xp: membershipType === 'VIP' ? p.vipXp : p.svipXp,
        membershipType,
      };
    });
  }
}

