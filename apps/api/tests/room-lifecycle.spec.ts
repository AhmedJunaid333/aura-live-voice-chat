import { LiveController } from '../src/controllers/live.controller.js';
import { RtcController } from '../src/controllers/rtc.controller.js';
import { SeatController } from '../src/controllers/seat.controller.js';
import { GiftController } from '../src/controllers/gift.controller.js';

async function runRoomLifecycleTests() {
  console.log('🧪 Starting Test: Full Room Lifecycle & Integration...');

  const live = new LiveController();
  const rtc = new RtcController();
  const seat = new SeatController();
  const gift = new GiftController();

  // Step 1: Create Room
  const createRes = await live.createRoom('u-host-88', {
    title: '🎉 Friday Night Voice Party',
    category: 'Entertainment',
    maxSeats: 9
  });
  console.assert(createRes.success === true, 'Room creation failed');
  const roomId = createRes.data.room.id;
  console.log(`  ✅ Room Created: ${roomId} (RTC Token generated)`);

  // Step 2: RTC Token Fetch
  const tokenRes = await rtc.generateToken({
    channelId: createRes.data.room.rtcChannelId,
    userId: 'u-audience-1',
    role: 'AUDIENCE'
  });
  console.assert(tokenRes.success === true, 'RTC Token generation failed');
  console.log('  ✅ Audience RTC Token issued');

  // Step 3: Audience Joins Room
  const joinRes = await live.joinRoom('u-audience-1', { roomId });
  console.assert(joinRes.success === true, 'Room join failed');
  console.log('  ✅ Audience Joined Room');

  // Step 4: Seat Request & Approval
  const seatReq = await seat.requestSeat('u-audience-1', { roomId, targetSeatIndex: 2 });
  console.assert(seatReq.success === true, 'Seat request failed');

  const seatApprove = await seat.approveSeat('u-host-88', {
    roomId,
    requestId: seatReq.requestId,
    userId: 'u-audience-1',
    seatIndex: 2,
    approve: true
  });
  console.assert(seatApprove.success === true, 'Seat approval failed');
  console.log('  ✅ Seat requested and approved by host');

  // Step 5: Send Gift
  const giftRes = await gift.sendGift('u-audience-1', {
    roomId,
    receiverId: 'u-host-88',
    giftId: 'g-1',
    giftCount: 5
  });
  console.assert(giftRes.success === true, 'Gift sending failed');
  console.log('  ✅ Gift sent & broadcasted');

  // Step 6: Leave & End Room
  const leaveRes = await live.leaveRoom('u-audience-1', roomId);
  console.assert(leaveRes.success === true, 'Leave room failed');

  console.log('✅ Room Lifecycle & Integration Tests PASSED!\n');
}

runRoomLifecycleTests().catch(console.error);
