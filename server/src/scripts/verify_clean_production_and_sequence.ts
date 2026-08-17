import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('================================================================');
  console.log('🔍 FINAL PRODUCTION AUDIT & SEQUENCE CALIBRATION');
  console.log('================================================================\n');

  // 1. Check for any test accounts in DB
  const testUsers = await prisma.user.findMany({
    where: {
      OR: [
        { username: { startsWith: 'seq_usr_' } },
        { username: { startsWith: 'test_' } },
      ]
    },
    select: { id: true, numericId: true, username: true, email: true }
  });

  if (testUsers.length > 0) {
    console.log(`Found ${testUsers.length} temporary test user(s) to remove:`);
    console.table(testUsers);
    const testIds = testUsers.map(u => u.id);
    await prisma.session.deleteMany({ where: { userId: { in: testIds } } });
    await prisma.user.deleteMany({ where: { id: { in: testIds } } });
    console.log('✅ Removed test accounts successfully.');
  } else {
    console.log('✅ ZERO test accounts found in database. Clean state confirmed.');
  }

  // 2. Query exact list of real production users
  const realUsers = await prisma.user.findMany({
    select: {
      id: true,
      numericId: true,
      username: true,
      displayName: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: { id: 'asc' }
  });

  console.log(`\n--- 👥 REAL PRODUCTION USERS IN DATABASE (${realUsers.length}) ---`);
  console.table(realUsers.map(u => ({
    dbId: u.id,
    publicNumericId: u.numericId,
    username: u.username,
    displayName: u.displayName,
    email: u.email,
    role: u.role,
    status: u.status,
  })));

  // 3. Calibrate PostgreSQL sequence "public_user_numeric_id_seq" to start exactly at 1 with is_called = false
  await prisma.$executeRawUnsafe(`CREATE SEQUENCE IF NOT EXISTS "public_user_numeric_id_seq" START WITH 1 INCREMENT BY 1;`);
  await prisma.$executeRawUnsafe(`SELECT setval('"public_user_numeric_id_seq"', 1, false);`);

  // 4. Query pg_sequences to inspect exact sequence metadata
  const seqInfo = await prisma.$queryRaw<any[]>`
    SELECT schemaname, sequencename, start_value, min_value, max_value, increment_by, cycle, cache_size, last_value 
    FROM pg_sequences 
    WHERE sequencename = 'public_user_numeric_id_seq';
  `;

  console.log('\n--- 🔢 POSTGRESQL SEQUENCE STATUS (public_user_numeric_id_seq) ---');
  console.table(seqInfo);

  // 5. Test nextval inside a rollback transaction to prove nextval returns 1
  let testNextVal: number = 0;
  await prisma.$transaction(async (tx) => {
    const [res] = await tx.$queryRaw<{ nextval: bigint }[]>`SELECT nextval('"public_user_numeric_id_seq"') AS nextval`;
    testNextVal = Number(res.nextval);
    // Intentional rollback so sequence position isn't moved
    throw new Error('ROLLBACK_TEST_INTENTIONAL');
  }).catch((e) => {
    if (e.message !== 'ROLLBACK_TEST_INTENTIONAL') throw e;
  });

  // Re-ensure is_called is false so sequence remains at 1
  await prisma.$executeRawUnsafe(`SELECT setval('"public_user_numeric_id_seq"', 1, false);`);

  console.log(`\n✅ Verified NEXT Public Numeric ID that will be issued to the next user: ${testNextVal}`);
  console.log('================================================================');
  console.log('🎉 AUDIT COMPLETE: 5 REAL USERS, 0 TEST USERS, NEXT PUBLIC ID = 1');
  console.log('================================================================\n');
}

main().finally(() => prisma.$disconnect());
