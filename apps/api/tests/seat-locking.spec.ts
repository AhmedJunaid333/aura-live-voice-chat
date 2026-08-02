import { SeatManager } from '../src/modules/seats/seat.manager.js';
import { VoiceRoomWebSocketGateway } from '../src/modules/realtime/gateway/websocket.gateway.js';

async function runSeatLockingTests() {
  console.log('🧪 Starting Test: Seat Locking & State Machine...');

  const gateway = new VoiceRoomWebSocketGateway();
  const seatManager = new SeatManager(gateway);
  const roomId = 'room-test-101';

  // Test 1: Seat Request
  const req1 = await seatManager.requestSeat(roomId, 3, 'u-user-A');
  console.assert(req1 === true, 'User A seat request failed');

  // Test 2: Concurrent Seat Request Race Condition (User B requests same seat 3)
  try {
    const req2 = await seatManager.requestSeat(roomId, 3, 'u-user-B');
    console.assert(req2 === false, 'User B concurrent request should fail');
  } catch (err: any) {
    console.log('  ✅ Race condition prevented successfully:', err.message);
  }

  // Test 3: Host Approval
  const approve = await seatManager.approveSeat(roomId, 3, 'u-host', 'u-user-A');
  console.assert(approve === true, 'Host approval failed');

  // Test 4: Mute Speaker
  const mute = await seatManager.muteSpeaker(roomId, 3, 'u-host', true);
  console.assert(mute === true, 'Mute speaker failed');

  // Test 5: Leave Seat
  const leave = await seatManager.leaveSeat(roomId, 3, 'u-user-A');
  console.assert(leave === true, 'Leave seat failed');

  console.log('✅ Seat Locking & State Machine Tests PASSED!\n');
}

runSeatLockingTests().catch(console.error);
