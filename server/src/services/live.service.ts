import { prisma } from '../config/database.js';
import { generateAgoraRtcToken, RtcRole } from '../utils/agoraToken.js';
import { emitToRoom, broadcastGlobal } from '../websocket/socketServer.js';

export class LiveService {
  /**
   * Create Live Voice Room & Generate RTC Token
   */
  static async createRoom(data: {
    hostUserId: number;
    title: string;
    category?: string;
    seatCount?: number;
  }) {
    const hostUser = await prisma.user.findUnique({
      where: { id: data.hostUserId },
    });

    if (!hostUser) {
      throw new Error('Host user not found.');
    }

    const roomId = `RM-${hostUser.numericId}-${Math.floor(1000 + Math.random() * 9000)}`;

    const room = await prisma.liveRoom.create({
      data: {
        roomId,
        title: data.title,
        category: data.category || 'Music',
        hostId: data.hostUserId,
        seatCount: data.seatCount || 10,
        status: 'LIVE',
        listenersCount: 1,
      },
      include: {
        host: {
          select: { id: true, numericId: true, username: true, avatar: true, level: true, vipTier: true },
        },
      },
    });

    // Generate Host Agora RTC Token
    const agoraConfig = generateAgoraRtcToken(room.roomId, hostUser.numericId, RtcRole.PUBLISHER);

    // Broadcast room live event to all connected clients
    broadcastGlobal('live.started', {
      roomId: room.roomId,
      title: room.title,
      category: room.category,
      host: room.host,
      timestamp: new Date().toISOString(),
    });

    return {
      room,
      agora: agoraConfig,
    };
  }

  /**
   * Audience join room & fetch Agora RTC Token
   */
  static async joinRoom(roomId: string, userNumericId: number) {
    const room = await prisma.liveRoom.findUnique({
      where: { roomId },
      include: {
        host: {
          select: { id: true, numericId: true, username: true, avatar: true, level: true, vipTier: true },
        },
      },
    });

    if (!room || room.status === 'ENDED') {
      throw new Error('Live room is not active.');
    }

    // Increment listeners
    await prisma.liveRoom.update({
      where: { id: room.id },
      data: { listenersCount: { increment: 1 } },
    });

    // Generate Subscriber Agora RTC Token
    const agoraConfig = generateAgoraRtcToken(room.roomId, userNumericId, RtcRole.SUBSCRIBER);

    return {
      room,
      agora: agoraConfig,
    };
  }

  /**
   * Send Gift Inside Live Room (Atomic Transaction)
   */
  static async sendGiftInRoom(data: {
    roomId: string;
    senderUserId: number;
    receiverUserId: number;
    giftId: string;
    count?: number;
  }) {
    const giftCount = data.count || 1;
    const gift = await prisma.gift.findUnique({
      where: { id: data.giftId },
    });

    if (!gift) {
      throw new Error('Gift not found.');
    }

    const totalCoins = gift.costCoins * giftCount;
    const totalDiamonds = gift.rewardDiamonds * giftCount;

    const sender = await prisma.user.findUnique({ where: { id: data.senderUserId } });
    if (!sender || sender.coins < totalCoins) {
      throw new Error('Insufficient coin balance to send this gift.');
    }


    // Atomic Transaction: Debit Sender, Credit Receiver, Record Gift Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Debit sender coins
      const updatedSender = await tx.user.update({
        where: { id: data.senderUserId },
        data: { coins: { decrement: totalCoins } },
      });

      // 2. Credit receiver diamonds
      const updatedReceiver = await tx.user.update({
        where: { id: data.receiverUserId },
        data: { diamonds: { increment: totalDiamonds } },
      });

      // 3. Record Gift Transaction
      const giftTx = await tx.giftTransaction.create({
        data: {
          roomId: data.roomId,
          senderId: data.senderUserId,
          receiverId: data.receiverUserId,
          giftId: data.giftId,
          count: giftCount,
          totalCoins,
          totalDiamonds,
        },
      });

      return { updatedSender, updatedReceiver, giftTx };
    });

    // Broadcast Realtime Gift Animation in Room
    emitToRoom(data.roomId, 'gift.sent', {
      giftId: gift.id,
      giftName: gift.name,
      giftIcon: gift.icon,
      count: giftCount,
      senderNumericId: sender.numericId,
      senderUsername: sender.username,
      totalCoins: Number(totalCoins),
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      remainingCoins: Number(result.updatedSender.coins),
      giftTransactionId: result.giftTx.id,
    };
  }

  /**
   * Generate Agora Dynamic Token for Channel & Role
   */
  static generateTokenForChannel(channelName: string, numericUid: number, role: 'publisher' | 'subscriber') {
    const rtcRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    return generateAgoraRtcToken(channelName, numericUid, rtcRole);
  }
}

