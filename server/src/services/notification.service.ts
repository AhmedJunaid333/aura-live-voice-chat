import { prisma } from '../config/database.js';

export class NotificationService {
  /**
   * Fetch notifications for a user with unread status & pagination
   */
  static async getUserNotifications(userId: number, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [total, unreadCount, records] = await Promise.all([
      prisma.notification.count({ where: { recipientId: userId } }),
      prisma.notification.count({ where: { recipientId: userId, readAt: null } }),
      prisma.notification.findMany({
        where: { recipientId: userId },
        include: {
          sender: {
            select: {
              id: true,
              numericId: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    const data = records.map((r) => ({
      id: r.id,
      recipientId: r.recipientId,
      senderId: r.senderId,
      senderUsername: r.sender.username,
      senderAvatar: r.sender.avatar,
      senderNumericId: r.sender.numericId,
      type: r.type,
      entityId: r.entityId,
      title: r.title,
      message: r.message,
      isRead: r.readAt !== null,
      readAt: r.readAt?.toISOString(),
      createdAt: r.createdAt.toISOString(),
    }));

    return { total, unreadCount, page, limit, data };
  }

  /**
   * Mark a single notification as read
   */
  static async markAsRead(notificationId: string, userId: number) {
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, recipientId: userId },
    });

    if (!notification) {
      throw new Error('Notification not found.');
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });

    const unreadCount = await prisma.notification.count({
      where: { recipientId: userId, readAt: null },
    });

    return {
      id: updated.id,
      isRead: true,
      readAt: updated.readAt?.toISOString(),
      unreadCount,
    };
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId: number) {
    await prisma.notification.updateMany({
      where: { recipientId: userId, readAt: null },
      data: { readAt: new Date() },
    });

    return { success: true, unreadCount: 0 };
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(userId: number) {
    const unreadCount = await prisma.notification.count({
      where: { recipientId: userId, readAt: null },
    });
    return { unreadCount };
  }
}
