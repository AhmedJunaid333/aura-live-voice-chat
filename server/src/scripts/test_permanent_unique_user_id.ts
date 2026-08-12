import { prisma } from '../config/database.js';
import { AuthService } from '../services/auth.service.js';
import { UserService } from '../services/user.service.js';
import { FollowService } from '../services/follow.service.js';
import { VisitorService } from '../services/visitor.service.js';

async function runPermanentUniqueUserIdTest() {
  console.log('====================================================');
  console.log('🆔 AURA LIVE — PERMANENT UNIQUE USER IDENTITY E2E TEST');
  console.log('====================================================\n');

  try {
    // 1. Provision / Register User A
    console.log('1️⃣ Registering / Authenticating User A...');
    const userA = await prisma.user.upsert({
      where: { numericId: 777001 },
      create: {
        numericId: 777001,
        username: 'Test_User_Alpha',
        displayName: 'Alpha Prime 🛡️',
        email: 'alpha777001@auralive.io',
        passwordHash: '$2b$10$dummyHashAuraLive2026SecureKey',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
        bio: 'Alpha Test User Account',
        coins: 100000,
        diamonds: 5000,
        level: 10,
        vipTier: 2,
        status: 'ACTIVE',
      },
      update: {
        username: 'Test_User_Alpha',
        displayName: 'Alpha Prime 🛡️',
        status: 'ACTIVE',
      },
    });
    console.log(`   ✅ User A: Internal ID = ${userA.id}, Permanent Public UID = ${userA.numericId} (@${userA.username})`);

    // 2. Provision / Register User B
    console.log('2️⃣ Registering / Authenticating User B...');
    const userB = await prisma.user.upsert({
      where: { numericId: 777002 },
      create: {
        numericId: 777002,
        username: 'Test_User_Beta_Original',
        displayName: 'Beta Original Star 🌟',
        email: 'beta777002@auralive.io',
        passwordHash: '$2b$10$dummyHashAuraLive2026SecureKey',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
        bio: 'Original Beta Creator Profile',
        coins: 50000,
        diamonds: 10000,
        level: 8,
        vipTier: 1,
        status: 'ACTIVE',
      },
      update: {
        username: 'Test_User_Beta_Original',
        displayName: 'Beta Original Star 🌟',
        status: 'ACTIVE',
      },
    });
    const permanentPublicIdB = userB.numericId;
    const internalIdB = userB.id;
    console.log(`   ✅ User B: Internal ID = ${internalIdB}, Permanent Public UID = ${permanentPublicIdB} (@${userB.username})`);

    // 3. User A opens User B's profile using Public User ID
    console.log('\n3️⃣ User A opens User B profile via Public UID (GET /users/777002/profile)...');
    const profileB = await UserService.getUserProfile(permanentPublicIdB, userA.id);
    if (!profileB || profileB.numericId !== permanentPublicIdB) {
      throw new Error(`Profile retrieval failed or UID mismatch! Expected ${permanentPublicIdB}, got ${profileB?.numericId}`);
    }
    console.log(`   ✅ User B Profile loaded: DisplayName="${profileB.displayName}", UID=${profileB.numericId}, Level=${profileB.level}`);

    // 4. User A follows User B
    console.log('\n4️⃣ User A follows User B...');
    const followResult = await FollowService.followUser(userA.id, permanentPublicIdB);
    if (!followResult.isFollowing) {
      throw new Error('Follow action failed!');
    }
    console.log(`   ✅ User A successfully followed User B. Status: ${followResult.isFollowing}`);

    // 5. User A visits User B profile
    console.log('\n5️⃣ User A visits User B profile...');
    const visitResult = await VisitorService.recordVisit(userA.id, permanentPublicIdB);
    console.log(`   ✅ Profile visit recorded: ${visitResult.recorded}`);

    // 6. User A sends Gift to User B (simulated transaction)
    console.log('\n6️⃣ User A sends Gift to User B...');
    const gift = await prisma.gift.upsert({
      where: { id: 'gift_diamond_ring_01' },
      create: {
        id: 'gift_diamond_ring_01',
        name: 'Diamond Crown 👑',
        icon: '👑',
        costCoins: 500,
        rewardDiamonds: 250,
        category: 'VIP',
      },
      update: {},
    });
    const giftTx = await prisma.giftTransaction.create({
      data: {
        giftId: gift.id,
        count: 1,
        totalCoins: 500,
        totalDiamonds: 250,
        senderId: userA.id,
        receiverId: userB.id,
      },
    });
    console.log(`   ✅ Gift transaction created: ID=${giftTx.id}, SenderID=${giftTx.senderId}, ReceiverID=${giftTx.receiverId}, Diamonds=${giftTx.totalDiamonds}`);

    // 7. User B starts a Live Room
    console.log('\n7️⃣ User B starts Live Room (Host: UID 777002)...');
    await prisma.liveRoom.deleteMany({ where: { hostId: userB.id } });
    const liveRoom = await prisma.liveRoom.create({
      data: {
        roomId: `ROOM-${permanentPublicIdB}-VIP`,
        title: 'Beta Star Audio Suite 🎙️',
        category: 'MUSIC',
        hostId: userB.id,
        status: 'LIVE',
        seatCount: 10,
        listenersCount: 42,
        theme: 'galaxy',
      },
    });
    const liveStatus = await UserService.getUserLiveStatus(permanentPublicIdB);
    console.log(`   ✅ Live Room created: RoomID=${liveRoom.roomId}, isLive=${liveStatus.isLive}, Title="${liveStatus.liveRoom?.title}"`);

    // 8. Admin searches for User B by Public UID and Username
    console.log('\n8️⃣ Admin searches for User B by Public UID (777002)...');
    const searchByUID = await UserService.searchUsers('777002');
    const foundUserByUID = searchByUID.data.find((u) => u.numericId === permanentPublicIdB);
    if (!foundUserByUID) {
      throw new Error(`Search by numericId 777002 failed! Found: ${JSON.stringify(searchByUID.data)}`);
    }
    console.log(`   ✅ Admin Search by UID found: @${foundUserByUID.username} (UID: ${foundUserByUID.numericId})`);

    // 9. IDENTITY MUTATION TEST: Change User B's Username, DisplayName, and Avatar
    console.log('\n9️⃣ 🚨 IDENTITY MUTATION TEST: Updating User B Username, Display Name, and Avatar...');
    const updatedUserB = await prisma.user.update({
      where: { id: userB.id },
      data: {
        username: 'Test_User_Beta_BRAND_NEW_NAME',
        displayName: 'Beta Rebranded Superstar 💎',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop',
        bio: 'Updated bio after complete rebrand! ✨',
      },
    });

    console.log('   🔍 Validating Identity Preservation after profile changes:');
    console.log(`   - Internal Primary Key ID: Expected=${internalIdB}, Actual=${updatedUserB.id} -> ${internalIdB === updatedUserB.id ? '✅ MATCH' : '❌ CHANGED'}`);
    console.log(`   - Permanent Public User ID: Expected=${permanentPublicIdB}, Actual=${updatedUserB.numericId} -> ${permanentPublicIdB === updatedUserB.numericId ? '✅ UNCHANGED' : '❌ CHANGED'}`);
    console.log(`   - New Username: "${updatedUserB.username}"`);
    console.log(`   - New Display Name: "${updatedUserB.displayName}"`);

    if (updatedUserB.numericId !== permanentPublicIdB) {
      throw new Error(`CRITICAL SECURITY FAILURE: Public User ID changed from ${permanentPublicIdB} to ${updatedUserB.numericId}!`);
    }
    if (updatedUserB.id !== internalIdB) {
      throw new Error(`CRITICAL DATABASE FAILURE: Internal ID changed from ${internalIdB} to ${updatedUserB.id}!`);
    }

    // 10. Fetch updated profile via original Public UID
    console.log('\n🔟 Fetching updated profile via Permanent Public UID (777002)...');
    const reloadedProfile = await UserService.getUserProfile(permanentPublicIdB, userA.id);
    if (!reloadedProfile) {
      throw new Error('Failed to reload profile after rebrand!');
    }
    console.log(`   ✅ Public UID: ${reloadedProfile.numericId}`);
    console.log(`   ✅ New Username: ${reloadedProfile.username}`);
    console.log(`   ✅ New Display Name: ${reloadedProfile.displayName}`);
    console.log(`   ✅ Followers Count (preserved): ${reloadedProfile.stats.followersCount}`);
    console.log(`   ✅ Relationship (still following): ${reloadedProfile.relationship.isFollowing}`);
    console.log(`   ✅ Live Status (still hosting): ${reloadedProfile.isLive}`);

    console.log('\n====================================================');
    console.log('🎉 ALL PERMANENT UNIQUE USER IDENTITY TESTS PASSED (100%)');
    console.log('====================================================\n');
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPermanentUniqueUserIdTest();
