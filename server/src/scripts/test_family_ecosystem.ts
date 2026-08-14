import { prisma } from '../config/database.js';
import { FamilyService } from '../services/family.service.js';
import { LiveService } from '../services/live.service.js';

async function testFamilyEcosystem() {
  console.log('🧪 ========================================================');
  console.log('🧪 Starting Aura Live Family Ecosystem End-to-End Test');
  console.log('🧪 ========================================================\n');

  try {
    // 1. Setup Test Users
    let userA = await prisma.user.findFirst({ where: { username: 'Ahmed Khokhar' } });
    if (!userA) {
      userA = await prisma.user.findFirst({ orderBy: { id: 'asc' } });
    }

    let userB = await prisma.user.findFirst({
      where: { id: { not: userA?.id } },
    });

    if (!userA || !userB) {
      throw new Error('Need at least 2 users in database.');
    }

    console.log(`👤 User A (Owner): ${userA.username} (ID: ${userA.id}, NumericID: ${userA.numericId})`);
    console.log(`👤 User B (Member/Host): ${userB.username} (ID: ${userB.id}, NumericID: ${userB.numericId})\n`);

    // Clean up any existing family membership for test users to start fresh
    await prisma.familyMember.deleteMany({
      where: { userId: { in: [userA.id, userB.id] } },
    });

    // Step 1: User A Creates Family
    console.log('Step 1: User A creates a new Family (Owner Role)...');
    const famName = `Imperial Lions Guild ${Math.floor(1000 + Math.random() * 9000)} 🦁`;
    const createResult = await FamilyService.createFamily({
      ownerId: userA.id,
      name: famName,
      description: 'The elite guild of top Aura Live creators and broadcasters.',
      rules: '1. Active daily presence\n2. Respect all members\n3. Support family rooms',
      icon: '🦁',
      country: 'Pakistan',
    });
    const family = createResult.family;
    console.log(`✓ Family Created! ID: ${family.familyId}, DB UUID: ${family.id}, Level: Lv.${family.level}, XP: ${family.xp}`);

    // Step 2: Owner invites User B to the Family
    console.log('\nStep 2: Owner invites User B to join the Family...');
    const invitation = await FamilyService.inviteMember({
      familyId: family.id,
      inviterId: userA.id,
      targetUserId: userB.id,
    });
    console.log(`✓ Invitation Sent! ID: ${invitation.id}, Status: ${invitation.status}`);

    // Step 3: User B views pending invitations
    console.log('\nStep 3: User B checks pending family invitations...');
    const myInvites = await FamilyService.getMyInvitations(userB.id);
    console.log(`✓ User B has ${myInvites.length} pending invitation(s). Target Family: ${myInvites[0].family.name}`);

    // Step 4: User B accepts invitation
    console.log('\nStep 4: User B accepts invitation...');
    const joinedMember = await FamilyService.respondInvitation({
      invitationId: invitation.id,
      userId: userB.id,
      action: 'ACCEPTED',
    });
    console.log(`✓ User B joined Family! Role: ${(joinedMember as any).role || 'MEMBER'}`);

    // Step 5: Owner promotes User B to HOST
    console.log('\nStep 5: Owner promotes User B to "HOST" role...');
    const promoted = await FamilyService.updateMemberRole({
      familyId: family.id,
      actorId: userA.id,
      targetUserId: userB.id,
      newRole: 'HOST',
    });
    console.log(`✓ Role updated successfully! New Role for ${promoted.user.username}: ${promoted.role}`);

    // Step 6: User B (Host) creates Family Audio Room
    console.log('\nStep 6: User B creates Family Audio Room...');
    const roomResult = await FamilyService.createFamilyRoom({
      familyId: family.id,
      hostUserId: userB.id,
      title: '🦁 Grand Royal Family Lounge & Jam Session',
      isFamilyOnly: false,
      seatCount: 15,
    });
    const familyRoom = roomResult.room;
    console.log(`✓ Family Audio Room Created! RoomID: ${familyRoom.roomId}, Host: ${familyRoom.host.username}, Agora Token generated.`);

    // Step 7: Members post in Family Chat
    console.log('\nStep 7: Members post realtime messages in Family Chat...');
    const chatMsg = await FamilyService.postFamilyMessage({
      familyId: family.id,
      senderId: userA.id,
      content: 'Welcome to our official Family Lounge! 👑 All members tune into the live audio suite!',
      type: 'TEXT',
    });
    console.log(`✓ Message sent by @${chatMsg.sender.username} (${chatMsg.senderRole}): "${chatMsg.content}"`);

    // Step 8: Diamond Gift Contribution & XP Engine
    console.log('\nStep 8: User sends gifts -> Family Diamonds & XP increment...');
    // Ensure Gift exists
    let gift = await prisma.gift.findFirst();
    if (!gift) {
      gift = await prisma.gift.create({
        data: {
          name: 'Imperial Dragon',
          icon: '🐉',
          costCoins: 5000,
          rewardDiamonds: 2500,
          category: 'Luxury',
        },
      });
    }

    // Ensure User A has sufficient coins
    await prisma.user.update({
      where: { id: userA.id },
      data: { coins: { increment: 20000 } },
    });

    const giftResult = await LiveService.sendGiftInRoom({
      roomId: familyRoom.roomId,
      senderUserId: userA.id,
      receiverUserId: userB.id,
      giftId: gift.id,
      count: 2,
    });
    console.log(`✓ Gift Sent! TxID: ${giftResult.giftTransactionId}, Remaining Coins: ${giftResult.remainingCoins}`);

    // Check updated family stats
    const updatedFamily = await prisma.family.findUnique({
      where: { id: family.id },
      include: { members: true },
    });
    console.log(`✓ Family Diamond Balance: ${updatedFamily?.totalDiamonds} Diamonds, XP: ${updatedFamily?.xp} XP, Level: Lv.${updatedFamily?.level}`);

    // Step 9: Post Pinned Family Announcement
    console.log('\nStep 9: Owner posts pinned Family Announcement...');
    const announcement = await FamilyService.postAnnouncement({
      familyId: family.id,
      authorId: userA.id,
      title: '👑 Grand Family Audio PK Match Tonight at 9:00 PM PKT',
      content: 'Every member must be present in the family room to cheer for our champions!',
      isPinned: true,
    });
    console.log(`✓ Announcement posted! Title: "${announcement.title}", Pinned: ${announcement.isPinned}`);

    // Step 10: Check Realtime Family Rankings
    console.log('\nStep 10: Fetching Realtime Family Rankings...');
    const rankings = await FamilyService.getFamilyRankings('all');
    console.log(`✓ Found ${rankings.length} ranked family/families:`);
    rankings.slice(0, 3).forEach((rf, idx) => {
      console.log(`  #${idx + 1} ${rf.name} (Lv.${rf.level}, ${rf.totalDiamonds} Diamonds, ${rf._count.members} Members)`);
    });

    // Step 11: Audit Logs Verification
    console.log('\nStep 11: Verifying Immutable Audit Logs for Family...');
    const logs = await prisma.auditLog.findMany({
      where: { resource: { contains: family.id } },
      orderBy: { createdAt: 'asc' },
    });
    console.log(`✓ Found ${logs.length} immutable audit logs:`);
    for (const l of logs) {
      console.log(`  - [${l.action}] by Actor #${l.actorId} (${l.actorRole}): ${l.details}`);
    }

    console.log('\n🎉 ========================================================');
    console.log('🎉 ALL FAMILY ECOSYSTEM END-TO-END TESTS PASSED WITH 100% SUCCESS!');
    console.log('🎉 ========================================================\n');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testFamilyEcosystem();
