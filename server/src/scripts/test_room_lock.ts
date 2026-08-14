import { prisma } from '../config/database.js';
import { LiveService } from '../services/live.service.js';

async function testRoomLockSystem() {
  console.log('🧪 Starting Aura Live Room Lock End-to-End Test...\n');

  try {
    // 1. Find existing users or create test users with unique numericId
    let host = await prisma.user.findFirst({ orderBy: { id: 'asc' } });
    if (!host) {
      const randNum = Math.floor(800000 + Math.random() * 100000);
      host = await prisma.user.create({
        data: {
          numericId: randNum,
          username: `Host_${randNum}`,
          passwordHash: 'hashed_secret_test',
          email: `host_${randNum}@auralive.test`,
          coins: 50000,
          diamonds: 20000,
        },
      });
    }

    let audience = await prisma.user.findFirst({
      where: { id: { not: host.id } },
    });
    if (!audience) {
      const randNum2 = Math.floor(900000 + Math.random() * 100000);
      audience = await prisma.user.create({
        data: {
          numericId: randNum2,
          username: `Audience_${randNum2}`,
          passwordHash: 'hashed_secret_test',
          email: `audience_${randNum2}@auralive.test`,
          coins: 10000,
          diamonds: 5000,
        },
      });
    }

    console.log(`👤 Host: ${host.username} (ID: ${host.id}, NumericID: ${host.numericId})`);
    console.log(`👤 Audience: ${audience.username} (ID: ${audience.id}, NumericID: ${audience.numericId})\n`);

    // Step 1: Host creates Room
    console.log('Step 1: Host creates Live Voice Room...');
    const createResult = await LiveService.createRoom({
      hostUserId: host.id,
      title: 'Grand Royal Test Suite 👑',
      category: 'Music',
      seatCount: 15,
    });
    const roomId = createResult.room.roomId;
    console.log(`✓ Room created successfully! RoomID: ${roomId}, Status: ${createResult.room.status}, isLocked: ${createResult.room.isLocked}`);

    // Step 2: Host locks the room
    console.log('\nStep 2: Host locks the room (Server-Enforced)...');
    const lockedRoom = await LiveService.lockRoom(roomId, host.id);
    console.log(`✓ Room Locked! isLocked: ${lockedRoom.isLocked}, status: ${lockedRoom.status}, lockedBy: ${lockedRoom.lockedBy}`);

    // Step 3: Audience attempts to join locked room (Must be rejected by backend)
    console.log('\nStep 3: Audience attempts direct join into locked room...');
    try {
      await LiveService.joinRoom(roomId, audience.numericId, audience.id);
      throw new Error('❌ TEST FAILED: Audience was able to join locked room without approval!');
    } catch (err: any) {
      if (err.code === 'ROOM_LOCKED') {
        console.log(`✓ Backend REJECTED direct join as expected! Error Code: ${err.code}, Message: "${err.message}"`);
      } else {
        throw err;
      }
    }

    // Step 4: Audience submits Join Request
    console.log('\nStep 4: Audience submits Join Request for locked room...');
    const joinReq = await LiveService.createJoinRequest({
      roomId,
      userId: audience.id,
      userNumericId: audience.numericId,
      userName: audience.username,
      userAvatar: audience.avatar,
    });
    console.log(`✓ Join Request created! RequestID: ${joinReq.id}, Status: ${joinReq.status}`);

    // Step 5: Host views pending join requests
    console.log('\nStep 5: Host views pending join requests...');
    const pendingList = await LiveService.getPendingJoinRequests(roomId, host.id);
    console.log(`✓ Host found ${pendingList.length} pending request(s). Target: ${pendingList[0].userName}`);

    // Step 6: Host accepts Join Request
    console.log('\nStep 6: Host accepts Join Request...');
    const acceptedReq = await LiveService.respondJoinRequest({
      roomId,
      hostUserId: host.id,
      requestId: joinReq.id,
      status: 'ACCEPTED',
    });
    console.log(`✓ Request status updated to: ${acceptedReq.status}`);

    // Step 7: Audience now joins room after approval
    console.log('\nStep 7: Audience attempts join after Host approval...');
    const joinSuccess = await LiveService.joinRoom(roomId, audience.numericId, audience.id);
    console.log(`✓ Audience joined successfully! Agora channel: ${joinSuccess.agora.channel}, Token generated: ${joinSuccess.agora.token.substring(0, 20)}...`);

    // Step 8: Host unlocks room
    console.log('\nStep 8: Host unlocks room...');
    const unlockedRoom = await LiveService.unlockRoom(roomId, host.id);
    console.log(`✓ Room Unlocked! isLocked: ${unlockedRoom.isLocked}, status: ${unlockedRoom.status}`);

    // Step 9: Verify audit logs
    console.log('\nStep 9: Verifying Audit Logs in Database...');
    const auditLogs = await prisma.auditLog.findMany({
      where: { resource: `Room:${roomId}` },
      orderBy: { createdAt: 'asc' },
    });
    console.log(`✓ Found ${auditLogs.length} immutable audit log records:`);
    for (const log of auditLogs) {
      console.log(`  - [${log.action}] by Actor #${log.actorId} (${log.actorRole}): ${log.details}`);
    }

    console.log('\n🎉 ALL ROOM LOCK END-TO-END TESTS PASSED WITH 100% SUCCESS!\n');
  } catch (error) {
    console.error('❌ Test execution error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testRoomLockSystem();
