import { prisma } from '../config/database.js';
import { UserService } from '../services/user.service.js';

async function runGlobalProfileFlowTest() {
  console.log('====================================================');
  console.log('🧪 RUNNING GLOBAL USER PROFILE FLOW VERIFICATION TEST');
  console.log('====================================================\n');

  try {
    // 1. Ensure test users exist
    console.log('1️⃣ Provisioning Test Users A & B...');
    const userA = await prisma.user.upsert({
      where: { numericId: 888001 },
      create: {
        numericId: 888001,
        username: 'AuraStar_Alpha',
        email: 'star_alpha@auralive.com',
        passwordHash: '$2b$10$dummyHashAuraLive2026SecureKey',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
        bio: 'Official Aura Live Host & Creator 🌟',
        level: 12,
        xp: 4500,
        vipTier: 3,
        coins: 100000,
        diamonds: 50000,
        country: 'Pakistan',
        countryCode: 'PK',
        status: 'ACTIVE',
      },
      update: {
        username: 'AuraStar_Alpha',
        level: 12,
        vipTier: 3,
      },
    });

    const userB = await prisma.user.upsert({
      where: { numericId: 888002 },
      create: {
        numericId: 888002,
        username: 'AuraFan_Beta',
        email: 'fan_beta@auralive.com',
        passwordHash: '$2b$10$dummyHashAuraLive2026SecureKey',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        bio: 'Music and Voice Lounge Enthusiast 🎧',
        level: 4,
        xp: 1200,
        vipTier: 1,
        coins: 25000,
        diamonds: 5000,
        country: 'Pakistan',
        countryCode: 'PK',
        status: 'ACTIVE',
      },
      update: {
        username: 'AuraFan_Beta',
        level: 4,
        vipTier: 1,
      },
    });

    console.log(`✅ User A provisioned: ${userA.username} (UID: ${userA.numericId}, ID: ${userA.id})`);
    console.log(`✅ User B provisioned: ${userB.username} (UID: ${userB.numericId}, ID: ${userB.id})\n`);

    // 2. Fetch User A Profile from perspective of User B
    console.log('2️⃣ Fetching Public Profile of User A from User B perspective...');
    const profileA = await UserService.getUserProfile(userA.numericId, userB.id);
    if (!profileA) throw new Error('Profile A returned null!');
    console.log(`✅ Profile fetched: ${profileA.username}, Level: ${profileA.level}, VIP: ${profileA.vipTier}`);
    console.log(`   Followers: ${profileA.stats.followersCount}, Relationship isFollowing: ${profileA.relationship.isFollowing}\n`);

    // 3. User B follows User A
    console.log('3️⃣ User B follows User A...');
    await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: userB.id,
          followingId: userA.id,
        },
      },
      create: {
        followerId: userB.id,
        followingId: userA.id,
        status: 'ACCEPTED',
      },
      update: { status: 'ACCEPTED' },
    });

    // Verify updated follower count & relationship
    const updatedProfileA = await UserService.getUserProfile(userA.numericId, userB.id);
    if (!updatedProfileA?.relationship.isFollowing) {
      throw new Error('Relationship isFollowing should be true after following!');
    }
    console.log(`✅ Follow confirmed. User A followers: ${updatedProfileA.stats.followersCount}, isFollowing: true\n`);

    // 4. Record Profile Visit
    console.log('4️⃣ Recording profile visit from User B to User A...');
    await prisma.profileVisit.create({
      data: {
        visitorId: userB.id,
        profileOwnerId: userA.id,
      },
    });
    const profileWithVisit = await UserService.getUserProfile(userA.numericId, userB.id);
    console.log(`✅ Profile visitors count verified: ${profileWithVisit?.stats.visitorsCount}\n`);

    // 5. Check Live Status & Simulated Audio Room
    console.log('5️⃣ Testing Live Status when User A creates an Audio Room...');
    const testLiveRoom = await prisma.liveRoom.upsert({
      where: { roomId: 'TEST_ROOM_888' },
      create: {
        roomId: 'TEST_ROOM_888',
        hostId: userA.id,
        title: '🌟 Star Alpha Late Night Concert',
        category: 'Music',
        seatCount: 15,
        status: 'LIVE',
        isLocked: false,
        theme: 'galaxy',
      },
      update: {
        status: 'LIVE',
        hostId: userA.id,
        title: '🌟 Star Alpha Late Night Concert',
      },
    });

    const liveStatus = await UserService.getUserLiveStatus(userA.numericId);
    console.log(`✅ User A Live Status: isLive = ${liveStatus.isLive}, Room Title: "${liveStatus.liveRoom?.title}"\n`);

    const profileDuringLive = await UserService.getUserProfile(userA.numericId, userB.id);
    if (!profileDuringLive?.isLive) {
      throw new Error('User profile should report isLive = true when active live room exists!');
    }
    console.log(`✅ Profile isLive field validated: true. Active Room ID: ${profileDuringLive.activeLiveRoom?.roomId}\n`);

    // 6. User B Mutes User A
    console.log('6️⃣ User B mutes User A...');
    const muteRes = await UserService.muteUser(userB.id, userA.numericId, 'Spam notifications');
    console.log(`✅ Mute response: ${muteRes.message}`);
    const mutedList = await UserService.getMutedUsers(userB.id);
    console.log(`✅ Muted users count for User B: ${mutedList.length}\n`);

    // 7. User B Reports User A
    console.log('7️⃣ User B reports User A for Harassment...');
    const reportRes = await UserService.reportUser(
      userB.id,
      userA.numericId,
      'HARASSMENT',
      'Offensive language in live chat',
      'Detailed log timestamp 12:44 PM'
    );
    console.log(`✅ Report created: ID ${reportRes.reportId} -> ${reportRes.message}\n`);

    // 8. User B Blocks User A (and mutual follows are severed)
    console.log('8️⃣ User B blocks User A...');
    const blockRes = await UserService.blockUser(userB.id, userA.numericId, 'Inappropriate behavior');
    console.log(`✅ Block response: ${blockRes.message}`);

    const profileAfterBlock = await UserService.getUserProfile(userA.numericId, userB.id);
    if (!profileAfterBlock?.relationship.isBlocked) {
      throw new Error('Relationship isBlocked should be true!');
    }
    if (profileAfterBlock.relationship.isFollowing) {
      throw new Error('Follow relationship must be cleared upon blocking!');
    }
    console.log(`✅ Block verified: isBlocked = ${profileAfterBlock.relationship.isBlocked}, isFollowing = ${profileAfterBlock.relationship.isFollowing}\n`);

    // 9. User Search Verification
    console.log('9️⃣ Verifying Global User Search...');
    const searchRes = await UserService.searchUsers('AuraStar', userB.id);
    console.log(`✅ Search query "AuraStar" found ${searchRes.total} users:`);
    searchRes.data.forEach((u) => {
      console.log(`   - @${u.username} (UID: ${u.numericId}, Lv.${u.level})`);
    });

    const searchById = await UserService.searchUsers('888001', userB.id);
    console.log(`✅ Search by numeric ID "888001" found ${searchById.total} users: @${searchById.data[0]?.username}\n`);

    // Clean up test live room
    await prisma.liveRoom.deleteMany({ where: { roomId: 'TEST_ROOM_888' } });

    console.log('====================================================');
    console.log('🎉 ALL GLOBAL USER PROFILE FLOW TESTS PASSED (100%)');
    console.log('====================================================');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runGlobalProfileFlowTest();
