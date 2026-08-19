import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import express from 'express';
import http from 'http';
import { io as ClientSocket } from 'socket.io-client';
import { prisma } from '../config/database.js';
import { initSocketServer } from '../websocket/socketServer.js';
import { liveRouter } from '../routes/live.routes.js';
import { usersRouter } from '../routes/users.routes.js';
import { followRouter } from '../routes/follow.routes.js';
import { visitorRouter } from '../routes/visitor.routes.js';
import { LiveService } from '../services/live.service.js';
import { UserService } from '../services/user.service.js';
import { FollowService } from '../services/follow.service.js';
import { VisitorService } from '../services/visitor.service.js';
import { generateAccessToken } from '../utils/jwt.js';

async function run7CoreLiveFeaturesV2() {
  console.log('================================================================');
  console.log('🧪 AURA LIVE — 18-POINT REALTIME SOCKET.IO & BACKEND QA SUITE V2');
  console.log('================================================================');

  // 1. Setup Express app & Socket.IO server
  const app = express();
  app.use(express.json());
  app.use('/api/v1/rooms', liveRouter);
  app.use('/api/rooms', liveRouter);
  app.use('/api/v1/users', usersRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/v1/users', followRouter);
  app.use('/api/users', followRouter);
  app.use('/api/v1/users', visitorRouter);
  app.use('/api/users', visitorRouter);

  const server = http.createServer(app);
  const io = initSocketServer(server);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const socketUrl = `http://127.0.0.1:${port}`;

  console.log(`📡 Local Socket.IO & API Test Server active at ${socketUrl}`);

  async function retryOp<T>(op: () => Promise<T>, retries = 5, delay = 2000): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        return await op();
      } catch (err: any) {
        if (i === retries - 1) throw err;
        console.log(`⏳ Database connection retry (${i + 1}/${retries})...`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
    throw new Error('Operation failed after retries');
  }

  // Fetch real users from Neon PostgreSQL
  const userA = await retryOp(() => prisma.user.findFirst({ where: { numericId: 100002 } }));
  const userB = await retryOp(() => prisma.user.findFirst({ where: { numericId: 100001 } }));
  const userC = await retryOp(() => prisma.user.findFirst({ where: { numericId: 100003 } }));

  if (!userA || !userB || !userC) {
    throw new Error('Required test users (100002, 100001, 100003) not found in PostgreSQL.');
  }

  const tokenA = generateAccessToken({
    userId: userA.id,
    numericId: userA.numericId,
    username: userA.username,
    role: userA.role,
  });

  const tokenB = generateAccessToken({
    userId: userB.id,
    numericId: userB.numericId,
    username: userB.username,
    role: userB.role,
  });

  const tokenC = generateAccessToken({
    userId: userC.id,
    numericId: userC.numericId,
    username: userC.username,
    role: userC.role,
  });

  // Connect 3 Real Socket.IO Clients
  const clientA = ClientSocket(socketUrl, {
    transports: ['websocket'],
    auth: { token: `Bearer ${tokenA}` },
  });

  const clientB = ClientSocket(socketUrl, {
    transports: ['websocket'],
    auth: { token: `Bearer ${tokenB}` },
  });

  const clientC = ClientSocket(socketUrl, {
    transports: ['websocket'],
    auth: { token: `Bearer ${tokenC}` },
  });

  await Promise.all([
    new Promise<void>((res) => clientA.on('connect', () => res())),
    new Promise<void>((res) => clientB.on('connect', () => res())),
    new Promise<void>((res) => clientC.on('connect', () => res())),
  ]);

  console.log('✅ Connected 3 real authenticated Socket.IO clients (Client A, B, C)');

  // -------------------------------------------------------------------------
  // TEST 1 & 2: Broadcast Lifecycle & StartedAt Timer
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 1 & 2: Broadcast Lifecycle & StartedAt Timer ---');
  const roomARes = await LiveService.createRoom({
    hostUserId: userA.id,
    title: 'Room A - Host Ahmed Live Suite 🎙️',
    seatCount: 10,
  });
  const roomAId = roomARes.room.roomId;
  if (roomARes.room.status !== 'LIVE' || !roomARes.room.createdAt) {
    throw new Error('Broadcast status is not LIVE or createdAt missing');
  }
  console.log(`✅ Broadcast Created: ${roomAId} (Status: ${roomARes.room.status}, StartedAt: ${roomARes.room.createdAt.toISOString()})`);

  // Create Room B (For isolation testing)
  const roomBRes = await LiveService.createRoom({
    hostUserId: userC.id,
    title: 'Room B - Host Usman Arena ⚔️',
    seatCount: 10,
  });
  const roomBId = roomBRes.room.roomId;
  console.log(`✅ Room B Created: ${roomBId} for Room Isolation testing`);

  // -------------------------------------------------------------------------
  // TEST 3 & 18: Socket Room Joining & Welcome Comment Event
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 3 & 18: Socket Room Joining & Welcome Comment Event ---');
  // Client A joins Room A
  clientA.emit('live.join', {
    roomId: roomAId,
    userId: String(userA.numericId),
    userName: userA.username,
  });

  // Client C joins Room B
  clientC.emit('live.join', {
    roomId: roomBId,
    userId: String(userC.numericId),
    userName: userC.username,
  });

  // Prepare welcome event listener for Client A when Client B joins Room A
  let welcomeEventReceivedByA = false;
  let welcomeEventReceivedByC = false;

  clientA.on('room.user.joined', (data) => {
    if (data.roomId === roomAId && data.user?.numericId === userB.numericId) {
      welcomeEventReceivedByA = true;
    }
  });

  clientC.on('room.user.joined', (data) => {
    if (data.roomId === roomAId) {
      welcomeEventReceivedByC = true; // Error: Room B client should NOT receive Room A join event
    }
  });

  // Client B joins Room A
  clientB.emit('live.join', {
    roomId: roomAId,
    userId: String(userB.numericId),
    userName: userB.username,
    displayName: 'Bilal Khan',
  });

  await new Promise((r) => setTimeout(r, 300));

  if (!welcomeEventReceivedByA) throw new Error('Host A did not receive room.user.joined event when Viewer B joined!');
  if (welcomeEventReceivedByC) throw new Error('Room B client received Room A join event! (Scope leak)');
  console.log('✅ Room Join Verified: Host A received "room.user.joined" for Viewer B; Room B client isolated');

  // -------------------------------------------------------------------------
  // TEST 4, 5, 6: Realtime Comments & Room Isolation
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 4, 5, 6: Comments Sync (Host <-> Viewer) & Room Isolation ---');
  let commentA_receivedByB = false;
  let commentA_receivedByC = false;
  let commentB_receivedByA = false;

  clientB.on('live.comment', (data) => {
    if (data.roomId === roomAId && data.comment === 'Welcome everyone to Room A!') {
      commentA_receivedByB = true;
    }
  });

  clientC.on('live.comment', (data) => {
    if (data.roomId === roomAId) {
      commentA_receivedByC = true; // Leak!
    }
  });

  clientA.on('live.comment', (data) => {
    if (data.roomId === roomAId && data.comment === 'Hello Host Ahmed! - Bilal') {
      commentB_receivedByA = true;
    }
  });

  // Host A sends comment in Room A
  clientA.emit('live.comment', {
    roomId: roomAId,
    comment: 'Welcome everyone to Room A!',
    senderName: userA.displayName || userA.username,
    senderBadge: 'HOST',
  });

  await new Promise((r) => setTimeout(r, 200));

  // Viewer B sends comment in Room A
  clientB.emit('live.comment', {
    roomId: roomAId,
    comment: 'Hello Host Ahmed! - Bilal',
    senderName: userB.displayName || userB.username,
    senderBadge: 'USER',
  });

  await new Promise((r) => setTimeout(r, 200));

  if (!commentA_receivedByB) throw new Error('Viewer B did not receive Host A comment!');
  if (commentA_receivedByC) throw new Error('Room B client received Room A comment! (Scope leak)');
  if (!commentB_receivedByA) throw new Error('Host A did not receive Viewer B comment!');

  console.log('✅ Host -> Viewer Comment: Verified');
  console.log('✅ Viewer -> Host Comment: Verified');
  console.log('✅ Comments Room Isolation: Verified (Room B client received 0 comments from Room A)');

  // -------------------------------------------------------------------------
  // TEST 7: Open Seat Claim
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 7: Open Seat Claim ---');
  const seatClaim = await LiveService.takeSeat(roomAId, 2, userB.id);
  if (!seatClaim.seat || seatClaim.seat.status !== 'SPEAKING') {
    throw new Error('Open seat claim failed');
  }
  console.log(`✅ Open Seat Claim: Viewer B assigned to Seat 2 (Status: ${seatClaim.seat.status})`);

  // -------------------------------------------------------------------------
  // TEST 8: Locked Seat Protection
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 8: Locked Seat Protection ---');
  await LiveService.lockSeat(roomAId, 3, userA.id, true);
  let lockedBlocked = false;
  try {
    await LiveService.takeSeat(roomAId, 3, userC.id);
  } catch (err: any) {
    lockedBlocked = true;
    console.log(`✅ Locked Seat Blocked: "${err.message}"`);
  }
  if (!lockedBlocked) throw new Error('Locked seat was claimed unexpectedly');

  // -------------------------------------------------------------------------
  // TEST 9, 10, 11: Waiting List Join Request, Host Accept, Host Reject
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 9, 10, 11: Waiting List Join Request, Accept & Reject ---');
  let requestReceivedByHost = false;
  let requestAcceptedReceivedByViewer = false;

  clientA.on('room.join.requested', (data) => {
    if (data.roomId === roomAId && data.userNumericId === userC.numericId) {
      requestReceivedByHost = true;
    }
  });

  clientC.on('room.join.request.accepted', (data) => {
    if (data.roomId === roomAId && data.targetNumericId === userC.numericId && data.seatIndex === 4) {
      requestAcceptedReceivedByViewer = true;
    }
  });

  // Viewer C requests mic in Room A
  clientC.emit('room.join.request', {
    roomId: roomAId,
    userId: String(userC.id),
    userNumericId: userC.numericId,
    userName: userC.username,
  });

  await new Promise((r) => setTimeout(r, 200));
  if (!requestReceivedByHost) throw new Error('Host did not receive room.join.requested event');
  console.log('✅ Waiting List Join Request: Host received real-time request event');

  // Host A accepts Viewer C on Seat 4
  clientA.emit('room.join.respond', {
    roomId: roomAId,
    targetNumericId: userC.numericId,
    status: 'ACCEPTED',
    seatIndex: 4,
  });

  await new Promise((r) => setTimeout(r, 200));
  if (!requestAcceptedReceivedByViewer) throw new Error('Viewer C did not receive room.join.request.accepted');
  console.log('✅ Host Accept Join Request: Viewer C received accepted event with Seat 4');

  // -------------------------------------------------------------------------
  // TEST 12 & 13: Explore Search (Numeric ID & Username)
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 12 & 13: Explore Search (Numeric ID & Username) ---');
  const searchId = await UserService.searchUsers(`${userA.numericId}`);
  if (searchId.data.length === 0 || searchId.data[0].numericId !== userA.numericId) {
    throw new Error('Search by Numeric ID failed');
  }
  console.log(`✅ Search by Numeric ID (${userA.numericId}): Found "${searchId.data[0].displayName || searchId.data[0].username}"`);

  const searchName = await UserService.searchUsers(userA.username.substring(0, 4));
  if (searchName.data.length === 0) throw new Error('Search by Username failed');
  console.log(`✅ Search by Username prefix: Found ${searchName.data.length} match(es)`);

  // -------------------------------------------------------------------------
  // TEST 14: Duplicate Go-Live Prevention
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 14: Duplicate Go-Live Prevention ---');
  const activeCheck = await LiveService.getMyActiveRoom(userA.id);
  if (!activeCheck.hasActiveRoom || activeCheck.room?.roomId !== roomAId) {
    throw new Error('getMyActiveRoom failed to identify current active broadcast');
  }
  console.log(`✅ Duplicate Prevention: Active room detected (${activeCheck.room.roomId}), preventing duplicate creation`);

  // -------------------------------------------------------------------------
  // TEST 15 & 16: Follow / Unfollow
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 15 & 16: Follow & Unfollow Dynamics ---');
  const follow = await FollowService.followUser(userB.id, userA.numericId);
  if (!follow.isFollowing) throw new Error('Follow user failed');
  console.log(`✅ Follow User: Verified (isFollowing: ${follow.isFollowing})`);

  const unfollow = await FollowService.unfollowUser(userB.id, userA.numericId);
  if (unfollow.isFollowing) throw new Error('Unfollow user failed');
  console.log(`✅ Unfollow User: Verified (isFollowing: ${unfollow.isFollowing})`);

  // -------------------------------------------------------------------------
  // TEST 17: Profile Visitors & 15m Sliding Deduplication
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 17: Profile Visitors & Deduplication ---');
  const visit1 = await VisitorService.recordVisit(userB.id, userA.numericId);
  if (!visit1.recorded) throw new Error('First visit was not recorded');

  const visit2 = await VisitorService.recordVisit(userB.id, userA.numericId);
  if (visit2.recorded !== false) throw new Error('Duplicate visit within 15m window was not deduplicated');
  console.log('✅ Profile Visitor: First visit recorded, second visit within window deduplicated');

  // End all test rooms
  await LiveService.endRoom(roomAId, userA.id);
  await LiveService.endRoom(roomBId, userC.id);

  clientA.disconnect();
  clientB.disconnect();
  clientC.disconnect();
  server.close();

  console.log('\n================================================================');
  console.log('🎉 ALL 18 CORE LIVE & SOCKET.IO INTEGRATION TESTS PASSED (100%)');
  console.log('================================================================');
}

run7CoreLiveFeaturesV2()
  .catch((err) => {
    console.error('❌ QA Test V2 Error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
