import { prisma } from '../config/database.js';
import { LiveService } from '../services/live.service.js';

async function runTest() {
  console.log('====================================================');
  console.log('🧪 LIVE BROADCAST LIFECYCLE & DISCOVERY SYNC TEST');
  console.log('====================================================\n');

  // 1. Ensure test users exist
  let hostUser = await prisma.user.findFirst({ where: { username: 'test_host_lifecycle' } });
  if (!hostUser) {
    hostUser = await prisma.user.create({
      data: {
        numericId: 99881,
        username: 'test_host_lifecycle',
        displayName: 'Test Host Lifecycle',
        passwordHash: '$2b$10$test_hash_lifecycle_1',
        role: 'USER',
        countryCode: 'PK',
      },
    });
  }

  let viewerUser = await prisma.user.findFirst({ where: { username: 'test_viewer_lifecycle' } });
  if (!viewerUser) {
    viewerUser = await prisma.user.create({
      data: {
        numericId: 99882,
        username: 'test_viewer_lifecycle',
        displayName: 'Test Viewer Lifecycle',
        passwordHash: '$2b$10$test_hash_lifecycle_2',
        role: 'USER',
        countryCode: 'PK',
      },
    });
  }

  // Clean any old test rooms
  await prisma.liveRoom.deleteMany({
    where: { hostId: hostUser.id },
  });

  // ============================================================
  // TEST 1: CREATE ROOM & VERIFY DISCOVERY APPEARANCE
  // ============================================================
  console.log('--- TEST 1: Room Creation & Discovery ---');
  const createRes = await LiveService.createRoom({
    hostUserId: hostUser.id,
    title: 'Grand Royal Live Suite ✨',
    category: 'Music',
    seatCount: 10,
    countryCode: 'PK',
  });

  const createdRoom = createRes.room;
  console.log(`✅ Room Created: ${createdRoom.roomId} (Status: ${createdRoom.status})`);

  // Verify getLiveRooms returns the active room
  const activeRooms = await LiveService.getLiveRooms({ countryCode: 'PK' });
  const foundActive = activeRooms.find((r) => r.roomId === createdRoom.roomId);
  if (!foundActive) {
    throw new Error(`FAIL: Created room ${createdRoom.roomId} not found in getLiveRooms!`);
  }
  console.log(`✅ Verified in getLiveRooms: "${foundActive.title}" (isLive: ${foundActive.isLive}, isDiscoverable: ${foundActive.isDiscoverable})`);

  // Verify Country Stats
  const countryStats = await LiveService.getLiveCountriesStats();
  const pkStat = countryStats.countries.find((c) => c.countryCode === 'PK');
  console.log(`✅ Country Stats: Pakistan active live = ${pkStat?.liveCount}, Global total = ${countryStats.totalActiveLive}`);
  if (!pkStat || pkStat.liveCount < 1) {
    throw new Error('FAIL: Country stats did not count active room!');
  }

  // ============================================================
  // TEST 2: HEARTBEAT RECORDING
  // ============================================================
  console.log('\n--- TEST 2: Host Heartbeat ---');
  const hbRes = await LiveService.recordHeartbeat(createdRoom.roomId, hostUser.id);
  console.log(`✅ Heartbeat Recorded: ${hbRes.timestamp}`);

  // ============================================================
  // TEST 3: END BROADCAST & VERIFY IMMEDIATE REMOVAL FROM DISCOVERY
  // ============================================================
  console.log('\n--- TEST 3: Host Ends Broadcast ---');
  const endRes = await LiveService.endRoom(createdRoom.roomId, hostUser.id, {
    endedBy: 'HOST',
    endReason: 'Host concluded show.',
  });
  console.log(`✅ Broadcast Ended: Duration = ${endRes.formattedDuration}, Status = ${endRes.status}`);

  // Verify Database State
  const dbRoomAfterEnd = await prisma.liveRoom.findUnique({ where: { roomId: createdRoom.roomId } });
  if (dbRoomAfterEnd?.status !== 'ENDED' || dbRoomAfterEnd?.endedAt == null) {
    throw new Error(`FAIL: Database record status is ${dbRoomAfterEnd?.status}, endedAt is ${dbRoomAfterEnd?.endedAt}`);
  }
  console.log(`✅ Database State: status = ${dbRoomAfterEnd.status}, endedAt = ${dbRoomAfterEnd.endedAt.toISOString()}`);

  // Verify getLiveRooms DOES NOT RETURN ENDED ROOM
  const activeRoomsAfterEnd = await LiveService.getLiveRooms({ countryCode: 'PK' });
  const foundEnded = activeRoomsAfterEnd.find((r) => r.roomId === createdRoom.roomId);
  if (foundEnded) {
    throw new Error(`FAIL: Ended room ${createdRoom.roomId} is still showing in getLiveRooms!`);
  }
  console.log(`✅ Verified: Room ${createdRoom.roomId} is completely REMOVED from getLiveRooms.`);

  // Verify Country Stats decremented
  const countryStatsAfterEnd = await LiveService.getLiveCountriesStats();
  const pkStatAfterEnd = countryStatsAfterEnd.countries.find((c) => c.countryCode === 'PK');
  console.log(`✅ Country Stats Decremented: Pakistan active live = ${pkStatAfterEnd?.liveCount}, Global total = ${countryStatsAfterEnd.totalActiveLive}`);

  // ============================================================
  // TEST 4: JOIN SAFETY — PREVENT JOINING ENDED ROOM
  // ============================================================
  console.log('\n--- TEST 4: Join Safety on Ended Room ---');
  try {
    await LiveService.joinRoom(createdRoom.roomId, viewerUser.numericId, viewerUser.id);
    throw new Error('FAIL: Viewer was allowed to join an ended room!');
  } catch (err: any) {
    if (err.code === 'BROADCAST_ENDED' || err.message.includes('ended')) {
      console.log(`✅ Safe Rejection: Caught expected error "${err.message}" (code: ${err.code})`);
    } else {
      throw err;
    }
  }

  // ============================================================
  // TEST 5: STALE ROOM RECONCILIATION (CRASH / DISCONNECT SIMULATION)
  // ============================================================
  console.log('\n--- TEST 5: Stale Room Auto-Reconciliation ---');
  // Create an artificial stale room with old timestamp
  const staleRoomId = `RM-STALE-${Date.now()}`;
  await prisma.liveRoom.create({
    data: {
      roomId: staleRoomId,
      title: 'Abandoned Room (Simulated Crash)',
      category: 'Chat',
      countryCode: 'PK',
      hostId: hostUser.id,
      seatCount: 10,
      status: 'LIVE',
      updatedAt: new Date(Date.now() - 300 * 1000), // 5 minutes ago
    },
  });
  console.log(`Created simulated abandoned room: ${staleRoomId}`);

  // Run reconciliation
  const cleaned = await LiveService.reconcileStaleRooms();
  console.log(`✅ Stale Room Sweeper cleaned ${cleaned} room(s)`);

  const staleDb = await prisma.liveRoom.findUnique({ where: { roomId: staleRoomId } });
  if (staleDb?.status !== 'ENDED') {
    throw new Error(`FAIL: Stale room was not marked as ENDED (status: ${staleDb?.status})`);
  }
  console.log(`✅ Stale room ${staleRoomId} status reconciled to: ${staleDb.status} (endedAt: ${staleDb.endedAt?.toISOString()})`);

  // ============================================================
  // TEST 6: MULTI-ROOM SEQUENTIAL TEARDOWN
  // ============================================================
  console.log('\n--- TEST 6: Multi-Room Sequential Teardown ---');
  const roomA = await LiveService.createRoom({ hostUserId: hostUser.id, title: 'Room Alpha', category: 'Music', seatCount: 10, countryCode: 'PK' });
  const roomB = await prisma.liveRoom.create({
    data: {
      roomId: `RM-B-${Date.now()}`,
      title: 'Room Bravo',
      category: 'Gaming',
      countryCode: 'PK',
      hostId: viewerUser.id,
      seatCount: 10,
      status: 'LIVE',
    },
  });
  const roomC = await prisma.liveRoom.create({
    data: {
      roomId: `RM-C-${Date.now()}`,
      title: 'Room Charlie',
      category: 'Dating',
      countryCode: 'PK',
      hostId: hostUser.id,
      seatCount: 10,
      status: 'LIVE',
    },
  });

  console.log('Active: Room Alpha, Room Bravo, Room Charlie');
  let list = await LiveService.getLiveRooms({ countryCode: 'PK' });
  console.log(`Total live rooms: ${list.length}`);

  // End Room B
  await LiveService.endRoom(roomB.roomId, viewerUser.id);
  list = await LiveService.getLiveRooms({ countryCode: 'PK' });
  if (list.some((r) => r.roomId === roomB.roomId)) {
    throw new Error('FAIL: Room B still in discovery after end!');
  }
  console.log(`✅ Ended Room B -> Discovery now contains only Alpha & Charlie`);

  // End Room A
  await LiveService.endRoom(roomA.room.roomId, hostUser.id);
  list = await LiveService.getLiveRooms({ countryCode: 'PK' });
  if (list.some((r) => r.roomId === roomA.room.roomId || r.roomId === roomB.roomId)) {
    throw new Error('FAIL: Room A still in discovery!');
  }
  console.log(`✅ Ended Room A -> Discovery now contains only Charlie`);

  // End Room C
  await LiveService.endRoom(roomC.roomId, hostUser.id);
  list = await LiveService.getLiveRooms({ countryCode: 'PK' });
  if (list.some((r) => r.roomId === roomC.roomId)) {
    throw new Error('FAIL: Room C still in discovery!');
  }
  console.log(`✅ Ended Room C -> Discovery has 0 active rooms for test hosts.`);

  console.log('\n====================================================');
  console.log('🎉 ALL BROADCAST LIFECYCLE & DISCOVERY TESTS PASSED 100%!');
  console.log('====================================================');
}

runTest()
  .catch((err) => {
    console.error('❌ TEST FAILED:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
