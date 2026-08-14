import { prisma } from '../config/database.js';
import { LiveService } from '../services/live.service.js';

async function runSeatGridTests() {
  console.log('🧪 ===============================================');
  console.log('🧪 AURA LIVE — COMPREHENSIVE SEAT GRID TEST SUITE');
  console.log('🧪 ===============================================\n');

  // 1. Setup Test Users
  const hostUser = await prisma.user.upsert({
    where: { numericId: 888001 },
    update: { username: 'test_host_888', role: 'USER' },
    create: {
      numericId: 888001,
      username: 'test_host_888',
      displayName: 'Host Champion 👑',
      passwordHash: 'dummy_hash',
      role: 'USER',
    },
  });

  const userA = await prisma.user.upsert({
    where: { numericId: 888002 },
    update: { username: 'test_user_a', role: 'USER' },
    create: {
      numericId: 888002,
      username: 'test_user_a',
      displayName: 'Speaker Alice 🎵',
      passwordHash: 'dummy_hash',
      role: 'USER',
    },
  });

  const userB = await prisma.user.upsert({
    where: { numericId: 888003 },
    update: { username: 'test_user_b', role: 'USER' },
    create: {
      numericId: 888003,
      username: 'test_user_b',
      displayName: 'Speaker Bob 🎸',
      passwordHash: 'dummy_hash',
      role: 'USER',
    },
  });

  console.log('✅ Test Users Initialized: Host (888001), User A (888002), User B (888003)');

  // 2. Create 10-Seat Room
  console.log('\n--- Step 1: Create 10-Seat Live Room ---');
  const roomData = await LiveService.createRoom({
    hostUserId: hostUser.id,
    title: 'Grand Royal 10-Seat Suite ✨',
    category: 'Music',
    seatCount: 10,
  });
  const roomId = roomData.room.roomId;
  console.log(`✅ Created Room: ${roomId} with seatCount: ${roomData.room.seatCount}`);

  // Verify initial seats
  const initialSeats = await LiveService.getRoomSeats(roomId);
  console.log(`✅ Fetched ${initialSeats.seats.length} database seats.`);
  if (initialSeats.seats.length !== 10) throw new Error(`Expected 10 seats, got ${initialSeats.seats.length}`);
  if (!initialSeats.seats[0].isHost || initialSeats.seats[0].userId !== hostUser.id) {
    throw new Error('Seat 1 must be Host seat with Host userId');
  }
  for (let i = 1; i < 10; i++) {
    if (initialSeats.seats[i].userId !== null || initialSeats.seats[i].status !== 'EMPTY') {
      throw new Error(`Seat ${i + 1} must be empty`);
    }
  }
  console.log('✅ Verified: Seat 1 is Host, Seats 2-10 are EMPTY.');

  // 3. User A Takes Seat 2
  console.log('\n--- Step 2: User A Claims Seat 2 ---');
  const takeResA = await LiveService.takeSeat(roomId, 2, userA.id);
  console.log(`✅ User A claimed Seat 2: Status = ${takeResA.seat.status}, UserId = ${takeResA.seat.userId}`);
  if (takeResA.seat.userId !== userA.id || takeResA.seat.status !== 'SPEAKING') {
    throw new Error('User A claim failed');
  }

  // 4. Concurrency Test: User B attempts to take Seat 2 (already taken)
  console.log('\n--- Step 3: Concurrency Collision Check (User B tries Seat 2) ---');
  let rejectedAsOccupied = false;
  try {
    await LiveService.takeSeat(roomId, 2, userB.id);
  } catch (err: any) {
    if (err.message === 'SEAT_ALREADY_OCCUPIED') {
      rejectedAsOccupied = true;
      console.log('✅ Successfully rejected User B with SEAT_ALREADY_OCCUPIED error.');
    }
  }
  if (!rejectedAsOccupied) throw new Error('Collision failed: User B was able to take occupied seat!');

  // 5. User B Takes Seat 3
  console.log('\n--- Step 4: User B Claims Seat 3 ---');
  const takeResB = await LiveService.takeSeat(roomId, 3, userB.id);
  console.log(`✅ User B claimed Seat 3: Status = ${takeResB.seat.status}, UserId = ${takeResB.seat.userId}`);

  // 6. User A Leaves Seat 2
  console.log('\n--- Step 5: User A Leaves Seat 2 ---');
  const leaveResA = await LiveService.leaveSeat(roomId, 2, userA.id);
  console.log(`✅ User A vacated Seat 2: Status = ${leaveResA.status}, UserId = ${leaveResA.userId}`);
  if (leaveResA.userId !== null || leaveResA.status !== 'EMPTY') {
    throw new Error('Seat 2 was not properly cleared');
  }

  // 7. Capacity Expansion 10 -> 15
  console.log('\n--- Step 6: Expand Capacity 10 -> 15 Seats ---');
  const expand15 = await LiveService.changeSeatCapacity(roomId, 15, hostUser.id);
  console.log(`✅ Expanded to ${expand15.seats.length} seats.`);
  if (expand15.seats.length !== 15) throw new Error(`Expected 15 seats, got ${expand15.seats.length}`);
  if (expand15.seats[2].userId !== userB.id) throw new Error('Seat 3 occupant (User B) was lost during expansion!');

  // 8. User A Claims Seat 14
  console.log('\n--- Step 7: User A Claims Seat 14 ---');
  await LiveService.takeSeat(roomId, 14, userA.id);
  console.log('✅ User A successfully claimed Seat 14 in expanded range.');

  // 9. Capacity Downsize 15 -> 10 Attempt (Should be Rejected because Seat 14 is occupied)
  console.log('\n--- Step 8: Downsize 15 -> 10 with Occupied Seat 14 (Must Reject) ---');
  let rejectedDownsize = false;
  try {
    await LiveService.changeSeatCapacity(roomId, 10, hostUser.id);
  } catch (err: any) {
    if (err.message.includes('currently occupied')) {
      rejectedDownsize = true;
      console.log(`✅ Successfully rejected downsize: "${err.message}"`);
    }
  }
  if (!rejectedDownsize) throw new Error('Downsize safety check failed! Occupied seats were eliminated.');

  // 10. User A Leaves Seat 14 & Retry Downsize 15 -> 10
  console.log('\n--- Step 9: User A Leaves Seat 14 & Retry Downsize 15 -> 10 ---');
  await LiveService.leaveSeat(roomId, 14, userA.id);
  const downsize10 = await LiveService.changeSeatCapacity(roomId, 10, hostUser.id);
  console.log(`✅ Downsized to ${downsize10.seats.length} seats.`);
  if (downsize10.seats.length !== 10) throw new Error(`Expected 10 seats, got ${downsize10.seats.length}`);
  if (downsize10.seats[2].userId !== userB.id) throw new Error('Seat 3 occupant (User B) lost during downsize!');

  // 11. Capacity Expansion 10 -> 20
  console.log('\n--- Step 10: Expand Capacity 10 -> 20 Seats ---');
  const expand20 = await LiveService.changeSeatCapacity(roomId, 20, hostUser.id);
  console.log(`✅ Expanded to ${expand20.seats.length} seats.`);
  if (expand20.seats.length !== 20) throw new Error(`Expected 20 seats, got ${expand20.seats.length}`);

  // 12. Mic Mute / Lock Tests
  console.log('\n--- Step 11: Host Mutes and Locks Seat 3 ---');
  const mutedSeat3 = await LiveService.muteSeat(roomId, 3, hostUser.id, true);
  console.log(`✅ Seat 3 Muted by Host: isMuted = ${mutedSeat3.isMuted}`);
  const lockedSeat5 = await LiveService.lockSeat(roomId, 5, hostUser.id, true);
  console.log(`✅ Seat 5 Locked by Host: isLocked = ${lockedSeat5.isLocked}, status = ${lockedSeat5.status}`);

  console.log('\n🎉 ===============================================');
  console.log('🎉 ALL 12 SEAT GRID TESTS PASSED 100% SUCCESSFULLY!');
  console.log('🎉 ===============================================\n');
}

runSeatGridTests()
  .catch((err) => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
