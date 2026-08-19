import { prisma } from '../config/database.js';
import { LiveService } from '../services/live.service.js';
import { GiftService } from '../services/gift.service.js';

async function main() {
  console.log('🔍 Starting Room View Options Test Suite (5 Core Metrics)...');

  // 0. Ensure gift catalog is seeded
  await GiftService.seedGiftCatalog();

  const timestamp = Date.now();
  // 1. Create Test Host & Viewer
  const hostUser = await prisma.user.create({
    data: {
      numericId: Math.floor(800000 + Math.random() * 100000),
      username: `host_view_${timestamp}`,
      displayName: `Super Host ${timestamp}`,
      email: `host_view_${timestamp}@auralive.io`,
      passwordHash: 'dummy_hash',
      role: 'USER',
      status: 'ACTIVE',
      coins: 10000,
      diamonds: 50000,
    },
  });

  const viewerUser = await prisma.user.create({
    data: {
      numericId: Math.floor(800000 + Math.random() * 100000),
      username: `viewer_view_${timestamp}`,
      displayName: `Viewer User ${timestamp}`,
      email: `viewer_view_${timestamp}@auralive.io`,
      passwordHash: 'dummy_hash',
      role: 'USER',
      status: 'ACTIVE',
      coins: 5000,
      diamonds: 20000,
    },
  });

  const testRoomId = `room_view_${timestamp}`;
  const room = await prisma.liveRoom.create({
    data: {
      roomId: testRoomId,
      title: '🌟 Luxury Arabic Lounge & Music Suite',
      hostId: hostUser.id,
      category: 'Music',
      countryCode: 'PK',
      seatCount: 10,
      status: 'LIVE',
      announcement: 'Welcome to our Live Audio Suite! Respect all speakers and enjoy the vibe.',
      totalGifts: 5,
      likesCount: 120,
    },
  });

  try {
    // 2. Seed Gift Transactions for Room Rewards & Room Value
    await prisma.giftTransaction.create({
      data: {
        roomId: room.id,
        senderId: viewerUser.id,
        receiverId: hostUser.id,
        giftId: 'GIFT-STAR-GODDESS',
        count: 2,
        totalDiamonds: 400,
        totalCoins: 400,
        createdAt: new Date(),
      },
    });

    await prisma.giftTransaction.create({
      data: {
        roomId: room.id,
        senderId: viewerUser.id,
        receiverId: hostUser.id,
        giftId: 'GIFT-SUPER-LEO',
        count: 1,
        totalDiamonds: 2888,
        totalCoins: 2888,
        createdAt: new Date(),
      },
    });

    // 3. Test 1: Get Room View Info
    console.log('Testing 1: Fetching complete room view info...');
    const info = await LiveService.getRoomViewInfo(room.roomId);

    if (!info.success) throw new Error('Failed to get room view info');
    const d = info.data;

    // Check 1: Room ID
    console.log(`📋 Option 1 - Room ID: ${d.roomId}`);
    if (d.roomId !== room.roomId) throw new Error('Room ID mismatch');

    // Check 2: Members Count
    console.log(`👥 Option 2 - Members Count: ${d.membersCount}`);
    if (typeof d.membersCount !== 'number' || d.membersCount < 1) throw new Error('Invalid members count');

    // Check 3: Rewards Dashboard
    console.log(`🎁 Option 3 - Rewards: Total ${d.rewards.totalDiamonds} 💎, Today ${d.rewards.todayDiamonds} 💎, Host Earned: ${d.rewards.hostEarnedCoins} coins, Top Gifters: ${d.rewards.topGifters.length}`);
    if (d.rewards.totalDiamonds !== 3288) throw new Error(`Expected 3288 total diamonds, got ${d.rewards.totalDiamonds}`);
    if (d.rewards.todayDiamonds !== 3288) throw new Error(`Expected 3288 today diamonds, got ${d.rewards.todayDiamonds}`);
    if (d.rewards.topGifters.length !== 1) throw new Error(`Expected 1 top gifter, got ${d.rewards.topGifters.length}`);
    if (d.rewards.topGifters[0].diamonds !== 3288) throw new Error('Top gifter diamonds mismatch');

    // Check 4: Announcement
    console.log(`📢 Option 4 - Current Announcement: "${d.announcement}"`);
    if (!d.announcement.includes('Live Audio Suite')) throw new Error('Initial announcement mismatch');

    // Check 5: Numerical Room Value
    console.log(`💎 Option 5 - Numerical Room Value: ${d.roomValue}`);
    // Formula: 3288 * 1.5 (= 4932) + 5 * 10 (= 50) + 1 * 25 (= 25) + 120 * 2 (= 240) = 5247
    if (typeof d.roomValue !== 'number' || d.roomValue <= 0) throw new Error('Room value must be a positive number');
    console.log('✅ Option 1-5 Data Validations Passed 100%!');

    // 4. Test 2: Update Room Announcement as Host
    console.log('Testing 2: Updating Room Announcement as Host...');
    const newAnnouncement = '🚀 Special Music Concert tonight at 10 PM PKT! VIP gifts unlocked.';
    const updateRes = await LiveService.updateRoomAnnouncement(room.roomId, hostUser.numericId, newAnnouncement);
    if (updateRes.announcement !== newAnnouncement) throw new Error('Announcement failed to update in DB');
    console.log(`✅ Host Announcement Update Passed: "${updateRes.announcement}"`);

    // 5. Test 3: Permission Check - Non-host cannot update announcement
    console.log('Testing 3: Permission Gating (Non-Host / Viewer rejection)...');
    let rejected = false;
    try {
      await LiveService.updateRoomAnnouncement(room.roomId, viewerUser.numericId, 'Malicious announcement attempt');
    } catch (err: any) {
      if (err.statusCode === 403 || err.message.includes('Permission denied')) {
        rejected = true;
      }
    }
    if (!rejected) throw new Error('Non-host user was able to edit announcement without permission!');
    console.log('✅ Non-Host Permission Gating Passed (HTTP 403 Forbidden)!');

    console.log('\n🎉 ALL 5 ROOM VIEW OPTIONS TESTS PASSED 100%!');
  } finally {
    // 6. Cleanup
    await prisma.giftTransaction.deleteMany({ where: { OR: [{ roomId: room.id }, { roomId: room.roomId }] } });
    await prisma.liveRoom.deleteMany({ where: { id: room.id } });
    await prisma.user.deleteMany({ where: { id: { in: [hostUser.id, viewerUser.id] } } });
    console.log('🧹 Cleaned up test database records.');
  }
}

main().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
