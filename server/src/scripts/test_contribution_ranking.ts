import { prisma } from '../config/database.js';
import { UserService } from '../services/user.service.js';
import { GiftService } from '../services/gift.service.js';

async function main() {
  console.log('🏆 Starting Contribution Ranking Test Suite...');

  // 0. Ensure gift catalog is seeded
  await GiftService.seedGiftCatalog();
  console.log('✅ Seeded gift catalog into database');

  // 1. Create Test Host User
  const timestamp = Date.now();
  const hostUser = await prisma.user.create({
    data: {
      email: `test_host_${timestamp}@auralive.io`,
      username: `host_${timestamp}`,
      displayName: 'Queen Star',
      numericId: Math.floor(800000 + Math.random() * 99999),
      passwordHash: 'dummy_hash',
      diamonds: 1000,
      coins: 500,
    },
  });

  // 2. Create 3 Contributor Users
  const gifter1 = await prisma.user.create({
    data: {
      email: `test_gifter1_${timestamp}@auralive.io`,
      username: `gifter1_${timestamp}`,
      displayName: 'Mr Lucky (Top 1)',
      numericId: Math.floor(800000 + Math.random() * 99999),
      passwordHash: 'dummy_hash',
      diamonds: 50000,
      coins: 1000,
      level: 12,
    },
  });

  const gifter2 = await prisma.user.create({
    data: {
      email: `test_gifter2_${timestamp}@auralive.io`,
      username: `gifter2_${timestamp}`,
      displayName: 'Ahmed (Top 2)',
      numericId: Math.floor(800000 + Math.random() * 99999),
      passwordHash: 'dummy_hash',
      diamonds: 20000,
      coins: 500,
      level: 8,
    },
  });

  const gifter3 = await prisma.user.create({
    data: {
      email: `test_gifter3_${timestamp}@auralive.io`,
      username: `gifter3_${timestamp}`,
      displayName: 'Bilal (Top 3)',
      numericId: Math.floor(800000 + Math.random() * 99999),
      passwordHash: 'dummy_hash',
      diamonds: 10000,
      coins: 200,
      level: 4,
    },
  });

  // 3. Create a Live Room
  const testRoom = await prisma.liveRoom.create({
    data: {
      roomId: `room_contrib_${timestamp}`,
      title: 'Contribution Ranking Test Lounge',
      hostId: hostUser.id,
      status: 'LIVE',
    },
  });

  console.log(`✅ Created test host (${hostUser.numericId}), 3 gifters, and room (${testRoom.roomId})`);

  try {
    // 4. Seed Gift Transactions:
    // Gifter 1: sends 2x Star Goddess (400 💎) + 1x Super Leo (2888 💎) = 3288 💎 (Today)
    await prisma.giftTransaction.create({
      data: {
        roomId: testRoom.id,
        senderId: gifter1.id,
        receiverId: hostUser.id,
        giftId: 'GIFT-STAR-GODDESS',
        count: 2,
        totalDiamonds: 400,
        totalCoins: 280,
        createdAt: new Date(),
      },
    });

    await prisma.giftTransaction.create({
      data: {
        roomId: testRoom.id,
        senderId: gifter1.id,
        receiverId: hostUser.id,
        giftId: 'GIFT-SUPER-LEO',
        count: 1,
        totalDiamonds: 2888,
        totalCoins: 2020,
        createdAt: new Date(),
      },
    });

    // Gifter 2: sends 1x Picking stars (999 💎) (Today)
    await prisma.giftTransaction.create({
      data: {
        roomId: testRoom.id,
        senderId: gifter2.id,
        receiverId: hostUser.id,
        giftId: 'GIFT-PICKING-STARS',
        count: 1,
        totalDiamonds: 999,
        totalCoins: 700,
        createdAt: new Date(),
      },
    });

    // Gifter 3: sends 1x Trophy (500 💎) (5 days ago - within week & month)
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    await prisma.giftTransaction.create({
      data: {
        roomId: testRoom.id,
        senderId: gifter3.id,
        receiverId: hostUser.id,
        giftId: 'GIFT-TROPHY',
        count: 1,
        totalDiamonds: 500,
        totalCoins: 350,
        createdAt: fiveDaysAgo,
      },
    });

    console.log('✅ Seeded gift transactions for day, week, and month periods');

    // 5. Test Day Period Query (should only have Gifter 1 & Gifter 2)
    const dayRanking = await UserService.getContributionRanking({
      targetIdentifier: hostUser.numericId,
      period: 'day',
    });

    console.log(`📊 Day Period Results: ${dayRanking.rankings.length} gifters, Total: ${dayRanking.totalContribution} 💎`);
    if (dayRanking.rankings.length !== 2) {
      throw new Error(`Expected 2 gifters for 'day' period, got ${dayRanking.rankings.length}`);
    }
    if (dayRanking.rankings[0].userId !== gifter1.id || dayRanking.rankings[0].totalDiamonds !== 3288) {
      throw new Error(`Expected Gifter 1 as Rank 1 with 3288 diamonds, got ${JSON.stringify(dayRanking.rankings[0])}`);
    }
    if (dayRanking.rankings[1].userId !== gifter2.id || dayRanking.rankings[1].totalDiamonds !== 999) {
      throw new Error(`Expected Gifter 2 as Rank 2 with 999 diamonds, got ${JSON.stringify(dayRanking.rankings[1])}`);
    }
    console.log('✅ Day Period Ranking Passed!');

    // 6. Test Week Period Query (should include all 3 gifters)
    const weekRanking = await UserService.getContributionRanking({
      targetIdentifier: hostUser.numericId,
      period: 'week',
    });

    console.log(`📊 Week Period Results: ${weekRanking.rankings.length} gifters, Total: ${weekRanking.totalContribution} 💎`);
    if (weekRanking.rankings.length !== 3) {
      throw new Error(`Expected 3 gifters for 'week' period, got ${weekRanking.rankings.length}`);
    }
    if (weekRanking.rankings[2].userId !== gifter3.id || weekRanking.rankings[2].totalDiamonds !== 500) {
      throw new Error(`Expected Gifter 3 as Rank 3 with 500 diamonds, got ${JSON.stringify(weekRanking.rankings[2])}`);
    }
    console.log('✅ Week Period Ranking Passed!');

    // 7. Test Room Specific Query
    const roomRanking = await UserService.getContributionRanking({
      roomId: testRoom.roomId,
      period: 'week',
    });
    if (roomRanking.rankings.length !== 3) {
      throw new Error(`Expected 3 gifters for room ranking, got ${roomRanking.rankings.length}`);
    }
    console.log('✅ Live Room Specific Ranking Passed!');

    // 8. Test Empty State Handling ("No more data")
    const emptyUser = await prisma.user.create({
      data: {
        email: `test_empty_${timestamp}@auralive.io`,
        username: `empty_${timestamp}`,
        displayName: 'Empty Gifter Target',
        numericId: Math.floor(800000 + Math.random() * 99999),
        passwordHash: 'dummy_hash',
      },
    });

    const emptyRanking = await UserService.getContributionRanking({
      targetIdentifier: emptyUser.numericId,
      period: 'day',
    });

    if (emptyRanking.rankings.length !== 0 || emptyRanking.totalContribution !== 0) {
      throw new Error(`Expected empty rankings for user with no gifts, got ${JSON.stringify(emptyRanking)}`);
    }
    console.log('✅ Empty State ("No more data") Query Passed!');

    // Clean up empty user
    await prisma.user.delete({ where: { id: emptyUser.id } });

    console.log('\n🎉 ALL 8 CONTRIBUTION RANKING TESTS PASSED 100%!');
  } finally {
    // Clean up test data
    await prisma.giftTransaction.deleteMany({
      where: {
        OR: [
          { senderId: { in: [gifter1.id, gifter2.id, gifter3.id] } },
          { receiverId: hostUser.id },
        ],
      },
    });
    await prisma.liveRoom.deleteMany({ where: { id: testRoom.id } });
    await prisma.user.deleteMany({
      where: { id: { in: [hostUser.id, gifter1.id, gifter2.id, gifter3.id] } },
    });
    console.log('🧹 Cleaned up test database records.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Test failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
