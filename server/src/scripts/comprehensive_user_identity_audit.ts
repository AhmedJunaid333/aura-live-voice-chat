import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
import 'dotenv/config';
import { prisma } from '../config/database.js';

async function main() {
  console.log('================================================================');
  console.log('🔍 FULL-SCALE USER IDENTITY & PRODUCTION DATABASE AUDIT');
  console.log('================================================================\n');

  // ============================================================
  // TASK 4: DATABASE ENVIRONMENT VERIFICATION
  // ============================================================
  console.log('--- 🌐 TASK 4: DATABASE ENVIRONMENT VERIFICATION ---');
  const dbUrl = process.env.DATABASE_URL || '';
  let maskedHost = 'UNKNOWN';
  let dbName = 'UNKNOWN';
  try {
    const parsed = new URL(dbUrl);
    maskedHost = parsed.host;
    dbName = parsed.pathname.replace('/', '');
  } catch (_) {}

  console.log(`DATABASE_HOST:           ${maskedHost}`);
  console.log(`DATABASE_NAME:           ${dbName}`);
  console.log(`DATABASE_SCHEMA:         public`);
  console.log(`NODE_ENV:                ${process.env.NODE_ENV || 'development'}`);
  console.log(`PORT:                    ${process.env.PORT || '3001'}`);
  console.log(`PRISMA_TARGET:           Neon Cloud PostgreSQL Cluster (AWS us-east-2)`);

  // ============================================================
  // TASK 3: SEARCH ALL DATABASE TABLES & SCHEMA STRUCTURE
  // ============================================================
  console.log('\n--- 🗄️ TASK 3: DATABASE TABLES & SCHEMA AUDIT ---');
  
  // List all tables in public schema
  const tables: any = await prisma.$queryRawUnsafe(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name ASC;
  `);
  console.log(`Total Tables in Database: ${tables.length}`);
  console.log(`Table Names: ${tables.map((t: any) => t.table_name).join(', ')}`);

  // Check columns of User table
  const userColumns: any = await prisma.$queryRawUnsafe(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'User'
    ORDER BY ordinal_position ASC;
  `);
  console.log('\nColumns in "User" Table:');
  console.table(userColumns);

  // ============================================================
  // TASK 1 & 2: AUTH PROVIDER / AUTH ACCOUNT AUDIT
  // ============================================================
  console.log('\n--- 🔑 TASK 1 & 2: AUTH ACCOUNTS & OAUTH IDENTITIES ---');
  const authAccounts = await (prisma as any).authAccount.findMany({
    include: {
      user: {
        select: { id: true, numericId: true, username: true, email: true, role: true, status: true },
      },
    },
  });

  console.log(`Total AuthAccount records linked: ${authAccounts.length}`);
  if (authAccounts.length > 0) {
    console.table(authAccounts.map((a: any) => ({
      id: a.id,
      userId: a.userId,
      provider: a.provider,
      providerAccountId: a.providerAccountId,
      matchedUser: a.user ? `${a.user.username} (ID:${a.user.id}, NumID:${a.user.numericId})` : 'ORPHANED',
      createdAt: a.createdAt.toISOString(),
    })));
  } else {
    console.log('No external OAuth / AuthAccount rows exist in AuthAccount table.');
  }

  // Check Sessions
  const sessions = await prisma.session.findMany({
    include: {
      user: {
        select: { id: true, numericId: true, username: true, email: true, status: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  console.log(`\nTotal Active/Recorded Sessions: ${sessions.length}`);
  console.table(sessions.map((s) => ({
    sessionId: s.id,
    userId: s.userId,
    username: s.user?.username || 'ORPHANED',
    numericId: s.user?.numericId || 'N/A',
    expiresAt: s.expiresAt.toISOString(),
    createdAt: s.createdAt.toISOString(),
  })));

  // ============================================================
  // TASK 6: AUDIT ALL USERS & NUMERIC IDs
  // ============================================================
  console.log('\n--- 👥 TASK 6: DETAILED USER RECORDS & ID ANALYSIS ---');
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      numericId: true,
      username: true,
      displayName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      coins: true,
      diamonds: true,
      level: true,
      vipTier: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { id: 'asc' },
  });

  console.log(`TOTAL USERS = ${allUsers.length}`);
  console.table(allUsers.map((u) => ({
    dbId: u.id,
    numericId: u.numericId,
    username: u.username,
    displayName: u.displayName || '(none)',
    email: u.email || '(none)',
    phone: u.phone || '(none)',
    role: u.role,
    status: u.status,
    coins: Number(u.coins),
    diamonds: Number(u.diamonds),
    created: u.createdAt.toISOString().slice(0, 19).replace('T', ' '),
  })));

  // Check for Duplicate numericIds
  const numIdMap = new Map<number, any[]>();
  for (const u of allUsers) {
    if (!numIdMap.has(u.numericId)) {
      numIdMap.set(u.numericId, []);
    }
    numIdMap.get(u.numericId)!.push(u);
  }
  const duplicates = Array.from(numIdMap.entries()).filter(([_, users]) => users.length > 1);

  console.log('\n--- ⚠️ ID INTEGRITY CHECKS ---');
  console.log(`Duplicate numericIds:     ${duplicates.length === 0 ? 'NONE (0 duplicates)' : JSON.stringify(duplicates)}`);
  console.log(`NULL numericIds:          ${allUsers.filter((u) => u.numericId == null).length}`);
  console.log(`Non-matching (id != numericId) accounts:`);
  const nonMatching = allUsers.filter((u) => u.id !== u.numericId);
  console.table(nonMatching.map((u) => ({
    dbId: u.id,
    currentNumericId: u.numericId,
    expectedIfSequential: u.id,
    username: u.username,
    role: u.role,
    reason: u.numericId >= 100000 ? 'Legacy Seed / Old 100000+ System' : (u.numericId === 10 ? 'Exact ID 10 (Auto-increment Match)' : 'Test Script Custom Value'),
  })));

  // ============================================================
  // TASK 3: AUDIT RELATED TABLES FOR ORPHANED REFERENCES
  // ============================================================
  console.log('\n--- 🔗 TASK 3: CROSS-TABLE INTEGRITY & ORPHAN AUDIT ---');
  const userIds = new Set(allUsers.map((u) => u.id));

  // Check LiveRooms
  const liveRooms = await prisma.liveRoom.findMany({ select: { id: true, roomId: true, hostId: true, title: true, status: true } });
  const orphanedRooms = liveRooms.filter((r) => !userIds.has(r.hostId));
  console.log(`Total Live Rooms in DB:   ${liveRooms.length} (Orphaned host references: ${orphanedRooms.length})`);

  // Check Broadcast History
  const broadcastHistories = await prisma.broadcastHistory.findMany({ select: { id: true, broadcastId: true, hostId: true, roomId: true } });
  const orphanedHistory = broadcastHistories.filter((b) => !userIds.has(b.hostId));
  console.log(`Total Broadcast Histories: ${broadcastHistories.length} (Orphaned host references: ${orphanedHistory.length})`);

  // Check Reseller Accounts
  const resellers = await prisma.resellerAccount.findMany({ select: { id: true, userId: true, displayName: true, status: true } });
  const orphanedResellers = resellers.filter((r) => !userIds.has(r.userId));
  console.log(`Total Reseller Accounts:   ${resellers.length} (Orphaned user references: ${orphanedResellers.length})`);

  // Check Wallet Transactions
  const walletTxns = await prisma.walletTransaction.findMany({ select: { id: true, userId: true, type: true, amount: true } });
  const orphanedWallet = walletTxns.filter((w) => !userIds.has(w.userId));
  console.log(`Total Wallet Transactions: ${walletTxns.length} (Orphaned user references: ${orphanedWallet.length})`);

  // Check Gift Transactions
  const giftTxns = await prisma.giftTransaction.findMany({ select: { id: true, senderId: true, receiverId: true, giftId: true } });
  const orphanedGifts = giftTxns.filter((g) => !userIds.has(g.senderId) || !userIds.has(g.receiverId));
  console.log(`Total Gift Transactions:   ${giftTxns.length} (Orphaned references: ${orphanedGifts.length})`);

  // Check Audit Logs
  const auditLogs = await prisma.auditLog.findMany({ select: { id: true, actorId: true, action: true, resource: true } });
  const orphanedLogs = auditLogs.filter((a) => a.actorId !== 0 && !userIds.has(a.actorId));
  console.log(`Total Audit Logs:          ${auditLogs.length} (Orphaned actor references: ${orphanedLogs.length})`);

  console.log('\n================================================================');
  console.log('✅ AUDIT SCAN COMPLETE');
  console.log('================================================================');
}

main()
  .catch((e) => {
    console.error('Audit failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
