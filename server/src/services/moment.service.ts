import { prisma } from '../config/database.js';
import { broadcastGlobal } from '../websocket/socketServer.js';

export class MomentService {
  /**
   * 🌟 Seed Initial Rich Moments if database is empty
   */
  static async seedInitialMomentsIfEmpty() {
    try {
      const count = await prisma.moment.count();
      if (count > 0) return;

      const users = await prisma.user.findMany({ take: 5, orderBy: { numericId: 'asc' } });
      if (users.length === 0) return;

      const seedData = [
        {
          authorIndex: 0,
          mediaUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&fit=crop',
          caption: '✨ Grand opening night at Aura Live Voice Lounge! What an incredible party with everyone! 🎉🎤 #AuraLive #VoiceParty #Music',
          hashtags: JSON.stringify(['AuraLive', 'VoiceParty', 'Music']),
          countryCode: users[0].countryCode || 'PK',
          featured: true,
          viewCount: 1420,
          likeCount: 382,
          commentCount: 45,
          shareCount: 18,
        },
        {
          authorIndex: 1 % users.length,
          mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&fit=crop',
          caption: '🎙️ Live acoustic session tonight at 9 PM PKT! Drop your favorite song requests in the comments! 🎸🎶 #LiveSession #Acoustic #Singing',
          hashtags: JSON.stringify(['LiveSession', 'Acoustic', 'Singing']),
          countryCode: users[1 % users.length].countryCode || 'PK',
          featured: true,
          viewCount: 980,
          likeCount: 210,
          commentCount: 28,
          shareCount: 12,
        },
        {
          authorIndex: 2 % users.length,
          mediaUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&fit=crop',
          caption: '🏆 Imperial Lions Guild just took #1 on the Family Leaderboard! Proud of all our amazing family members! 🦁👑 #ImperialLions #GuildVibes #Top1',
          hashtags: JSON.stringify(['ImperialLions', 'GuildVibes', 'Top1']),
          countryCode: users[2 % users.length].countryCode || 'PK',
          featured: false,
          viewCount: 750,
          likeCount: 185,
          commentCount: 19,
          shareCount: 9,
        },
        {
          authorIndex: 3 % users.length,
          mediaUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&fit=crop',
          caption: '✨ Late night ASMR & chill audio vibes. Come relax and talk about your day. ☕🌙 #ChillVibes #ASMR #LateNight',
          hashtags: JSON.stringify(['ChillVibes', 'ASMR', 'LateNight']),
          countryCode: users[3 % users.length].countryCode || 'PK',
          featured: true,
          viewCount: 1120,
          likeCount: 295,
          commentCount: 34,
          shareCount: 15,
        },
      ];

      for (let i = 0; i < seedData.length; i++) {
        const item = seedData[i];
        const author = users[item.authorIndex];
        const numericId = 500001 + i;
        const rankingScore = (item.likeCount * 5) + (item.commentCount * 8) + (item.shareCount * 10) + item.viewCount + (author.level * 10);

        await prisma.moment.create({
          data: {
            numericId,
            authorId: author.id,
            mediaUrl: item.mediaUrl,
            mediaType: 'IMAGE',
            caption: item.caption,
            hashtags: item.hashtags,
            privacy: 'PUBLIC',
            countryCode: item.countryCode,
            status: 'PUBLISHED',
            moderationStatus: 'APPROVED',
            featured: item.featured,
            featuredAt: item.featured ? new Date() : null,
            rankingScore,
            viewCount: item.viewCount,
            likeCount: item.likeCount,
            commentCount: item.commentCount,
            shareCount: item.shareCount,
          },
        });
      }
    } catch (e) {
      console.warn('MomentService seed warning:', e);
    }
  }

  /**
   * 📡 Get Moments Feed (Following, Featured, Nearby, Search)
   */
  static async getMoments(
    currentUserId: number | null,
    query: {
      tab?: 'FOLLOWING' | 'FEATURED' | 'NEARBY' | 'ALL';
      countryCode?: string;
      search?: string;
      authorId?: number;
      page?: number;
      limit?: number;
    }
  ) {
    await this.seedInitialMomentsIfEmpty();

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const tab = (query.tab || 'FEATURED').toUpperCase();
    const where: any = {
      status: 'PUBLISHED',
      moderationStatus: 'APPROVED',
    };

    // Filter by author if requested
    if (query.authorId) {
      where.authorId = Number(query.authorId);
    }

    // Search query filter
    if (query.search && query.search.trim().length > 0) {
      const s = query.search.trim();
      where.OR = [
        { caption: { contains: s } },
        { hashtags: { contains: s } },
        { author: { username: { contains: s } } },
        { author: { displayName: { contains: s } } },
      ];
    } else if (tab === 'FOLLOWING') {
      if (!currentUserId) {
        return { moments: [], total: 0, page, hasMore: false };
      }
      // Get IDs of users followed by current user
      const follows = await prisma.follow.findMany({
        where: { followerId: currentUserId },
        select: { followingId: true },
      });
      const followedUserIds = follows.map((f) => f.followingId);
      where.authorId = { in: followedUserIds };
      where.privacy = { in: ['PUBLIC', 'FOLLOWERS'] };
    } else if (tab === 'NEARBY') {
      const code = (query.countryCode || 'PK').toUpperCase();
      where.countryCode = code;
      where.privacy = 'PUBLIC';
    } else if (tab === 'FEATURED') {
      where.privacy = 'PUBLIC';
    }

    // Order logic
    let orderBy: any = { createdAt: 'desc' };
    if (tab === 'FEATURED' && !query.search) {
      orderBy = [{ featured: 'desc' }, { rankingScore: 'desc' }, { createdAt: 'desc' }];
    }

    const [moments, total] = await Promise.all([
      prisma.moment.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              numericId: true,
              username: true,
              displayName: true,
              avatar: true,
              level: true,
              vipTier: true,
              country: true,
              countryCode: true,
            },
          },
          likes: currentUserId ? { where: { userId: currentUserId }, select: { id: true } } : false,
        },
      }),
      prisma.moment.count({ where }),
    ]);

    // Check which authors are currently LIVE
    const authorIds = [...new Set(moments.map((m) => m.authorId))];
    const liveRooms = await prisma.liveRoom.findMany({
      where: {
        hostId: { in: authorIds },
        status: { in: ['LIVE', 'LOCKED'] },
      },
      select: { hostId: true, roomId: true, title: true },
    });
    const liveHostMap = new Map<number, { roomId: string; title: string }>();
    liveRooms.forEach((r) => liveHostMap.set(r.hostId, { roomId: r.roomId, title: r.title }));

    const formattedMoments = moments.map((m) => {
      const isLiked = currentUserId ? (m.likes && m.likes.length > 0) : false;
      const liveInfo = liveHostMap.get(m.authorId);

      let parsedHashtags: string[] = [];
      try {
        if (m.hashtags) parsedHashtags = JSON.parse(m.hashtags);
      } catch (_) {
        if (m.hashtags) parsedHashtags = m.hashtags.split(',').map((s) => s.trim());
      }

      return {
        id: m.id,
        numericId: m.numericId,
        authorId: m.author.id,
        authorNumericId: m.author.numericId,
        authorUsername: m.author.username,
        authorDisplayName: m.author.displayName || m.author.username,
        authorAvatar: m.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        authorLevel: m.author.level,
        authorVipTier: m.author.vipTier,
        authorCountry: m.author.country,
        authorCountryCode: m.author.countryCode || m.countryCode,
        isAuthorLive: Boolean(liveInfo),
        authorLiveRoomId: liveInfo?.roomId || null,
        authorLiveRoomTitle: liveInfo?.title || null,
        mediaUrl: m.mediaUrl,
        mediaType: m.mediaType,
        thumbnailUrl: m.thumbnailUrl,
        caption: m.caption || '',
        hashtags: parsedHashtags,
        privacy: m.privacy,
        countryCode: m.countryCode,
        status: m.status,
        featured: m.featured,
        viewCount: m.viewCount,
        likeCount: m.likeCount,
        commentCount: m.commentCount,
        shareCount: m.shareCount,
        isLiked,
        createdAt: m.createdAt.toISOString(),
      };
    });

    return {
      moments: formattedMoments,
      total,
      page,
      limit,
      hasMore: skip + moments.length < total,
    };
  }

  /**
   * 📸 Create New Moment
   */
  static async createMoment(
    userId: number,
    data: {
      caption?: string;
      mediaUrl: string;
      mediaType?: string;
      thumbnailUrl?: string;
      privacy?: string;
      countryCode?: string;
      hashtags?: string[];
      mentions?: string[];
    }
  ) {
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { numericId: userId },
        ],
      },
    });

    if (!user) {
      user = await prisma.user.findFirst({ orderBy: { id: 'asc' } });
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          numericId: 100001,
          username: 'AuraUser_100001',
          displayName: 'Aura User',
          email: 'user100001@auralive.app',
          passwordHash: 'dummy_hash',
          level: 1,
          countryCode: 'PK',
        },
      });
    }

    const lastMoment = await prisma.moment.findFirst({ orderBy: { numericId: 'desc' } });
    const numericId = (lastMoment?.numericId ?? 500000) + 1;

    const privacy = data.privacy === 'PRIVATE' ? 'PRIVATE' : (data.privacy === 'FOLLOWERS' ? 'FOLLOWERS' : 'PUBLIC');
    const mediaType = data.mediaType === 'VIDEO' ? 'VIDEO' : (data.mediaType === 'TEXT' ? 'TEXT' : 'IMAGE');
    const countryCode = (data.countryCode || user.countryCode || 'PK').toUpperCase();
    const rankingScore = (user.level * 10) + 100;

    const moment = await prisma.moment.create({
      data: {
        numericId,
        authorId: user.id,
        mediaUrl: data.mediaUrl,
        mediaType,
        thumbnailUrl: data.thumbnailUrl,
        caption: data.caption || '',
        hashtags: data.hashtags ? JSON.stringify(data.hashtags) : null,
        mentions: data.mentions ? JSON.stringify(data.mentions) : null,
        privacy,
        countryCode,
        status: 'PUBLISHED',
        moderationStatus: 'APPROVED',
        featured: false,
        rankingScore,
      },
      include: {
        author: {
          select: {
            id: true,
            numericId: true,
            username: true,
            displayName: true,
            avatar: true,
            level: true,
            vipTier: true,
            country: true,
            countryCode: true,
          },
        },
      },
    });

    // Broadcast realtime event
    broadcastGlobal('moment.created', {
      momentId: moment.id,
      numericId: moment.numericId,
      authorId: moment.authorId,
      authorUsername: moment.author.username,
      authorDisplayName: moment.author.displayName,
      authorAvatar: moment.author.avatar,
      caption: moment.caption,
      mediaUrl: moment.mediaUrl,
      mediaType: moment.mediaType,
      countryCode: moment.countryCode,
      createdAt: moment.createdAt.toISOString(),
    });

    return moment;
  }

  /**
   * ❤️ Like Moment
   */
  static async likeMoment(userId: number, momentId: string) {
    const moment = await prisma.moment.findUnique({ where: { id: momentId } });
    if (!moment) throw new Error('Moment not found');

    const existing = await prisma.momentLike.findUnique({
      where: { userId_momentId: { userId, momentId } },
    });

    if (!existing) {
      await prisma.momentLike.create({
        data: { userId, momentId },
      });
      const updated = await prisma.moment.update({
        where: { id: momentId },
        data: {
          likeCount: { increment: 1 },
          rankingScore: { increment: 5 },
        },
      });

      broadcastGlobal('moment.liked', {
        momentId,
        userId,
        likeCount: updated.likeCount,
      });

      return { liked: true, likeCount: updated.likeCount };
    }

    return { liked: true, likeCount: moment.likeCount };
  }

  /**
   * 💔 Unlike Moment
   */
  static async unlikeMoment(userId: number, momentId: string) {
    const moment = await prisma.moment.findUnique({ where: { id: momentId } });
    if (!moment) throw new Error('Moment not found');

    try {
      await prisma.momentLike.delete({
        where: { userId_momentId: { userId, momentId } },
      });
      const updated = await prisma.moment.update({
        where: { id: momentId },
        data: {
          likeCount: { decrement: moment.likeCount > 0 ? 1 : 0 },
          rankingScore: { decrement: 5 },
        },
      });

      broadcastGlobal('moment.unliked', {
        momentId,
        userId,
        likeCount: updated.likeCount,
      });

      return { liked: false, likeCount: updated.likeCount };
    } catch (_) {
      return { liked: false, likeCount: moment.likeCount };
    }
  }

  /**
   * 💬 Get Comments for Moment
   */
  static async getComments(momentId: string, page = 1, limit = 30) {
    const skip = (Math.max(1, page) - 1) * limit;
    const [comments, total] = await Promise.all([
      prisma.momentComment.findMany({
        where: { momentId, status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              numericId: true,
              username: true,
              displayName: true,
              avatar: true,
              level: true,
              vipTier: true,
            },
          },
        },
      }),
      prisma.momentComment.count({ where: { momentId, status: 'ACTIVE' } }),
    ]);

    return {
      comments: comments.map((c) => ({
        id: c.id,
        momentId: c.momentId,
        userId: c.user.id,
        userNumericId: c.user.numericId,
        username: c.user.username,
        displayName: c.user.displayName || c.user.username,
        avatar: c.user.avatar,
        level: c.user.level,
        vipTier: c.user.vipTier,
        text: c.text,
        createdAt: c.createdAt.toISOString(),
      })),
      total,
      page,
      hasMore: skip + comments.length < total,
    };
  }

  /**
   * 💬 Add Comment to Moment
   */
  static async addComment(userId: number, momentId: string, text: string) {
    const trimmed = text.trim();
    if (!trimmed) throw new Error('Comment text cannot be empty');

    const moment = await prisma.moment.findUnique({ where: { id: momentId } });
    if (!moment) throw new Error('Moment not found');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const comment = await prisma.momentComment.create({
      data: {
        momentId,
        userId,
        text: trimmed,
        status: 'ACTIVE',
      },
      include: {
        user: {
          select: {
            id: true,
            numericId: true,
            username: true,
            displayName: true,
            avatar: true,
            level: true,
            vipTier: true,
          },
        },
      },
    });

    const updated = await prisma.moment.update({
      where: { id: momentId },
      data: {
        commentCount: { increment: 1 },
        rankingScore: { increment: 8 },
      },
    });

    const commentPayload = {
      id: comment.id,
      momentId,
      userId: comment.user.id,
      userNumericId: comment.user.numericId,
      username: comment.user.username,
      displayName: comment.user.displayName || comment.user.username,
      avatar: comment.user.avatar,
      level: comment.user.level,
      vipTier: comment.user.vipTier,
      text: comment.text,
      createdAt: comment.createdAt.toISOString(),
      commentCount: updated.commentCount,
    };

    broadcastGlobal('moment.comment.created', commentPayload);

    return commentPayload;
  }

  /**
   * 🗑️ Delete Comment
   */
  static async deleteComment(userId: number, commentId: string) {
    const comment = await prisma.momentComment.findUnique({ where: { id: commentId } });
    if (!comment) throw new Error('Comment not found');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (comment.userId !== userId && user?.role !== 'ADMIN') {
      throw new Error('Not authorized to delete this comment');
    }

    await prisma.momentComment.delete({ where: { id: commentId } });
    const updated = await prisma.moment.update({
      where: { id: comment.momentId },
      data: {
        commentCount: { decrement: 1 },
        rankingScore: { decrement: 8 },
      },
    });

    broadcastGlobal('moment.comment.deleted', {
      momentId: comment.momentId,
      commentId,
      commentCount: Math.max(0, updated.commentCount),
    });

    return { success: true };
  }

  /**
   * 👁️ Record Moment View (Deduplicated)
   */
  static async recordView(userId: number | null, momentId: string, ip?: string) {
    try {
      if (userId) {
        const existing = await prisma.momentView.findFirst({
          where: { momentId, userId },
        });
        if (!existing) {
          await prisma.momentView.create({
            data: { momentId, userId, viewerIp: ip },
          });
          await prisma.moment.update({
            where: { id: momentId },
            data: { viewCount: { increment: 1 }, rankingScore: { increment: 1 } },
          });
        }
      } else {
        await prisma.moment.update({
          where: { id: momentId },
          data: { viewCount: { increment: 1 }, rankingScore: { increment: 1 } },
        });
      }
    } catch (_) {}
  }

  /**
   * ↗️ Record Moment Share
   */
  static async recordShare(userId: number, momentId: string, platform = 'INTERNAL') {
    try {
      await prisma.momentShare.create({
        data: { momentId, userId, platform },
      });
      const updated = await prisma.moment.update({
        where: { id: momentId },
        data: { shareCount: { increment: 1 }, rankingScore: { increment: 10 } },
      });

      broadcastGlobal('moment.shared', {
        momentId,
        shareCount: updated.shareCount,
      });

      return { shareCount: updated.shareCount };
    } catch (_) {
      return { shareCount: 0 };
    }
  }

  /**
   * 🚨 Report Moment
   */
  static async reportMoment(reporterId: number, momentId: string, reason: string, details?: string) {
    const report = await prisma.momentReport.create({
      data: {
        momentId,
        reporterId,
        reason,
        details,
        status: 'PENDING',
      },
    });

    await prisma.moment.update({
      where: { id: momentId },
      data: {
        reportsCount: { increment: 1 },
        moderationStatus: 'FLAGGED',
      },
    });

    broadcastGlobal('moment.reported', {
      momentId,
      reportId: report.id,
      reason,
    });

    return report;
  }

  /**
   * 🛡️ Admin Moderate Moment (Approve / Restrict / Delete / Feature / Unfeature)
   */
  static async adminModerateMoment(
    momentId: string,
    action: 'APPROVE' | 'RESTRICT' | 'DELETE' | 'FEATURE' | 'UNFEATURE',
    reason?: string,
    assignedModerator?: string
  ) {
    const moment = await prisma.moment.findUnique({ where: { id: momentId } });
    if (!moment) throw new Error('Moment not found');

    let updateData: any = {};
    if (action === 'APPROVE') {
      updateData = { status: 'PUBLISHED', moderationStatus: 'APPROVED' };
    } else if (action === 'RESTRICT') {
      updateData = { status: 'RESTRICTED', moderationStatus: 'FLAGGED' };
    } else if (action === 'DELETE') {
      updateData = { status: 'DELETED', moderationStatus: 'REJECTED' };
    } else if (action === 'FEATURE') {
      updateData = { featured: true, featuredAt: new Date() };
    } else if (action === 'UNFEATURE') {
      updateData = { featured: false, featuredAt: null };
    }

    if (assignedModerator) {
      updateData.assignedModerator = assignedModerator;
    }

    const updated = await prisma.moment.update({
      where: { id: momentId },
      data: updateData,
    });

    broadcastGlobal('moment.moderated', {
      momentId,
      status: updated.status,
      moderationStatus: updated.moderationStatus,
      featured: updated.featured,
      reason,
    });

    return updated;
  }

  /**
   * 📊 Get Admin Moments Catalog (Real DB metrics)
   */
  static async getAdminMomentsCatalog() {
    await this.seedInitialMomentsIfEmpty();

    const moments = await prisma.moment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        author: {
          select: {
            id: true,
            numericId: true,
            username: true,
            displayName: true,
            avatar: true,
            country: true,
            countryCode: true,
          },
        },
      },
    });

    const [totalMoments, publishedMoments, restrictedMoments, reportedMoments] = await Promise.all([
      prisma.moment.count(),
      prisma.moment.count({ where: { status: 'PUBLISHED' } }),
      prisma.moment.count({ where: { status: 'RESTRICTED' } }),
      prisma.moment.count({ where: { reportsCount: { gt: 0 } } }),
    ]);

    const totalLikes = moments.reduce((acc, m) => acc + m.likeCount, 0);
    const totalComments = moments.reduce((acc, m) => acc + m.commentCount, 0);
    const totalViews = moments.reduce((acc, m) => acc + m.viewCount, 0);

    const formattedCatalog = moments.map((m) => ({
      id: m.numericId,
      momentId: m.id,
      authorId: m.author.numericId,
      authorName: m.author.displayName || m.author.username,
      authorAvatar: m.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      country: m.author.country || 'Pakistan',
      countryCode: m.countryCode,
      mediaType: m.mediaType,
      mediaUrl: m.mediaUrl,
      caption: m.caption || 'No Caption',
      likesCount: m.likeCount,
      commentsCount: m.commentCount,
      viewsCount: m.viewCount,
      sharesCount: m.shareCount,
      reportsCount: m.reportsCount,
      status: m.status,
      moderationStatus: m.moderationStatus,
      featured: m.featured,
      assignedModerator: m.assignedModerator || 'Unassigned',
      createdAt: m.createdAt.toISOString().replace('T', ' ').substring(0, 19),
    }));

    return {
      moments: formattedCatalog,
      totalMoments,
      publishedMoments,
      restrictedMoments,
      reportedMoments,
      totalLikes,
      totalComments,
      totalViews,
    };
  }
}
