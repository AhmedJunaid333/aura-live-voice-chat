import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function cleanupTestAccounts() {
  console.log('Cleaning up test accounts (test_host_lifecycle, test_viewer_lifecycle)...');
  
  const testUsers = await prisma.user.findMany({
    where: { username: { in: ['test_host_lifecycle', 'test_viewer_lifecycle'] } },
    select: { id: true, username: true }
  });

  const testIds = testUsers.map(u => u.id);

  if (testIds.length > 0) {
    // Delete any dependent records for test users
    await prisma.session.deleteMany({ where: { userId: { in: testIds } } });
    await prisma.liveRoomSeat.deleteMany({ where: { userId: { in: testIds } } });
    await prisma.liveRoomViewer.deleteMany({ where: { userId: { in: testIds } } });
    await prisma.liveRoomAdmin.deleteMany({ where: { userId: { in: testIds } } });
    await prisma.liveRoom.deleteMany({ where: { hostId: { in: testIds } } });
    await prisma.broadcastHistory.deleteMany({ where: { hostId: { in: testIds } } });
    await prisma.user.deleteMany({ where: { id: { in: testIds } } });
    console.log(`✅ Removed ${testIds.length} test user accounts:`, testUsers.map(u => u.username));
  } else {
    console.log('No test accounts found to remove.');
  }

  const remaining = await prisma.user.findMany({
    select: { id: true, numericId: true, username: true, role: true, email: true },
    orderBy: { id: 'asc' }
  });

  console.log('\n--- VERIFIED REMAINING USERS IN DATABASE ---');
  console.table(remaining);
}

cleanupTestAccounts().finally(() => prisma.$disconnect());
