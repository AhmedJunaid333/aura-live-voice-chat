import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
import 'dotenv/config';
import { prisma } from '../config/database.js';

async function main() {
  console.log('====================================================');
  console.log('📊 PRODUCTION DATABASE USER AUDIT & EXACT COUNT');
  console.log('====================================================\n');

  // 1. Total Users
  const totalUsers = await prisma.user.count();

  // 2. Active Users & Inactive Users
  const activeUsers = await prisma.user.count({
    where: { status: 'ACTIVE' },
  });

  const inactiveUsers = await prisma.user.count({
    where: { status: { not: 'ACTIVE' } },
  });

  // Status breakdown
  const statusGroup = await prisma.user.groupBy({
    by: ['status'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  });

  // 3. Users with NULL numericId
  // In Prisma schema numericId is Int @unique (not nullable in schema, but let's check raw records)
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      numericId: true,
      username: true,
      displayName: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: { id: 'asc' },
  });

  const nullNumericIdUsers = allUsers.filter((u) => u.numericId == null);
  const nullNumericIdCount = nullNumericIdUsers.length;

  // 4. Duplicate numericIds
  const numericIdCounts = new Map<number, number>();
  allUsers.forEach((u) => {
    if (u.numericId != null) {
      numericIdCounts.set(u.numericId, (numericIdCounts.get(u.numericId) || 0) + 1);
    }
  });
  const duplicates = Array.from(numericIdCounts.entries()).filter(([_, count]) => count > 1);

  // 5. Admin users (role contains ADMIN)
  const adminUsers = await prisma.user.count({
    where: {
      OR: [
        { role: 'ADMIN' },
        { role: 'SUPER_ADMIN' },
        { role: 'SUPER_ADMIN_CEO' },
      ],
    },
  });

  // 6. Host users (role = HOST)
  const hostRoleUsers = await prisma.user.count({
    where: { role: 'HOST' },
  });

  // Users who have hosted live rooms
  const distinctHosts = await prisma.liveRoom.groupBy({
    by: ['hostId'],
    _count: { id: true },
  });
  const usersWithHostedRoomsCount = distinctHosts.length;

  // 7. Agency users (role = AGENCY)
  const agencyUsers = await prisma.user.count({
    where: {
      OR: [
        { role: 'AGENCY' },
        { role: 'AGENCY_LEADER' },
      ],
    },
  });

  // 8. Reseller users (role = RESELLER or has ResellerAccount)
  const resellerRoleUsers = await prisma.user.count({
    where: { role: 'RESELLER' },
  });
  const resellerAccountCount = await prisma.resellerAccount.count();

  // Role Breakdown
  const roleGroup = await prisma.user.groupBy({
    by: ['role'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  });

  console.log('----------------------------------------------------');
  console.log(`TOTAL USERS = ${totalUsers}`);
  console.log('----------------------------------------------------');
  console.log(`1. Total Users: ${totalUsers}`);
  console.log(`2. Active Users: ${activeUsers}`);
  console.log(`3. Inactive Users: ${inactiveUsers}`);
  console.log(`4. Users with NULL numericId: ${nullNumericIdCount}`);
  console.log(`5. Duplicate numericIds: ${duplicates.length === 0 ? '0 (None found)' : JSON.stringify(duplicates)}`);
  console.log(`6. Admin Users: ${adminUsers}`);
  console.log(`7. Host Users: ${hostRoleUsers} (Users who created Live Rooms: ${usersWithHostedRoomsCount})`);
  console.log(`8. Agency Users: ${agencyUsers}`);
  console.log(`9. Reseller Users: ${resellerRoleUsers} (Users with Reseller Account: ${resellerAccountCount})`);
  console.log('\n--- STATUS BREAKDOWN ---');
  console.table(statusGroup.map((s) => ({ status: s.status, count: s._count.id })));
  console.log('\n--- ROLE BREAKDOWN ---');
  console.table(roleGroup.map((r) => ({ role: r.role, count: r._count.id })));
  console.log('\n--- ALL USERS IN PRODUCTION DATABASE ---');
  console.table(allUsers.map((u) => ({
    id: u.id,
    numericId: u.numericId,
    username: u.username,
    displayName: u.displayName || '(none)',
    role: u.role,
    status: u.status,
    created: u.createdAt.toISOString().slice(0, 19).replace('T', ' '),
  })));
}

main()
  .catch((e) => {
    console.error('Error executing query:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

