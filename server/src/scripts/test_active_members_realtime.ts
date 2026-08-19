import { prisma } from '../config/database.js';
import { LiveService } from '../services/live.service.js';

async function runActiveMembersTest() {
  console.log('🧪 Starting Active Members Real-Time & Isolation Integration Test...');

  try {
    // 1. Ensure test users exist
    let hostUser = await prisma.user.findFirst({ where: { email: 'test_host_members@test.com' } });
    if (!hostUser) {
      hostUser = await prisma.user.create({
        data: {
          email: 'test_host_members@test.com',
          username: 'HostMemberTester',
          displayName: 'Host Member Tester',
          passwordHash: 'dummy_hash',
          numericId: 888101,
          level: 10,
          vipTier: 1,
        },
      });
    }

    let viewerUser1 = await prisma.user.findFirst({ where: { email: 'test_viewer1_members@test.com' } });
    if (!viewerUser1) {
      viewerUser1 = await prisma.user.create({
        data: {
          email: 'test_viewer1_members@test.com',
          username: 'Viewer1Tester',
          displayName: 'Viewer One',
          passwordHash: 'dummy_hash',
          numericId: 888102,
          level: 3,
          vipTier: 0,
        },
      });
    }

    let viewerUser2 = await prisma.user.findFirst({ where: { email: 'test_viewer2_members@test.com' } });
    if (!viewerUser2) {
      viewerUser2 = await prisma.user.create({
        data: {
          email: 'test_viewer2_members@test.com',
          username: 'Viewer2Tester',
          displayName: 'Viewer Two',
          passwordHash: 'dummy_hash',
          numericId: 888103,
          level: 5,
          vipTier: 2,
        },
      });
    }

    let hostUserB = await prisma.user.findFirst({ where: { email: 'test_host_b_members@test.com' } });
    if (!hostUserB) {
      hostUserB = await prisma.user.create({
        data: {
          email: 'test_host_b_members@test.com',
          username: 'HostBTester',
          displayName: 'Host B',
          passwordHash: 'dummy_hash',
          numericId: 888104,
          level: 8,
          vipTier: 0,
        },
      });
    }

    // 2. Create Room A
    console.log('📦 Step 1: Creating Room A...');
    const roomARes = await LiveService.createRoom({
      hostUserId: hostUser.id,
      title: 'Active Members Test Room A',
      seatCount: 10,
    });
    const roomIdA = roomARes.room.roomId;
    console.log(`✅ Room A Created: ${roomIdA}`);

    // Verify initial active members (Host only)
    let membersA = await LiveService.getActiveRoomMembers(roomIdA);
    console.log(`📊 Room A initial active members count: ${membersA.totalMembers}`);
    if (membersA.totalMembers !== 1 || membersA.members[0].numericId !== hostUser.numericId || membersA.members[0].role !== 'HOST') {
      throw new Error(`Expected 1 Host member in Room A, got: ${JSON.stringify(membersA)}`);
    }
    console.log('✅ Room A Host initial verification passed.');

    // 3. Viewer 1 Joins Room A
    console.log('👤 Step 2: Viewer 1 joins Room A...');
    await LiveService.recordViewerJoin(roomIdA, viewerUser1.id, 'sock_viewer1');
    membersA = await LiveService.getActiveRoomMembers(roomIdA);
    console.log(`📊 Room A members count after Viewer 1 joined: ${membersA.totalMembers}`);
    if (membersA.totalMembers !== 2) {
      throw new Error(`Expected 2 members in Room A, got: ${membersA.totalMembers}`);
    }
    const viewer1Member = membersA.members.find((m) => m.numericId === viewerUser1.numericId);
    if (!viewer1Member || viewer1Member.role !== 'VIEWER') {
      throw new Error(`Expected Viewer 1 to have role 'VIEWER', got: ${JSON.stringify(viewer1Member)}`);
    }
    console.log('✅ Viewer 1 join & VIEWER role verification passed.');

    // 4. Viewer 1 takes Seat 2
    console.log('🎙️ Step 3: Viewer 1 takes Seat 2...');
    await LiveService.takeSeat(roomIdA, 2, viewerUser1.id);
    membersA = await LiveService.getActiveRoomMembers(roomIdA);
    const seatedViewer1 = membersA.members.find((m) => m.numericId === viewerUser1.numericId);
    if (!seatedViewer1 || seatedViewer1.role !== 'SPEAKER' || seatedViewer1.seatNumber !== 2) {
      throw new Error(`Expected Viewer 1 to be promoted to SPEAKER on Seat 2, got: ${JSON.stringify(seatedViewer1)}`);
    }
    console.log('✅ Viewer 1 promotion to SPEAKER on Seat 2 verification passed.');

    // 5. Viewer 2 Joins Room A
    console.log('👤 Step 4: Viewer 2 joins Room A...');
    await LiveService.recordViewerJoin(roomIdA, viewerUser2.id, 'sock_viewer2');
    membersA = await LiveService.getActiveRoomMembers(roomIdA);
    console.log(`📊 Room A members count with Host + Speaker + Viewer: ${membersA.totalMembers}`);
    if (membersA.totalMembers !== 3) {
      throw new Error(`Expected 3 members in Room A, got: ${membersA.totalMembers}`);
    }
    console.log('✅ Host + Speaker + Viewer coexistence verified.');

    // 6. Viewer 2 Leaves Room A
    console.log('🚪 Step 5: Viewer 2 leaves Room A...');
    await LiveService.recordViewerLeave(roomIdA, viewerUser2.id);
    membersA = await LiveService.getActiveRoomMembers(roomIdA);
    console.log(`📊 Room A members count after Viewer 2 left: ${membersA.totalMembers}`);
    if (membersA.totalMembers !== 2 || membersA.members.some((m) => m.numericId === viewerUser2.numericId)) {
      throw new Error(`Expected 2 members in Room A without Viewer 2, got: ${JSON.stringify(membersA)}`);
    }
    console.log('✅ Viewer 2 departure & count decrement verified.');

    // 7. Room Scope Isolation: Create Room B and verify zero member leakage
    console.log('🔒 Step 6: Creating Room B for Room Scope Isolation test...');
    const roomBRes = await LiveService.createRoom({
      hostUserId: hostUserB.id,
      title: 'Active Members Test Room B',
      seatCount: 10,
    });
    const roomIdB = roomBRes.room.roomId;

    const membersB = await LiveService.getActiveRoomMembers(roomIdB);
    console.log(`📊 Room B members count: ${membersB.totalMembers}`);
    if (membersB.totalMembers !== 1 || membersB.members[0].numericId !== hostUserB.numericId) {
      throw new Error(`Expected only Host B in Room B, got: ${JSON.stringify(membersB)}`);
    }
    const hasRoomAMemberInB = membersB.members.some((m) => m.numericId === hostUser.numericId || m.numericId === viewerUser1.numericId);
    if (hasRoomAMemberInB) {
      throw new Error('❌ Room Isolation Violation: Room A members found in Room B!');
    }
    console.log('✅ 100% Strict Room Scope Isolation verified: Zero cross-room member leakage.');

    // 8. Cleanup test rooms and data
    console.log('🧹 Cleaning up test data...');
    await prisma.liveRoomViewer.deleteMany({ where: { roomId: { in: [roomIdA, roomIdB] } } });
    await prisma.liveRoomSeat.deleteMany({ where: { roomId: { in: [roomIdA, roomIdB] } } });
    await prisma.liveRoom.deleteMany({ where: { roomId: { in: [roomIdA, roomIdB] } } });
    await prisma.user.deleteMany({ where: { email: { in: ['test_host_members@test.com', 'test_viewer1_members@test.com', 'test_viewer2_members@test.com', 'test_host_b_members@test.com'] } } });

    console.log('\n🎉 ALL ACTIVE MEMBERS INTEGRATION TESTS PASSED (100% SUCCESS)!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
  }
}

runActiveMembersTest();
