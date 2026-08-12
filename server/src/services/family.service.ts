import { prisma } from '../config/database.js';
import { emitToRoom, emitToUser, broadcastGlobal } from '../websocket/socketServer.js';
import { generateAgoraRtcToken, RtcRole } from '../utils/agoraToken.js';

export class FamilyService {
  /**
   * 👑 Create New Family (Owner becomes authenticated user)
   */
  static async createFamily(data: {
    ownerId: number;
    name: string;
    description?: string;
    rules?: string;
    logo?: string;
    icon?: string;
    country?: string;
  }) {
    const owner = await prisma.user.findUnique({ where: { id: data.ownerId } });
    if (!owner) {
      const err: any = new Error('Owner user not found.');
      err.statusCode = 404;
      throw err;
    }

    // Check if user already owns or belongs to a family
    const existingMembership = await prisma.familyMember.findUnique({
      where: { userId: data.ownerId },
      include: { family: true },
    });

    if (existingMembership) {
      const err: any = new Error(`You are already a member of family "${existingMembership.family.name}". Leave current family first.`);
      err.statusCode = 400;
      throw err;
    }

    // Check if name is taken
    const existingName = await prisma.family.findUnique({
      where: { name: data.name.trim() },
    });
    if (existingName) {
      const err: any = new Error('A family with this name already exists.');
      err.statusCode = 400;
      throw err;
    }

    const familyId = `FAM-${owner.numericId}-${Math.floor(1000 + Math.random() * 9000)}`;

    const result = await prisma.$transaction(async (tx) => {
      const family = await tx.family.create({
        data: {
          familyId,
          name: data.name.trim(),
          description: data.description || 'Official Aura Live Family ✨',
          rules: data.rules || '1. Respect all members\n2. Support family audio rooms\n3. Follow Aura Live guidelines',
          logo: data.logo || null,
          icon: data.icon || '🦁',
          country: data.country || owner.country || 'Pakistan',
          leaderId: data.ownerId,
          level: 1,
          xp: 100,
          totalDiamonds: 0,
          weeklyDiamonds: 0,
          monthlyDiamonds: 0,
          treasuryCoins: 0,
          status: 'ACTIVE',
        },
      });

      const member = await tx.familyMember.create({
        data: {
          familyId: family.id,
          userId: data.ownerId,
          role: 'OWNER',
          contributionDiamonds: 0,
          contributionCoins: 0,
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          actorId: data.ownerId,
          actorRole: 'OWNER',
          action: 'FAMILY_CREATED',
          resource: `Family:${family.id}`,
          details: JSON.stringify({ familyId: family.familyId, name: family.name }),
        },
      });

      return { family, member };
    });

    // Realtime Global Broadcast
    broadcastGlobal('family.created', {
      familyId: result.family.familyId,
      name: result.family.name,
      ownerUsername: owner.username,
      timestamp: new Date().toISOString(),
    });

    return result;
  }

  /**
   * 🔍 Get Family Profile Details
   */
  static async getFamilyProfile(familyIdOrNumId: string, currentUserId?: number) {
    const family = await prisma.family.findFirst({
      where: {
        OR: [{ id: familyIdOrNumId }, { familyId: familyIdOrNumId }, { name: familyIdOrNumId }],
      },
      include: {
        leader: {
          select: { id: true, numericId: true, username: true, avatar: true, level: true, vipTier: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, numericId: true, username: true, avatar: true, level: true, vipTier: true, status: true },
            },
          },
          orderBy: { contributionDiamonds: 'desc' },
          take: 20,
        },
        announcements: {
          orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
          take: 5,
        },
        rooms: {
          where: { status: { in: ['LIVE', 'LOCKED'] } },
          include: {
            host: { select: { id: true, numericId: true, username: true, avatar: true } },
          },
        },
        _count: {
          select: { members: true, rooms: true, messages: true },
        },
      },
    });

    if (!family) {
      const err: any = new Error('Family not found.');
      err.statusCode = 404;
      throw err;
    }

    let userRole: string | null = null;
    if (currentUserId) {
      const membership = await prisma.familyMember.findUnique({
        where: { userId: currentUserId },
      });
      if (membership && membership.familyId === family.id) {
        userRole = membership.role;
      }
    }

    return {
      ...family,
      currentUserRole: userRole,
    };
  }

  /**
   * 📋 List / Discover Families with Filtering & Search
   */
  static async listFamilies(query?: { search?: string; country?: string; page?: number; limit?: number }) {
    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;

    const whereClause: any = { status: 'ACTIVE' };
    if (query?.search) {
      whereClause.OR = [
        { name: { contains: query.search } },
        { familyId: { contains: query.search } },
      ];
    }
    if (query?.country) {
      whereClause.country = query.country;
    }

    const [families, total] = await Promise.all([
      prisma.family.findMany({
        where: whereClause,
        include: {
          leader: {
            select: { id: true, numericId: true, username: true, avatar: true },
          },
          _count: {
            select: { members: true, rooms: true },
          },
        },
        orderBy: [{ totalDiamonds: 'desc' }, { level: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.family.count({ where: whereClause }),
    ]);

    return {
      families,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 👤 Get Logged-in User's Active Family
   */
  static async getMyFamily(userId: number) {
    const membership = await prisma.familyMember.findUnique({
      where: { userId },
      include: {
        family: {
          include: {
            leader: {
              select: { id: true, numericId: true, username: true, avatar: true, level: true },
            },
            _count: {
              select: { members: true, rooms: true },
            },
          },
        },
      },
    });

    return membership;
  }

  /**
   * 💌 Invite a User to Family
   */
  static async inviteMember(data: {
    familyId: string;
    inviterId: number;
    targetUserId: number;
  }) {
    const family = await prisma.family.findFirst({
      where: { OR: [{ id: data.familyId }, { familyId: data.familyId }] },
    });

    if (!family) {
      const err: any = new Error('Family not found.');
      err.statusCode = 404;
      throw err;
    }

    // RBAC: Check inviter role
    const inviterMembership = await prisma.familyMember.findUnique({
      where: { userId: data.inviterId },
    });

    if (!inviterMembership || inviterMembership.familyId !== family.id || !['OWNER', 'ADMIN', 'CO_ADMIN'].includes(inviterMembership.role)) {
      const err: any = new Error('Unauthorized. Only Family Owner and Admins can invite members.');
      err.statusCode = 403;
      throw err;
    }

    // Check if target user is banned
    const isBanned = await prisma.familyBan.findUnique({
      where: { familyId_userId: { familyId: family.id, userId: data.targetUserId } },
    });
    if (isBanned) {
      const err: any = new Error('Target user is currently banned from this family.');
      err.statusCode = 400;
      throw err;
    }

    // Check if target user is already a member of ANY family
    const targetMembership = await prisma.familyMember.findUnique({
      where: { userId: data.targetUserId },
    });
    if (targetMembership) {
      const err: any = new Error('User is already a member of a family.');
      err.statusCode = 400;
      throw err;
    }

    // Upsert invitation
    const invitation = await prisma.familyInvitation.create({
      data: {
        familyId: family.id,
        inviterId: data.inviterId,
        targetUserId: data.targetUserId,
        status: 'PENDING',
      },
      include: {
        family: { select: { id: true, familyId: true, name: true, logo: true, icon: true } },
        inviter: { select: { id: true, numericId: true, username: true } },
        targetUser: { select: { id: true, numericId: true, username: true } },
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: data.inviterId,
        actorRole: inviterMembership.role,
        action: 'MEMBER_INVITED',
        resource: `Family:${family.id}`,
        details: JSON.stringify({ targetUserId: data.targetUserId, invitationId: invitation.id }),
      },
    });

    // Realtime notification to target user
    emitToUser(invitation.targetUser.numericId, 'family.member.invited', {
      invitationId: invitation.id,
      family: invitation.family,
      inviter: invitation.inviter,
      timestamp: new Date().toISOString(),
    });

    return invitation;
  }

  /**
   * 📬 Get My Pending Invitations
   */
  static async getMyInvitations(userId: number) {
    return await prisma.familyInvitation.findMany({
      where: { targetUserId: userId, status: 'PENDING' },
      include: {
        family: {
          select: { id: true, familyId: true, name: true, logo: true, icon: true, level: true, totalDiamonds: true },
        },
        inviter: {
          select: { id: true, numericId: true, username: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * ✍️ Respond to Family Invitation (Accept / Reject)
   */
  static async respondInvitation(data: {
    invitationId: string;
    userId: number;
    action: 'ACCEPTED' | 'REJECTED';
  }) {
    const invitation = await prisma.familyInvitation.findUnique({
      where: { id: data.invitationId },
      include: { family: true, targetUser: true },
    });

    if (!invitation || invitation.targetUserId !== data.userId) {
      const err: any = new Error('Invitation not found or unauthorized.');
      err.statusCode = 404;
      throw err;
    }

    if (invitation.status !== 'PENDING') {
      const err: any = new Error(`Invitation has already been ${invitation.status.toLowerCase()}.`);
      err.statusCode = 400;
      throw err;
    }

    if (data.action === 'ACCEPTED') {
      // Check if user already joined another family
      const existing = await prisma.familyMember.findUnique({ where: { userId: data.userId } });
      if (existing) {
        const err: any = new Error('You are already a member of a family.');
        err.statusCode = 400;
        throw err;
      }

      const result = await prisma.$transaction(async (tx) => {
        await tx.familyInvitation.update({
          where: { id: data.invitationId },
          data: { status: 'ACCEPTED', reviewedAt: new Date() },
        });

        const member = await tx.familyMember.create({
          data: {
            familyId: invitation.familyId,
            userId: data.userId,
            role: 'MEMBER',
            contributionDiamonds: 0,
            contributionCoins: 0,
          },
          include: {
            user: { select: { id: true, numericId: true, username: true, avatar: true } },
          },
        });

        // Family System Message
        await tx.familyMessage.create({
          data: {
            familyId: invitation.familyId,
            senderId: data.userId,
            type: 'SYS_JOIN',
            content: `🎉 ${invitation.targetUser.username} has joined the Family! Welcome!`,
          },
        });

        // Audit Log
        await tx.auditLog.create({
          data: {
            actorId: data.userId,
            actorRole: 'MEMBER',
            action: 'MEMBER_JOINED',
            resource: `Family:${invitation.familyId}`,
            details: JSON.stringify({ invitationId: data.invitationId }),
          },
        });

        return member;
      });

      // Realtime Broadcast to Family Room
      emitToRoom(`family_${invitation.family.id}`, 'family.member.joined', {
        familyId: invitation.family.familyId,
        user: result.user,
        role: result.role,
        timestamp: new Date().toISOString(),
      });

      return result;
    } else {
      const updated = await prisma.familyInvitation.update({
        where: { id: data.invitationId },
        data: { status: 'REJECTED', reviewedAt: new Date() },
      });

      await prisma.auditLog.create({
        data: {
          actorId: data.userId,
          actorRole: 'USER',
          action: 'MEMBER_REJECTED',
          resource: `Family:${invitation.familyId}`,
          details: JSON.stringify({ invitationId: data.invitationId }),
        },
      });

      return updated;
    }
  }

  /**
   * 🚪 Leave Family
   */
  static async leaveFamily(data: { familyId: string; userId: number }) {
    const family = await prisma.family.findFirst({
      where: { OR: [{ id: data.familyId }, { familyId: data.familyId }] },
    });

    if (!family) {
      const err: any = new Error('Family not found.');
      err.statusCode = 404;
      throw err;
    }

    const membership = await prisma.familyMember.findUnique({
      where: { userId: data.userId },
      include: { user: true },
    });

    if (!membership || membership.familyId !== family.id) {
      const err: any = new Error('You are not a member of this family.');
      err.statusCode = 400;
      throw err;
    }

    if (membership.role === 'OWNER') {
      const err: any = new Error('Family Owner cannot leave without transferring ownership first.');
      err.statusCode = 400;
      throw err;
    }

    await prisma.$transaction(async (tx) => {
      await tx.familyMember.delete({
        where: { userId: data.userId },
      });

      await tx.familyMessage.create({
        data: {
          familyId: family.id,
          senderId: data.userId,
          type: 'SYS_ROLE',
          content: `👋 ${membership.user.username} has left the family.`,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: data.userId,
          actorRole: membership.role,
          action: 'MEMBER_LEFT',
          resource: `Family:${family.id}`,
          details: JSON.stringify({ userId: data.userId, username: membership.user.username }),
        },
      });
    });

    emitToRoom(`family_${family.id}`, 'family.member.left', {
      familyId: family.familyId,
      userId: data.userId,
      username: membership.user.username,
      timestamp: new Date().toISOString(),
    });

    return { success: true, message: 'Successfully left the family.' };
  }

  /**
   * 🛡️ Update Member Role (Promote / Demote)
   * RBAC: Only OWNER can assign ADMIN / CO_ADMIN / HOST / MEMBER
   */
  static async updateMemberRole(data: {
    familyId: string;
    actorId: number;
    targetUserId: number;
    newRole: 'ADMIN' | 'CO_ADMIN' | 'HOST' | 'MEMBER';
  }) {
    const family = await prisma.family.findFirst({
      where: { OR: [{ id: data.familyId }, { familyId: data.familyId }] },
    });

    if (!family) {
      const err: any = new Error('Family not found.');
      err.statusCode = 404;
      throw err;
    }

    const actor = await prisma.familyMember.findUnique({ where: { userId: data.actorId } });
    if (!actor || actor.familyId !== family.id || actor.role !== 'OWNER') {
      const err: any = new Error('Unauthorized. Only Family Owner can change member roles.');
      err.statusCode = 403;
      throw err;
    }

    const target = await prisma.familyMember.findUnique({
      where: { userId: data.targetUserId },
      include: { user: true },
    });

    if (!target || target.familyId !== family.id) {
      const err: any = new Error('Target user is not a member of this family.');
      err.statusCode = 404;
      throw err;
    }

    if (target.role === 'OWNER') {
      const err: any = new Error('Cannot change role of Family Owner.');
      err.statusCode = 400;
      throw err;
    }

    const updated = await prisma.familyMember.update({
      where: { userId: data.targetUserId },
      data: { role: data.newRole },
      include: { user: { select: { id: true, numericId: true, username: true } } },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: data.actorId,
        actorRole: 'OWNER',
        action: 'ROLE_CHANGED',
        resource: `Family:${family.id}`,
        details: JSON.stringify({
          targetUserId: data.targetUserId,
          targetUsername: target.user.username,
          oldRole: target.role,
          newRole: data.newRole,
        }),
      },
    });

    // Realtime notification
    emitToRoom(`family_${family.id}`, 'family.member.role.updated', {
      familyId: family.familyId,
      userId: data.targetUserId,
      username: target.user.username,
      newRole: data.newRole,
      timestamp: new Date().toISOString(),
    });

    emitToUser(target.user.numericId, 'family.member.role.updated', {
      familyId: family.familyId,
      familyName: family.name,
      newRole: data.newRole,
      message: `Your family role has been updated to ${data.newRole}!`,
    });

    return updated;
  }

  /**
   * 🚫 Kick Member from Family
   */
  static async removeMember(data: {
    familyId: string;
    actorId: number;
    targetUserId: number;
    reason?: string;
  }) {
    const family = await prisma.family.findFirst({
      where: { OR: [{ id: data.familyId }, { familyId: data.familyId }] },
    });

    if (!family) {
      const err: any = new Error('Family not found.');
      err.statusCode = 404;
      throw err;
    }

    const actor = await prisma.familyMember.findUnique({ where: { userId: data.actorId } });
    if (!actor || actor.familyId !== family.id || !['OWNER', 'ADMIN'].includes(actor.role)) {
      const err: any = new Error('Unauthorized. Only Owner and Admins can remove members.');
      err.statusCode = 403;
      throw err;
    }

    const target = await prisma.familyMember.findUnique({
      where: { userId: data.targetUserId },
      include: { user: true },
    });

    if (!target || target.familyId !== family.id) {
      const err: any = new Error('Target is not a member of this family.');
      err.statusCode = 404;
      throw err;
    }

    if (target.role === 'OWNER' || (actor.role === 'ADMIN' && target.role === 'ADMIN')) {
      const err: any = new Error('Cannot kick this user due to role hierarchy.');
      err.statusCode = 403;
      throw err;
    }

    await prisma.$transaction(async (tx) => {
      await tx.familyMember.delete({ where: { userId: data.targetUserId } });

      await tx.auditLog.create({
        data: {
          actorId: data.actorId,
          actorRole: actor.role,
          action: 'MEMBER_REMOVED',
          resource: `Family:${family.id}`,
          details: JSON.stringify({
            targetUserId: data.targetUserId,
            targetUsername: target.user.username,
            reason: data.reason || 'Admin action',
          }),
        },
      });
    });

    emitToRoom(`family_${family.id}`, 'family.member.removed', {
      familyId: family.familyId,
      targetUserId: data.targetUserId,
      username: target.user.username,
      timestamp: new Date().toISOString(),
    });

    emitToUser(target.user.numericId, 'family.member.removed', {
      familyId: family.familyId,
      familyName: family.name,
      message: 'You have been removed from the family by an administrator.',
    });

    return { success: true, message: `Removed ${target.user.username} from family.` };
  }

  /**
   * 🔨 Ban User from Family
   */
  static async banMember(data: {
    familyId: string;
    actorId: number;
    targetUserId: number;
    reason?: string;
  }) {
    const family = await prisma.family.findFirst({
      where: { OR: [{ id: data.familyId }, { familyId: data.familyId }] },
    });

    if (!family) {
      const err: any = new Error('Family not found.');
      err.statusCode = 404;
      throw err;
    }

    const actor = await prisma.familyMember.findUnique({ where: { userId: data.actorId } });
    if (!actor || actor.familyId !== family.id || actor.role !== 'OWNER') {
      const err: any = new Error('Unauthorized. Only Family Owner can ban members.');
      err.statusCode = 403;
      throw err;
    }

    await prisma.$transaction(async (tx) => {
      // Remove member if currently inside
      await tx.familyMember.deleteMany({
        where: { familyId: family.id, userId: data.targetUserId },
      });

      // Add ban record
      await tx.familyBan.upsert({
        where: { familyId_userId: { familyId: family.id, userId: data.targetUserId } },
        create: {
          familyId: family.id,
          userId: data.targetUserId,
          bannedBy: data.actorId,
          reason: data.reason || 'Violation of family rules',
        },
        update: {
          bannedBy: data.actorId,
          reason: data.reason || 'Violation of family rules',
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: data.actorId,
          actorRole: 'OWNER',
          action: 'MEMBER_BANNED',
          resource: `Family:${family.id}`,
          details: JSON.stringify({ targetUserId: data.targetUserId, reason: data.reason }),
        },
      });
    });

    emitToRoom(`family_${family.id}`, 'family.member.banned', {
      familyId: family.familyId,
      targetUserId: data.targetUserId,
      timestamp: new Date().toISOString(),
    });

    return { success: true, message: 'User has been banned from family.' };
  }

  /**
   * 👑 Transfer Family Ownership
   */
  static async transferOwnership(data: {
    familyId: string;
    currentOwnerId: number;
    newOwnerUserId: number;
  }) {
    const family = await prisma.family.findFirst({
      where: { OR: [{ id: data.familyId }, { familyId: data.familyId }] },
    });

    if (!family || family.leaderId !== data.currentOwnerId) {
      const err: any = new Error('Unauthorized. Only the Family Owner can transfer ownership.');
      err.statusCode = 403;
      throw err;
    }

    const newOwnerMember = await prisma.familyMember.findUnique({
      where: { userId: data.newOwnerUserId },
      include: { user: true },
    });

    if (!newOwnerMember || newOwnerMember.familyId !== family.id) {
      const err: any = new Error('New owner must be an existing member of this family.');
      err.statusCode = 400;
      throw err;
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update family leaderId
      await tx.family.update({
        where: { id: family.id },
        data: { leaderId: data.newOwnerUserId },
      });

      // 2. Set new owner role to OWNER
      await tx.familyMember.update({
        where: { userId: data.newOwnerUserId },
        data: { role: 'OWNER' },
      });

      // 3. Demote old owner to ADMIN
      await tx.familyMember.update({
        where: { userId: data.currentOwnerId },
        data: { role: 'ADMIN' },
      });

      // 4. Audit Log
      await tx.auditLog.create({
        data: {
          actorId: data.currentOwnerId,
          actorRole: 'OWNER',
          action: 'OWNER_TRANSFERRED',
          resource: `Family:${family.id}`,
          details: JSON.stringify({
            oldOwnerId: data.currentOwnerId,
            newOwnerId: data.newOwnerUserId,
            newOwnerUsername: newOwnerMember.user.username,
          }),
        },
      });

      return { success: true };
    });

    emitToRoom(`family_${family.id}`, 'family.owner.transferred', {
      familyId: family.familyId,
      newOwnerUserId: data.newOwnerUserId,
      newOwnerUsername: newOwnerMember.user.username,
      timestamp: new Date().toISOString(),
    });

    return result;
  }

  /**
   * 🎙️ Create Family Audio Room
   */
  static async createFamilyRoom(data: {
    familyId: string;
    hostUserId: number;
    title: string;
    isFamilyOnly?: boolean;
    seatCount?: number;
  }) {
    const family = await prisma.family.findFirst({
      where: { OR: [{ id: data.familyId }, { familyId: data.familyId }] },
    });

    if (!family) {
      const err: any = new Error('Family not found.');
      err.statusCode = 404;
      throw err;
    }

    const member = await prisma.familyMember.findUnique({
      where: { userId: data.hostUserId },
      include: { user: true },
    });

    if (!member || member.familyId !== family.id || !['OWNER', 'ADMIN', 'CO_ADMIN', 'HOST'].includes(member.role)) {
      const err: any = new Error('Unauthorized. Only Family Owner, Admins, and approved Hosts can create family audio rooms.');
      err.statusCode = 403;
      throw err;
    }

    const roomId = `FAM-RM-${member.user.numericId}-${Math.floor(1000 + Math.random() * 9000)}`;

    const room = await prisma.liveRoom.create({
      data: {
        roomId,
        title: data.title,
        category: 'Family',
        hostId: data.hostUserId,
        seatCount: data.seatCount || 10,
        status: 'LIVE',
        familyId: family.id,
        isFamilyOnly: data.isFamilyOnly || false,
        isLocked: false,
        listenersCount: 1,
      },
      include: {
        host: {
          select: { id: true, numericId: true, username: true, avatar: true, level: true, vipTier: true },
        },
        family: {
          select: { id: true, familyId: true, name: true, logo: true, icon: true },
        },
      },
    });

    // Generate Agora RTC Token
    const agoraConfig = generateAgoraRtcToken(room.roomId, member.user.numericId, RtcRole.PUBLISHER);

    // Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: data.hostUserId,
        actorRole: member.role,
        action: 'ROOM_CREATED',
        resource: `FamilyRoom:${room.roomId}`,
        details: JSON.stringify({ familyId: family.familyId, title: room.title }),
      },
    });

    // Realtime Broadcast
    emitToRoom(`family_${family.id}`, 'family.room.created', {
      familyId: family.familyId,
      room,
      timestamp: new Date().toISOString(),
    });

    broadcastGlobal('live.started', {
      roomId: room.roomId,
      title: room.title,
      category: 'Family',
      family: room.family,
      host: room.host,
      timestamp: new Date().toISOString(),
    });

    return {
      room,
      agora: agoraConfig,
    };
  }

  /**
   * 💬 Post Realtime Family Chat Message
   */
  static async postFamilyMessage(data: {
    familyId: string;
    senderId: number;
    content: string;
    type?: string;
    mediaUrl?: string;
    replyToId?: string;
  }) {
    const family = await prisma.family.findFirst({
      where: { OR: [{ id: data.familyId }, { familyId: data.familyId }] },
    });

    if (!family) {
      const err: any = new Error('Family not found.');
      err.statusCode = 404;
      throw err;
    }

    const member = await prisma.familyMember.findUnique({
      where: { userId: data.senderId },
      include: {
        user: { select: { id: true, numericId: true, username: true, avatar: true, level: true, vipTier: true } },
      },
    });

    if (!member || member.familyId !== family.id) {
      const err: any = new Error('You must be a member of this family to chat.');
      err.statusCode = 403;
      throw err;
    }

    const message = await prisma.familyMessage.create({
      data: {
        familyId: family.id,
        senderId: data.senderId,
        type: data.type || 'TEXT',
        content: data.content,
        mediaUrl: data.mediaUrl || null,
        replyToId: data.replyToId || null,
      },
      include: {
        sender: { select: { id: true, numericId: true, username: true, avatar: true, level: true, vipTier: true } },
      },
    });

    // Broadcast Realtime Socket event to Family Room
    emitToRoom(`family_${family.id}`, 'family.chat.message', {
      familyId: family.familyId,
      message: {
        ...message,
        senderRole: member.role,
      },
      timestamp: new Date().toISOString(),
    });

    return {
      ...message,
      senderRole: member.role,
    };
  }

  /**
   * 📜 Fetch Family Chat Messages
   */
  static async getFamilyMessages(familyId: string, limit: number = 50) {
    const family = await prisma.family.findFirst({
      where: { OR: [{ id: familyId }, { familyId }] },
    });

    if (!family) {
      const err: any = new Error('Family not found.');
      err.statusCode = 404;
      throw err;
    }

    return await prisma.familyMessage.findMany({
      where: { familyId: family.id },
      include: {
        sender: { select: { id: true, numericId: true, username: true, avatar: true, level: true, vipTier: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * 💎 Atomic Family Diamond Contribution & XP Increment
   */
  static async recordFamilyContribution(data: {
    userId: number;
    diamonds: number;
    coins?: number;
    giftTransactionId?: string;
  }) {
    const member = await prisma.familyMember.findUnique({
      where: { userId: data.userId },
      include: { family: true },
    });

    if (!member) return null; // User not in a family

    const xpGained = Math.floor(data.diamonds * 1.5);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Member contribution
      await tx.familyMember.update({
        where: { id: member.id },
        data: {
          contributionDiamonds: { increment: data.diamonds },
          contributionCoins: { increment: data.coins || 0 },
        },
      });

      // 2. Update Family totals & XP
      const updatedFamily = await tx.family.update({
        where: { id: member.familyId },
        data: {
          totalDiamonds: { increment: data.diamonds },
          weeklyDiamonds: { increment: data.diamonds },
          monthlyDiamonds: { increment: data.diamonds },
          xp: { increment: xpGained },
          // Level up formula: Level = floor(sqrt(XP / 500)) + 1
          level: Math.max(member.family.level, Math.floor(Math.sqrt((member.family.xp + xpGained) / 500)) + 1),
        },
      });

      // 3. Record Contribution Ledger
      await tx.familyContribution.create({
        data: {
          familyId: member.familyId,
          userId: data.userId,
          diamonds: data.diamonds,
          coins: data.coins || 0,
          giftTransactionId: data.giftTransactionId || null,
        },
      });

      // 4. Audit Log
      await tx.auditLog.create({
        data: {
          actorId: data.userId,
          actorRole: member.role,
          action: 'DIAMOND_CONTRIBUTION',
          resource: `Family:${member.familyId}`,
          details: JSON.stringify({ diamonds: data.diamonds, xpGained }),
        },
      });

      return updatedFamily;
    });

    // Realtime broadcast to family channel
    emitToRoom(`family_${member.familyId}`, 'family.diamond.contribution', {
      familyId: member.family.familyId,
      userId: data.userId,
      diamonds: data.diamonds,
      totalFamilyDiamonds: result.totalDiamonds,
      familyLevel: result.level,
      familyXp: result.xp,
      timestamp: new Date().toISOString(),
    });

    return result;
  }

  /**
   * 🏆 Get Realtime Family Rankings (All-Time, Weekly, Monthly)
   */
  static async getFamilyRankings(period: 'all' | 'weekly' | 'monthly' = 'all') {
    let orderField: any = { totalDiamonds: 'desc' };
    if (period === 'weekly') orderField = { weeklyDiamonds: 'desc' };
    if (period === 'monthly') orderField = { monthlyDiamonds: 'desc' };

    return await prisma.family.findMany({
      where: { status: 'ACTIVE' },
      include: {
        leader: { select: { id: true, numericId: true, username: true, avatar: true } },
        _count: { select: { members: true, rooms: true } },
      },
      orderBy: [orderField, { xp: 'desc' }],
      take: 50,
    });
  }

  /**
   * 📢 Post / Pin Family Announcement
   */
  static async postAnnouncement(data: {
    familyId: string;
    authorId: number;
    title: string;
    content: string;
    isPinned?: boolean;
  }) {
    const family = await prisma.family.findFirst({
      where: { OR: [{ id: data.familyId }, { familyId: data.familyId }] },
    });

    if (!family) {
      const err: any = new Error('Family not found.');
      err.statusCode = 404;
      throw err;
    }

    const member = await prisma.familyMember.findUnique({ where: { userId: data.authorId } });
    if (!member || member.familyId !== family.id || !['OWNER', 'ADMIN'].includes(member.role)) {
      const err: any = new Error('Unauthorized. Only Owner and Admins can post announcements.');
      err.statusCode = 403;
      throw err;
    }

    const announcement = await prisma.familyAnnouncement.create({
      data: {
        familyId: family.id,
        authorId: data.authorId,
        title: data.title,
        content: data.content,
        isPinned: data.isPinned || false,
      },
      include: {
        author: { select: { id: true, numericId: true, username: true } },
      },
    });

    emitToRoom(`family_${family.id}`, 'family.announcement.created', {
      familyId: family.familyId,
      announcement,
      timestamp: new Date().toISOString(),
    });

    return announcement;
  }
}
