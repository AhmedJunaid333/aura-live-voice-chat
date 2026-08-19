import { prisma } from '../config/database.js';
import { LiveService } from '../services/live.service.js';

async function main() {
  console.log('🎙️ Starting User Seat Options Test Suite...');

  const timestamp = Date.now();
  // 1. Create Test Host and Viewers
  const hostUser = await prisma.user.create({
    data: {
      numericId: Math.floor(900000 + Math.random() * 100000),
      username: `host_seat_${timestamp}`,
      displayName: `Host Seat ${timestamp}`,
      email: `host_seat_${timestamp}@auralive.io`,
      passwordHash: 'dummy_hash',
      role: 'USER',
      status: 'ACTIVE',
    },
  });

  const viewerUser1 = await prisma.user.create({
    data: {
      numericId: Math.floor(900000 + Math.random() * 100000),
      username: `viewer1_seat_${timestamp}`,
      displayName: `Viewer One ${timestamp}`,
      email: `viewer1_seat_${timestamp}@auralive.io`,
      passwordHash: 'dummy_hash',
      role: 'USER',
      status: 'ACTIVE',
    },
  });

  const viewerUser2 = await prisma.user.create({
    data: {
      numericId: Math.floor(900000 + Math.random() * 100000),
      username: `viewer2_seat_${timestamp}`,
      displayName: `Viewer Two ${timestamp}`,
      email: `viewer2_seat_${timestamp}@auralive.io`,
      passwordHash: 'dummy_hash',
      role: 'USER',
      status: 'ACTIVE',
    },
  });

  const testRoomId = `room_seats_${timestamp}`;
  const room = await prisma.liveRoom.create({
    data: {
      roomId: testRoomId,
      title: '🎙️ Live Seat Workflow Test Lounge',
      hostId: hostUser.id,
      category: 'Chat',
      countryCode: 'PK',
      seatCount: 10,
      status: 'LIVE',
    },
  });

  try {
    await LiveService.ensureRoomSeats(room.roomId, 10, hostUser.id);

    // -------------------------------------------------------------
    // Test 1: 🎙️ Move to Mic
    // -------------------------------------------------------------
    console.log('Testing 1: 🎙️ Move to Mic (Host moves Viewer 1 to Seat 1)...');
    const moveRes = await LiveService.moveUserToMic(room.roomId, hostUser.numericId, viewerUser1.numericId, 1);
    if (!moveRes.success) throw new Error('Move to mic failed');
    if (moveRes.seatNumber !== 1) throw new Error(`Expected seat 1, got ${moveRes.seatNumber}`);
    if (moveRes.seat.userId !== viewerUser1.id) throw new Error('Seat user ID mismatch');
    console.log(`✅ Move to Mic Passed: User ${viewerUser1.numericId} is now occupying Seat ${moveRes.seatNumber}!`);

    // -------------------------------------------------------------
    // Test 2: 🔇 Mute / 🔊 Unmute Mic
    // -------------------------------------------------------------
    console.log('Testing 2: 🔇 Mute / 🔊 Unmute Mic...');
    const muteRes = await LiveService.muteSeat(room.roomId, 1, hostUser.numericId, true);
    if (!muteRes.isMuted) throw new Error('Seat failed to mute');
    console.log('✅ Seat Muted successfully.');

    const unmuteRes = await LiveService.muteSeat(room.roomId, 1, hostUser.numericId, false);
    if (unmuteRes.isMuted) throw new Error('Seat failed to unmute');
    console.log('✅ Seat Unmuted successfully.');

    // -------------------------------------------------------------
    // Test 3: 🔒 Lock / 🔓 Unlock Mic
    // -------------------------------------------------------------
    console.log('Testing 3: 🔒 Lock / 🔓 Unlock Mic...');
    const lockRes = await LiveService.lockSeat(room.roomId, 2, hostUser.numericId, true);
    if (!lockRes.isLocked) throw new Error('Seat 2 failed to lock');
    console.log('✅ Seat 2 Locked successfully.');

    const unlockRes = await LiveService.lockSeat(room.roomId, 2, hostUser.numericId, false);
    if (unlockRes.isLocked) throw new Error('Seat 2 failed to unlock');
    console.log('✅ Seat 2 Unlocked successfully.');

    // -------------------------------------------------------------
    // Test 4: 📩 Invite to Mic
    // -------------------------------------------------------------
    console.log('Testing 4: 📩 Invite to Mic (Host invites Viewer 2)...');
    const inviteRes = await LiveService.inviteUserToMic(room.roomId, hostUser.numericId, viewerUser2.numericId);
    if (!inviteRes.success) throw new Error('Invite to mic failed');
    if (inviteRes.targetUser.numericId !== viewerUser2.numericId) throw new Error('Invited target mismatch');
    if (inviteRes.timeoutSeconds !== 20) throw new Error('Expected 20s timeout');
    console.log(`✅ Invite to Mic Passed: Sent invitation to User ${viewerUser2.numericId} (20s expiry)!`);

    // -------------------------------------------------------------
    // Test 5: 🛡️ Permission Check (Viewer cannot lock/mute/move seats)
    // -------------------------------------------------------------
    console.log('Testing 5: 🛡️ Permission Gating (Non-Host rejection)...');
    let rejectedLock = false;
    try {
      await LiveService.lockSeat(room.roomId, 3, viewerUser1.numericId, true);
    } catch (e: any) {
      if (e.statusCode === 403 || e.message.includes('Permission denied') || e.message.includes('Host')) {
        rejectedLock = true;
      }
    }
    if (!rejectedLock) throw new Error('Viewer was able to lock seat without permission!');

    let rejectedMove = false;
    try {
      await LiveService.moveUserToMic(room.roomId, viewerUser1.numericId, viewerUser2.numericId);
    } catch (e: any) {
      if (e.statusCode === 403 || e.message.includes('Permission denied')) {
        rejectedMove = true;
      }
    }
    if (!rejectedMove) throw new Error('Viewer was able to move user without permission!');
    console.log('✅ Non-Host Permission Gating Passed (HTTP 403 Forbidden)!');

    console.log('\n🎉 ALL 5 USER SEAT OPTIONS TESTS PASSED 100%!');
  } finally {
    // 6. Cleanup
    await prisma.liveRoomSeat.deleteMany({ where: { roomId: room.roomId } });
    await prisma.liveRoom.deleteMany({ where: { id: room.id } });
    await prisma.user.deleteMany({ where: { id: { in: [hostUser.id, viewerUser1.id, viewerUser2.id] } } });
    console.log('🧹 Cleaned up test database records.');
  }
}

main().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
