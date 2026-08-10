import { prisma } from '../config/database.js';
import { broadcastGlobal, emitToUser } from '../websocket/socketServer.js';

export class VisitorService {
  /**
   * Record a profile visit with 15-minute rate limiting & block check
   */
  static async recordVisit(visitorId: number, targetNumericId: number) {
    const targetUser = await prisma.user.findUnique({
      where: { numericId: targetNumericId },
      select: { id: true, numericId: true, username: true },
    });

    if (!targetUser) {
      throw new Error('Target user not found.');
    }

    if (visitorId === targetUser.id) {
      return { recorded: false, message: 'Self visit ignored.' };
    }

    // Check block status
    const isBlocked = await prisma.blockedUser.findFirst({
      where: {
        OR: [
          { blockerId: visitorId, blockedId: targetUser.id },
          { blockerId: targetUser.id, blockedId: visitorId },
        ],
      },
    });

    if (isBlocked) {
      return { recorded: false, message: 'Visit blocked by privacy settings.' };
    }

    // 15-minute deduplication window
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const recentVisit = await prisma.profileVisit.findFirst({
      where: {
        visitorId,
        profileOwnerId: targetUser.id,
        visitedAt: { gte: fifteenMinsAgo },
      },
    });

    if (recentVisit) {
      return { recorded: false, message: 'Visit recently recorded.' };
    }

    // Create visit record
    const visitRecord = await prisma.profileVisit.create({
      data: {
        visitorId,
        profileOwnerId: targetUser.id,
      },
    });

    const visitorUser = await prisma.user.findUnique({
      where: { id: visitorId },
      select: { id: true, numericId: true, username: true, avatar: true },
    });

    const visitorsCount = await prisma.profileVisit.count({
      where: { profileOwnerId: targetUser.id },
    });

    // Realtime Event to Profile Owner
    emitToUser(targetUser.numericId, 'profile.visited', {
      visitor: visitorUser,
      visitorsCount,
      visitedAt: visitRecord.visitedAt.toISOString(),
    });

    broadcastGlobal('admin.activity', {
      type: 'PROFILE_VISIT',
      details: `@${visitorUser?.username} visited @${targetUser.username}'s profile`,
      timestamp: new Date().toISOString(),
    });

    return {
      recorded: true,
      visitorsCount,
      message: 'Profile visit recorded.',
    };
  }

  /**
   * Get Visitors list for a profile
   */
  static async getVisitors(numericId: number, currentUserId?: number, page = 1, limit = 20) {
    const user = await prisma.user.findUnique({ where: { numericId } });
    if (!user) throw new Error('User not found.');

    const skip = (page - 1) * limit;
    const [total, records] = await Promise.all([
      prisma.profileVisit.count({ where: { profileOwnerId: user.id } }),
      prisma.profileVisit.findMany({
        where: { profileOwnerId: user.id },
        include: {
          visitor: {
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
        orderBy: { visitedAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    const list = await Promise.all(
      records.map(async (r) => {
        let isFollowing = false;
        if (currentUserId) {
          const check = await prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: currentUserId,
                followingId: r.visitor.id,
              },
            },
          });
          isFollowing = check?.status === 'ACCEPTED';
        }
        return {
          id: r.visitor.id,
          numericId: r.visitor.numericId,
          username: r.visitor.username,
          avatar: r.visitor.avatar,
          bio: r.visitor.bio,
          level: r.visitor.level,
          vipTier: r.visitor.vipTier,
          country: r.visitor.country,
          isOnline: r.visitor.status === 'ACTIVE',
          isFollowing,
          visitedAt: r.visitedAt.toISOString(),
        };
      })
    );

    return { total, page, limit, data: list };
  }
}
