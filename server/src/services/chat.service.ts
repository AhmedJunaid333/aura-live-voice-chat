import { prisma } from '../config/database.js';
import { emitToUser } from '../websocket/socketServer.js';

export class ChatService {
  // ─── 1. Get Conversations ───
  static async getConversations(userId: number) {
    const members = await prisma.conversationMember.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    numericId: true,
                    username: true,
                    avatar: true,
                    level: true,
                    vipTier: true,
                    gender: true,
                  },
                },
              },
            },
            messages: {
              where: { isDeleted: false },
              take: 1,
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
      orderBy: { conversation: { lastMessageAt: 'desc' } },
    });

    return Promise.all(
      members.map(async (m) => {
        const conv = m.conversation;
        const otherMember = conv.members.find((mb) => mb.userId !== userId)?.user;
        const lastMsg = conv.messages[0];

        // Unread messages count for this participant
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: userId },
            isRead: false,
            isDeleted: false,
          },
        });

        return {
          id: conv.id,
          isGroup: conv.isGroup,
          title: conv.title || otherMember?.username || 'Chat',
          otherUser: otherMember ? {
            id: otherMember.id,
            numericId: otherMember.numericId,
            username: otherMember.username,
            avatar: otherMember.avatar,
            level: otherMember.level,
            vipTier: otherMember.vipTier,
            gender: otherMember.gender,
          } : null,
          lastMessage: lastMsg ? {
            id: lastMsg.id,
            content: lastMsg.content,
            type: lastMsg.type,
            senderId: lastMsg.senderId,
            isRead: lastMsg.isRead,
            createdAt: lastMsg.createdAt.toISOString(),
          } : null,
          unreadCount,
          lastMessageAt: conv.lastMessageAt.toISOString(),
        };
      })
    );
  }

  // ─── 2. Get or Create Direct Conversation ───
  static async getOrCreateDirectConversation(senderId: number, targetNumericId: number) {
    const receiver = await prisma.user.findUnique({ where: { numericId: targetNumericId } });
    if (!receiver) throw new Error(`User with numeric ID ${targetNumericId} not found.`);

    if (senderId === receiver.id) {
      throw new Error('You cannot open a conversation with yourself.');
    }

    // Check if either user blocked the other
    const isBlocked = await prisma.blockedUser.findFirst({
      where: {
        OR: [
          { blockerId: senderId, blockedId: receiver.id },
          { blockerId: receiver.id, blockedId: senderId },
        ],
      },
    });
    if (isBlocked) {
      throw new Error('Cannot create conversation due to block settings.');
    }

    // Find existing direct 1-to-1 conversation
    let member = await prisma.conversationMember.findFirst({
      where: {
        userId: senderId,
        conversation: {
          isGroup: false,
          members: { some: { userId: receiver.id } },
        },
      },
      include: { conversation: true },
    });

    let conversationId = member?.conversationId;

    if (!conversationId) {
      const newConv = await prisma.conversation.create({
        data: {
          isGroup: false,
          members: {
            create: [{ userId: senderId }, { userId: receiver.id }],
          },
        },
      });
      conversationId = newConv.id;
    }

    return {
      conversationId,
      otherUser: {
        id: receiver.id,
        numericId: receiver.numericId,
        username: receiver.username,
        avatar: receiver.avatar,
        level: receiver.level,
        vipTier: receiver.vipTier,
        gender: receiver.gender,
      },
    };
  }

  // ─── 3. Get Conversation Messages ───
  static async getMessages(conversationId: string, userId: number, limit = 50) {
    // Verify membership
    const member = await prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (!member) throw new Error('Not a participant in this conversation.');

    const messages = await prisma.message.findMany({
      where: { conversationId, isDeleted: false },
      orderBy: { createdAt: 'asc' },
      take: limit,
      include: {
        sender: {
          select: { id: true, numericId: true, username: true, avatar: true },
        },
      },
    });

    return messages.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      sender: m.sender,
      type: m.type,
      content: m.content,
      mediaUrl: m.mediaUrl,
      metadata: m.metadata,
      isRead: m.isRead,
      readAt: m.readAt ? m.readAt.toISOString() : null,
      replyToId: m.replyToId,
      createdAt: m.createdAt.toISOString(),
    }));
  }

  // ─── 4. Send Message ───
  static async sendMessage(senderId: number, data: { conversationId?: string; targetNumericId?: number; content: string; type?: string; mediaUrl?: string; metadata?: any }) {
    const sender = await prisma.user.findUnique({ where: { id: senderId } });
    if (!sender) throw new Error('Sender not found.');

    let conversationId = data.conversationId;
    let receiverId: number | null = null;
    let receiverNumericId: number | null = data.targetNumericId ?? null;

    if (conversationId) {
      // Find receiver from conversation members
      const members = await prisma.conversationMember.findMany({
        where: { conversationId },
        include: { user: { select: { id: true, numericId: true } } },
      });

      const isMember = members.some((m) => m.userId === senderId);
      if (!isMember) throw new Error('You are not a member of this conversation.');

      const other = members.find((m) => m.userId !== senderId);
      if (other) {
        receiverId = other.user.id;
        receiverNumericId = other.user.numericId;
      }
    } else if (data.targetNumericId) {
      const convData = await this.getOrCreateDirectConversation(senderId, data.targetNumericId);
      conversationId = convData.conversationId;
      receiverId = convData.otherUser.id;
      receiverNumericId = convData.otherUser.numericId;
    } else {
      throw new Error('Either conversationId or targetNumericId must be provided.');
    }

    // Check block rules
    if (receiverId) {
      const isBlocked = await prisma.blockedUser.findFirst({
        where: {
          OR: [
            { blockerId: senderId, blockedId: receiverId },
            { blockerId: receiverId, blockedId: senderId },
          ],
        },
      });
      if (isBlocked) throw new Error('Cannot send message due to block settings.');
    }

    // Persist message in DB
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: sender.id,
        type: data.type || 'TEXT',
        content: data.content,
        mediaUrl: data.mediaUrl,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    });

    // Update conversation lastMessageAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    const payload = {
      id: message.id,
      conversationId: message.conversationId,
      sender: {
        id: sender.id,
        numericId: sender.numericId,
        username: sender.username,
        avatar: sender.avatar,
      },
      type: message.type,
      content: message.content,
      mediaUrl: message.mediaUrl,
      metadata: message.metadata,
      isRead: false,
      readAt: null,
      createdAt: message.createdAt.toISOString(),
    };

    // Socket.IO Realtime Delivery to Receiver
    if (receiverNumericId) {
      emitToUser(receiverNumericId, 'chat.message', payload);

      // Create Notification if receiver is offline/not in active chat
      await prisma.notification.create({
        data: {
          recipientId: receiverId!,
          senderId: sender.id,
          type: 'CHAT_MESSAGE',
          entityId: conversationId,
          title: `New Message from ${sender.username}`,
          message: data.type === 'TEXT' ? data.content : `[${data.type || 'Media'}]`,
        },
      });
    }

    return payload;
  }

  // ─── 5. Mark Conversation Read ───
  static async markRead(userId: number, conversationId: string) {
    const now = new Date();

    // Mark all unread messages in conversation where recipient is userId as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: now,
      },
    });

    // Update participant lastReadAt
    await prisma.conversationMember.updateMany({
      where: { conversationId, userId },
      data: { lastReadAt: now },
    });

    // Find other participant and emit socket read event
    const otherMember = await prisma.conversationMember.findFirst({
      where: { conversationId, userId: { not: userId } },
      include: { user: { select: { numericId: true } } },
    });

    if (otherMember) {
      emitToUser(otherMember.user.numericId, 'chat.read', {
        conversationId,
        readBy: userId,
        readAt: now.toISOString(),
      });
    }

    return { conversationId, markedReadAt: now.toISOString() };
  }

  // ─── 6. Delete Message ───
  static async deleteMessage(userId: number, messageId: string) {
    const msg = await prisma.message.findUnique({ where: { id: messageId } });
    if (!msg) throw new Error('Message not found.');
    if (msg.senderId !== userId) throw new Error('You can only delete your own messages.');

    await prisma.message.update({
      where: { id: messageId },
      data: { isDeleted: true },
    });

    // Notify other participant via Socket.IO
    const otherMember = await prisma.conversationMember.findFirst({
      where: { conversationId: msg.conversationId, userId: { not: userId } },
      include: { user: { select: { numericId: true } } },
    });

    if (otherMember) {
      emitToUser(otherMember.user.numericId, 'chat.message_deleted', {
        messageId,
        conversationId: msg.conversationId,
      });
    }

    return { messageId, deleted: true };
  }

  // ─── 7. Report Message ───
  static async reportMessage(reporterId: number, data: { messageId?: string; reportedUserId: number; reason: string }) {
    const report = await prisma.messageReport.create({
      data: {
        reporterId,
        reportedUserId: data.reportedUserId,
        messageId: data.messageId,
        reason: data.reason,
      },
    });

    return report;
  }

  // ─── 8. Total Unread Messages Count ───
  static async getUnreadCount(userId: number) {
    const count = await prisma.message.count({
      where: {
        conversation: {
          members: { some: { userId } },
        },
        senderId: { not: userId },
        isRead: false,
        isDeleted: false,
      },
    });
    return count;
  }

  // ─── 9. Admin Moderation Reports ───
  static async getAdminReports() {
    const reports = await prisma.messageReport.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { select: { id: true, numericId: true, username: true, avatar: true } },
        reportedUser: { select: { id: true, numericId: true, username: true, avatar: true } },
        message: true,
      },
    });

    return reports.map((r) => ({
      id: r.id,
      reporterName: r.reporter.username,
      reporterUid: r.reporter.numericId,
      reportedUserName: r.reportedUser.username,
      reportedUserUid: r.reportedUser.numericId,
      messageId: r.messageId || 'N/A',
      messageContent: r.message?.content || '[No Content / Profile Report]',
      reason: r.reason,
      status: r.status,
      resolutionNote: r.resolutionNote,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  static async resolveReport(reportId: string, status: 'RESOLVED' | 'DISMISSED', resolutionNote?: string) {
    return prisma.messageReport.update({
      where: { id: reportId },
      data: {
        status,
        resolutionNote: resolutionNote || (status === 'RESOLVED' ? 'Action taken by platform compliance.' : 'Report dismissed.'),
      },
    });
  }
}
