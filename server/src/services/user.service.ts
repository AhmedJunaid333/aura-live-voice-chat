import { prisma } from '../config/database.js';
import { broadcastGlobal, emitToUser } from '../websocket/socketServer.js';

export class UserService {
  /**
   * Get full public/other user profile by numericId or primary ID
   */
  static async getUserProfile(identifier: string | number, currentUserId?: number) {
    const numericId = typeof identifier === 'number' ? identifier : parseInt(identifier, 10);
    const isNumeric = !isNaN(numericId);

    const user = await prisma.user.findFirst({
      where: isNumeric
        ? { OR: [{ numericId }, { id: numericId }] }
        : { username: String(identifier) },
      include: {
        familyMembership: {
          include: {
            family: {
              select: {
                id: true,
                familyId: true,
                name: true,
                icon: true,
                logo: true,
                level: true,
                totalDiamonds: true,
                badge: true,
              },
            },
          },
        },
        medals: {
          include: {
            medal: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    // Count metrics
    const [
      followersCount,
      followingCount,
      visitorsCount,
      hostedRoomsCount,
      activeLiveRoom,
    ] = await Promise.all([
      prisma.follow.count({
        where: { followingId: user.id, status: 'ACCEPTED' },
      }),
      prisma.follow.count({
        where: { followerId: user.id, status: 'ACCEPTED' },
      }),
      prisma.profileVisit.count({
        where: { profileOwnerId: user.id },
      }),
      prisma.liveRoom.count({
        where: { hostId: user.id },
      }),
      prisma.liveRoom.findFirst({
        where: {
          hostId: user.id,
          status: 'LIVE',
        },
        select: {
          id: true,
          roomId: true,
          title: true,
          category: true,
          seatCount: true,
          status: true,
          isLocked: true,
          theme: true,
          listenersCount: true,
          isPK: true,
          familyId: true,
          createdAt: true,
        },
      }),
    ]);

    // Relationship with requester
    let isSelf = false;
    let isFollowing = false;
    let isFollowedBy = false;
    let isBlocked = false;
    let hasBlockedMe = false;
    let isMuted = false;

    if (currentUserId) {
      isSelf = currentUserId === user.id;

      if (!isSelf) {
        const [
          followRecord,
          followedByRecord,
          blockedRecord,
          blockedMeRecord,
          mutedRecord,
        ] = await Promise.all([
          prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: currentUserId,
                followingId: user.id,
              },
            },
          }),
          prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: user.id,
                followingId: currentUserId,
              },
            },
          }),
          prisma.blockedUser.findUnique({
            where: {
              blockerId_blockedId: {
                blockerId: currentUserId,
                blockedId: user.id,
              },
            },
          }),
          prisma.blockedUser.findUnique({
            where: {
              blockerId_blockedId: {
                blockerId: user.id,
                blockedId: currentUserId,
              },
            },
          }),
          prisma.mutedUser.findUnique({
            where: {
              muterId_mutedId: {
                muterId: currentUserId,
                mutedId: user.id,
              },
            },
          }),
        ]);

        isFollowing = followRecord?.status === 'ACCEPTED';
        isFollowedBy = followedByRecord?.status === 'ACCEPTED';
        isBlocked = !!blockedRecord;
        hasBlockedMe = !!blockedMeRecord;
        isMuted = !!mutedRecord;
      }
    }

    return {
      id: user.id,
      numericId: user.numericId,
      username: user.username,
      displayName: user.displayName || user.username,
      avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
      cover: user.cover || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=300&fit=crop',
      bio: user.bio || 'Aura Live Registered User ✨',
      gender: user.gender || 'Prefer not to say',
      birthday: user.birthday,
      country: user.country || 'Pakistan',
      countryCode: user.countryCode || 'PK',
      level: user.level,
      xp: user.xp,
      vipTier: user.vipTier,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      stats: {
        followersCount,
        followingCount,
        visitorsCount,
        hostedRoomsCount,
      },
      relationship: {
        isSelf,
        isFollowing,
        isFollowedBy,
        isBlocked,
        hasBlockedMe,
        isMuted,
      },
      family: user.familyMembership
        ? {
            id: user.familyMembership.family.id,
            familyId: user.familyMembership.family.familyId,
            name: user.familyMembership.family.name,
            icon: user.familyMembership.family.icon || '🦁',
            logo: user.familyMembership.family.logo,
            level: user.familyMembership.family.level,
            role: user.familyMembership.role,
            totalDiamonds: user.familyMembership.family.totalDiamonds,
            badge: user.familyMembership.family.badge || '👑 VIP FAMILY',
          }
        : null,
      medals: user.medals.map((m) => ({
        id: m.medal.id,
        name: m.medal.name,
        iconUrl: m.medal.icon,
        category: m.medal.category,
      })),
      isLive: !!activeLiveRoom,
      activeLiveRoom: activeLiveRoom || null,
    };
  }

  /**
   * Search users by username or numeric ID
   */
  static async searchUsers(query: string, currentUserId?: number, page = 1, limit = 20) {
    const q = query.trim();
    if (!q) {
      return { data: [], total: 0, page, limit };
    }

    const numericVal = parseInt(q, 10);
    const isNum = !isNaN(numericVal);

    const whereClause: any = {
      status: 'ACTIVE',
      OR: [
        { username: { contains: q } },
        ...(isNum ? [{ numericId: numericVal }] : []),
      ],
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where: whereClause }),
      prisma.user.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          familyMembership: {
            include: {
              family: {
                select: { id: true, familyId: true, name: true, icon: true, level: true },
              },
            },
          },
        },
      }),
    ]);

    // Check relationship for each user if current user is logged in
    const data = await Promise.all(
      users.map(async (u) => {
        let isFollowing = false;
        if (currentUserId && currentUserId !== u.id) {
          const follow = await prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: currentUserId,
                followingId: u.id,
              },
            },
          });
          isFollowing = follow?.status === 'ACCEPTED';
        }

        return {
          id: u.id,
          numericId: u.numericId,
          username: u.username,
          avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
          bio: u.bio,
          level: u.level,
          vipTier: u.vipTier,
          country: u.country,
          countryCode: u.countryCode,
          family: u.familyMembership?.family || null,
          isFollowing,
        };
      })
    );

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Block a user
   */
  static async blockUser(currentUserId: number, targetNumericId: number, reason?: string) {
    const targetUser = await prisma.user.findUnique({
      where: { numericId: targetNumericId },
      select: { id: true, numericId: true, username: true },
    });

    if (!targetUser) {
      throw new Error('User not found.');
    }

    if (currentUserId === targetUser.id) {
      throw new Error('Cannot block yourself.');
    }

    // Upsert block record
    await prisma.blockedUser.upsert({
      where: {
        blockerId_blockedId: {
          blockerId: currentUserId,
          blockedId: targetUser.id,
        },
      },
      create: {
        blockerId: currentUserId,
        blockedId: targetUser.id,
        reason: reason || 'Blocked by user',
      },
      update: {
        reason: reason || 'Blocked by user',
      },
    });

    // Remove mutual follows
    await prisma.follow.deleteMany({
      where: {
        OR: [
          { followerId: currentUserId, followingId: targetUser.id },
          { followerId: targetUser.id, followingId: currentUserId },
        ],
      },
    });

    // Create immutable audit log for user block
    const blockerUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { numericId: true, username: true, role: true },
    });

    await prisma.auditLog.create({
      data: {
        actorId: currentUserId,
        actorRole: blockerUser?.role || 'USER',
        action: 'USER_BLOCKED_USER',
        resource: `User:${targetUser.numericId}`,
        details: `User #${blockerUser?.numericId || currentUserId} (@${blockerUser?.username}) blocked User #${targetUser.numericId} (@${targetUser.username}). Reason: ${reason || 'User block action'}`,
      },
    });

    // Realtime notification
    emitToUser(targetUser.numericId, 'user.blocked', {
      byUserId: currentUserId,
      byNumericId: blockerUser?.numericId || currentUserId,
      targetNumericId: targetUser.numericId,
    });
    emitToUser(blockerUser?.numericId || currentUserId, 'user.block_updated', {
      targetNumericId: targetUser.numericId,
      isBlocked: true,
    });

    return { success: true, isBlocked: true, message: `Successfully blocked @${targetUser.username}.` };
  }

  /**
   * Unblock a user
   */
  static async unblockUser(currentUserId: number, targetNumericId: number) {
    const targetUser = await prisma.user.findUnique({
      where: { numericId: targetNumericId },
      select: { id: true, numericId: true, username: true },
    });

    if (!targetUser) {
      throw new Error('User not found.');
    }

    await prisma.blockedUser.deleteMany({
      where: {
        blockerId: currentUserId,
        blockedId: targetUser.id,
      },
    });

    const blockerUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { numericId: true, username: true, role: true },
    });

    // Create immutable audit log for user unblock
    await prisma.auditLog.create({
      data: {
        actorId: currentUserId,
        actorRole: blockerUser?.role || 'USER',
        action: 'USER_UNBLOCKED_USER',
        resource: `User:${targetUser.numericId}`,
        details: `User #${blockerUser?.numericId || currentUserId} (@${blockerUser?.username}) unblocked User #${targetUser.numericId} (@${targetUser.username}).`,
      },
    });

    emitToUser(targetUser.numericId, 'user.unblocked', {
      byUserId: currentUserId,
      byNumericId: blockerUser?.numericId || currentUserId,
      targetNumericId: targetUser.numericId,
    });
    emitToUser(blockerUser?.numericId || currentUserId, 'user.block_updated', {
      targetNumericId: targetUser.numericId,
      isBlocked: false,
    });

    return { success: true, isBlocked: false, message: `Successfully unblocked @${targetUser.username}.` };
  }

  /**
   * Mute a user
   */
  static async muteUser(currentUserId: number, targetNumericId: number, reason?: string) {
    const targetUser = await prisma.user.findUnique({
      where: { numericId: targetNumericId },
      select: { id: true, numericId: true, username: true },
    });

    if (!targetUser) {
      throw new Error('User not found.');
    }

    if (currentUserId === targetUser.id) {
      throw new Error('Cannot mute yourself.');
    }

    await prisma.mutedUser.upsert({
      where: {
        muterId_mutedId: {
          muterId: currentUserId,
          mutedId: targetUser.id,
        },
      },
      create: {
        muterId: currentUserId,
        mutedId: targetUser.id,
        reason: reason || 'Muted by user',
      },
      update: {
        reason: reason || 'Muted by user',
      },
    });

    return { success: true, isMuted: true, message: `Successfully muted @${targetUser.username}.` };
  }

  /**
   * Unmute a user
   */
  static async unmuteUser(currentUserId: number, targetNumericId: number) {
    const targetUser = await prisma.user.findUnique({
      where: { numericId: targetNumericId },
      select: { id: true, numericId: true, username: true },
    });

    if (!targetUser) {
      throw new Error('User not found.');
    }

    await prisma.mutedUser.deleteMany({
      where: {
        muterId: currentUserId,
        mutedId: targetUser.id,
      },
    });

    return { success: true, isMuted: false, message: `Successfully unmuted @${targetUser.username}.` };
  }

  /**
   * Report a user
   */
  static async reportUser(
    currentUserId: number,
    targetNumericId: number,
    category: string,
    reason: string,
    details?: string
  ) {
    const targetUser = await prisma.user.findUnique({
      where: { numericId: targetNumericId },
      select: { id: true, numericId: true, username: true },
    });

    if (!targetUser) {
      throw new Error('User not found.');
    }

    const report = await prisma.userReport.create({
      data: {
        reporterId: currentUserId,
        reportedUserId: targetUser.id,
        category: category || 'GENERAL',
        reason: reason || 'Inappropriate behavior',
        details: details || null,
        status: 'PENDING',
      },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        actorId: currentUserId,
        actorRole: 'USER',
        action: 'USER_REPORT_SUBMITTED',
        resource: `User:${targetUser.id}`,
        details: `Reported for: ${reason} (Category: ${category})`,
      },
    });

    // Broadcast to Admin Portal
    broadcastGlobal('admin.activity', {
      type: 'USER_REPORT',
      reportId: report.id,
      reporterId: currentUserId,
      reportedUserId: targetUser.id,
      reportedUsername: targetUser.username,
      reason,
      category,
      createdAt: report.createdAt,
    });

    return {
      success: true,
      reportId: report.id,
      message: 'Report submitted successfully. Our safety team will review it.',
    };
  }

  /**
   * Get blocked users list for current user
   */
  static async getBlockedUsers(currentUserId: number) {
    const blockedList = await prisma.blockedUser.findMany({
      where: { blockerId: currentUserId },
      include: {
        blocked: {
          select: {
            id: true,
            numericId: true,
            username: true,
            avatar: true,
            level: true,
            vipTier: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return blockedList.map((b) => ({
      id: b.id,
      user: b.blocked,
      reason: b.reason,
      createdAt: b.createdAt,
    }));
  }

  /**
   * Get muted users list for current user
   */
  static async getMutedUsers(currentUserId: number) {
    const mutedList = await prisma.mutedUser.findMany({
      where: { muterId: currentUserId },
      include: {
        muted: {
          select: {
            id: true,
            numericId: true,
            username: true,
            avatar: true,
            level: true,
            vipTier: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return mutedList.map((m) => ({
      id: m.id,
      user: m.muted,
      reason: m.reason,
      createdAt: m.createdAt,
    }));
  }

  /**
   * Get live status of user
   */
  static async getUserLiveStatus(targetNumericId: number) {
    const user = await prisma.user.findUnique({
      where: { numericId: targetNumericId },
      select: { id: true, numericId: true, username: true },
    });

    if (!user) {
      return { isLive: false, liveRoom: null };
    }

    const activeRoom = await prisma.liveRoom.findFirst({
      where: {
        hostId: user.id,
        status: 'LIVE',
      },
      select: {
        id: true,
        roomId: true,
        title: true,
        category: true,
        seatCount: true,
        isLocked: true,
        theme: true,
        listenersCount: true,
        createdAt: true,
      },
    });

    return {
      isLive: !!activeRoom,
      liveRoom: activeRoom || null,
    };
  }
}
