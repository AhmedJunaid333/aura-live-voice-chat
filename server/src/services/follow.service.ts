import { prisma } from '../config/database.js';
import { broadcastGlobal, emitToUser } from '../websocket/socketServer.js';

export class FollowService {
  /**
   * Follow a target user by numeric ID (or toggle status if request pending)
   */
  static async followUser(followerId: number, targetNumericId: number) {
    const targetUser = await prisma.user.findUnique({
      where: { numericId: targetNumericId },
      select: { id: true, numericId: true, username: true },
    });

    if (!targetUser) {
      throw new Error('Target user not found.');
    }

    if (followerId === targetUser.id) {
      throw new Error('Cannot follow yourself.');
    }

    // Check block status
    const isBlocked = await prisma.blockedUser.findFirst({
      where: {
        OR: [
          { blockerId: followerId, blockedId: targetUser.id },
          { blockerId: targetUser.id, blockedId: followerId },
        ],
      },
    });

    if (isBlocked) {
      throw new Error('Action blocked by privacy settings.');
    }

    const followerUser = await prisma.user.findUnique({
      where: { id: followerId },
      select: { id: true, numericId: true, username: true, avatar: true },
    });

    // Check existing follow relationship
    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: targetUser.id,
        },
      },
    });

    if (existing) {
      return {
        isFollowing: existing.status === 'ACCEPTED',
        status: existing.status,
        message: 'Already following user.',
      };
    }

    // Create follow relationship
    const followRecord = await prisma.follow.create({
      data: {
        followerId,
        followingId: targetUser.id,
        status: 'ACCEPTED',
      },
    });

    // Create real-time notification
    const notification = await prisma.notification.create({
      data: {
        recipientId: targetUser.id,
        senderId: followerId,
        type: 'FOLLOW',
        entityId: followRecord.id,
        title: 'New Follower ✨',
        message: `@${followerUser?.username || 'Someone'} started following you!`,
      },
    });

    // Compute updated counts
    const followerCount = await prisma.follow.count({
      where: { followingId: targetUser.id, status: 'ACCEPTED' },
    });
    const followingCount = await prisma.follow.count({
      where: { followerId, status: 'ACCEPTED' },
    });

    // Realtime Socket.IO Events
    emitToUser(targetUser.numericId, 'follow.created', {
      follower: followerUser,
      followerCount,
      notification,
    });

    emitToUser(followerUser!.numericId, 'follow.updated', {
      followingCount,
    });

    broadcastGlobal('admin.activity', {
      type: 'USER_FOLLOW',
      details: `@${followerUser?.username} followed @${targetUser.username}`,
      timestamp: new Date().toISOString(),
    });

    return {
      isFollowing: true,
      status: 'ACCEPTED',
      followerCount,
      followingCount,
      message: `Successfully followed @${targetUser.username}!`,
    };
  }

  /**
   * Unfollow a target user by numeric ID
   */
  static async unfollowUser(followerId: number, targetNumericId: number) {
    const targetUser = await prisma.user.findUnique({
      where: { numericId: targetNumericId },
      select: { id: true, numericId: true, username: true },
    });

    if (!targetUser) {
      throw new Error('Target user not found.');
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: targetUser.id,
        },
      },
    });

    if (existing) {
      await prisma.follow.delete({
        where: { id: existing.id },
      });
    }

    const followerUser = await prisma.user.findUnique({
      where: { id: followerId },
      select: { id: true, numericId: true, username: true },
    });

    const followerCount = await prisma.follow.count({
      where: { followingId: targetUser.id, status: 'ACCEPTED' },
    });
    const followingCount = await prisma.follow.count({
      where: { followerId, status: 'ACCEPTED' },
    });

    // Realtime Events
    emitToUser(targetUser.numericId, 'follow.removed', {
      followerId,
      followerCount,
    });

    broadcastGlobal('admin.activity', {
      type: 'USER_UNFOLLOW',
      details: `@${followerUser?.username} unfollowed @${targetUser.username}`,
      timestamp: new Date().toISOString(),
    });

    return {
      isFollowing: false,
      followerCount,
      followingCount,
      message: `Unfollowed @${targetUser.username}.`,
    };
  }

  /**
   * Get Followers list for a user
   */
  static async getFollowers(numericId: number, currentUserId?: number, page = 1, limit = 20) {
    const user = await prisma.user.findUnique({ where: { numericId } });
    if (!user) throw new Error('User not found.');

    const skip = (page - 1) * limit;
    const [total, records] = await Promise.all([
      prisma.follow.count({ where: { followingId: user.id, status: 'ACCEPTED' } }),
      prisma.follow.findMany({
        where: { followingId: user.id, status: 'ACCEPTED' },
        include: {
          follower: {
            select: {
              id: true,
              numericId: true,
              username: true,
              avatar: true,
              bio: true,
              level: true,
              vipTier: true,
              country: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    // Compute reciprocal follow status if authenticated
    const list = await Promise.all(
      records.map(async (r) => {
        let isFollowingBack = false;
        if (currentUserId) {
          const check = await prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: currentUserId,
                followingId: r.follower.id,
              },
            },
          });
          isFollowingBack = check?.status === 'ACCEPTED';
        }
        return {
          id: r.follower.id,
          numericId: r.follower.numericId,
          username: r.follower.username,
          avatar: r.follower.avatar,
          bio: r.follower.bio,
          level: r.follower.level,
          vipTier: r.follower.vipTier,
          country: r.follower.country,
          isOnline: r.follower.status === 'ACTIVE',
          isFollowing: isFollowingBack,
          followedAt: r.createdAt.toISOString(),
        };
      })
    );

    return { total, page, limit, data: list };
  }

  /**
   * Get Following list for a user
   */
  static async getFollowing(numericId: number, currentUserId?: number, page = 1, limit = 20) {
    const user = await prisma.user.findUnique({ where: { numericId } });
    if (!user) throw new Error('User not found.');

    const skip = (page - 1) * limit;
    const [total, records] = await Promise.all([
      prisma.follow.count({ where: { followerId: user.id, status: 'ACCEPTED' } }),
      prisma.follow.findMany({
        where: { followerId: user.id, status: 'ACCEPTED' },
        include: {
          following: {
            select: {
              id: true,
              numericId: true,
              username: true,
              avatar: true,
              bio: true,
              level: true,
              vipTier: true,
              country: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    const list = await Promise.all(
      records.map(async (r) => {
        let isFollowingBack = true;
        if (currentUserId && currentUserId !== user.id) {
          const check = await prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: currentUserId,
                followingId: r.following.id,
              },
            },
          });
          isFollowingBack = check?.status === 'ACCEPTED';
        }
        return {
          id: r.following.id,
          numericId: r.following.numericId,
          username: r.following.username,
          avatar: r.following.avatar,
          bio: r.following.bio,
          level: r.following.level,
          vipTier: r.following.vipTier,
          country: r.following.country,
          isOnline: r.following.status === 'ACTIVE',
          isFollowing: isFollowingBack,
          followedAt: r.createdAt.toISOString(),
        };
      })
    );

    return { total, page, limit, data: list };
  }

  /**
   * Get Fans list (Followers mapped to Fans terminology)
   */
  static async getFans(numericId: number, currentUserId?: number, page = 1, limit = 20) {
    return this.getFollowers(numericId, currentUserId, page, limit);
  }

  /**
   * Get authoritative counters for profile
   */
  static async getProfileRelationshipCounts(numericId: number, currentUserId?: number) {
    const user = await prisma.user.findUnique({ where: { numericId } });
    if (!user) throw new Error('User not found.');

    const [followersCount, followingCount, visitorsCount] = await Promise.all([
      prisma.follow.count({ where: { followingId: user.id, status: 'ACCEPTED' } }),
      prisma.follow.count({ where: { followerId: user.id, status: 'ACCEPTED' } }),
      prisma.profileVisit.count({ where: { profileOwnerId: user.id } }),
    ]);

    let isFollowing = false;
    if (currentUserId && currentUserId !== user.id) {
      const check = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: user.id,
          },
        },
      });
      isFollowing = check?.status === 'ACCEPTED';
    }

    return {
      numericId: user.numericId,
      followersCount,
      followingCount,
      fansCount: followersCount,
      visitorsCount,
      isFollowing,
    };
  }
}
