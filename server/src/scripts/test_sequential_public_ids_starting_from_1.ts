/**
 * ============================================================================
 * 🧪 VERIFICATION TEST: SEQUENTIAL PUBLIC NUMERIC IDs STARTING FROM 1
 * ============================================================================
 */
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import { PrismaClient } from '@prisma/client';
import { AuthService } from '../services/auth.service';
import assert from 'node:assert';

const prisma = new PrismaClient();

async function runSequentialTest() {
  console.log('================================================================');
  console.log('🧪 VERIFYING SEQUENTIAL PUBLIC NUMERIC IDs (1, 2, 3...)');
  console.log('================================================================\n');

  // Verify starting state
  const existingUsers = await prisma.user.findMany({
    select: { id: true, numericId: true, username: true },
    orderBy: { id: 'asc' }
  });
  console.log(`Starting Production Users in DB (${existingUsers.length}):`);
  console.table(existingUsers);

  const stamp = Date.now();
  const username1 = `seq_usr_1_${stamp}`;
  const username2 = `seq_usr_2_${stamp}`;
  const username3 = `seq_usr_3_${stamp}`;
  const password = 'Password@1234';

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Register User 1
    // -------------------------------------------------------------------------
    console.log('\n--- 1️⃣ TEST 1: Register User 1 ---');
    const res1 = await AuthService.register({
      username: username1,
      email: `${username1}@aura.live`,
      password,
      country: 'Pakistan',
      gender: 'MALE',
    });
    console.log(`✅ User 1 Created: Username=${res1.user.username}, DB Primary Key=${res1.user.id}, Public Numeric ID=${res1.user.numericId}`);
    assert.strictEqual(res1.user.numericId, 1, `User 1 MUST receive Public Numeric ID = 1 (received: ${res1.user.numericId})`);

    // -------------------------------------------------------------------------
    // TEST 2: Register User 2
    // -------------------------------------------------------------------------
    console.log('\n--- 2️⃣ TEST 2: Register User 2 ---');
    const res2 = await AuthService.register({
      username: username2,
      email: `${username2}@aura.live`,
      password,
      country: 'Pakistan',
      gender: 'FEMALE',
    });
    console.log(`✅ User 2 Created: Username=${res2.user.username}, DB Primary Key=${res2.user.id}, Public Numeric ID=${res2.user.numericId}`);
    assert.strictEqual(res2.user.numericId, 2, `User 2 MUST receive Public Numeric ID = 2 (received: ${res2.user.numericId})`);

    // -------------------------------------------------------------------------
    // TEST 3: Register User 3
    // -------------------------------------------------------------------------
    console.log('\n--- 3️⃣ TEST 3: Register User 3 ---');
    const res3 = await AuthService.register({
      username: username3,
      email: `${username3}@aura.live`,
      password,
      country: 'Pakistan',
      gender: 'OTHER',
    });
    console.log(`✅ User 3 Created: Username=${res3.user.username}, DB Primary Key=${res3.user.id}, Public Numeric ID=${res3.user.numericId}`);
    assert.strictEqual(res3.user.numericId, 3, `User 3 MUST receive Public Numeric ID = 3 (received: ${res3.user.numericId})`);

    // -------------------------------------------------------------------------
    // TEST 4: Verify Login & Multi-Device Persistence
    // -------------------------------------------------------------------------
    console.log('\n--- 4️⃣ TEST 4: Login Persistence Across Devices / Sessions ---');
    const login1 = await AuthService.login({ username: username1, password });
    assert.strictEqual(login1.user.numericId, 1, 'Login for User 1 must return Public ID 1');

    const loginById1 = await AuthService.login({ username: '1', password });
    assert.strictEqual(loginById1.user.username, username1, 'Login via Public ID "1" must return User 1');

    const login2 = await AuthService.login({ username: username2, password });
    assert.strictEqual(login2.user.numericId, 2, 'Login for User 2 must return Public ID 2');

    const loginById2 = await AuthService.login({ username: '2', password });
    assert.strictEqual(loginById2.user.username, username2, 'Login via Public ID "2" must return User 2');

    const login3 = await AuthService.login({ username: username3, password });
    assert.strictEqual(login3.user.numericId, 3, 'Login for User 3 must return Public ID 3');

    const loginById3 = await AuthService.login({ username: '3', password });
    assert.strictEqual(loginById3.user.username, username3, 'Login via Public ID "3" must return User 3');

    console.log('✅ All logins by username and by numeric ID verified.');

    // -------------------------------------------------------------------------
    // TEST 5: Complete Database Integrity Check
    // -------------------------------------------------------------------------
    console.log('\n--- 5️⃣ TEST 5: Verify Complete DB ID Uniqueness ---');
    const allUsers = await prisma.user.findMany({ select: { id: true, numericId: true, username: true } });
    const seen = new Set<number>();
    for (const u of allUsers) {
      assert(!seen.has(u.numericId), `Duplicate numeric ID found: ${u.numericId}`);
      seen.add(u.numericId);
    }
    console.log(`✅ Verified ${allUsers.length} total users in DB. ZERO duplicate IDs.`);

    console.log('\n================================================================');
    console.log('🎉 ALL TESTS PASSED: PUBLIC NUMERIC IDs START STRICTLY FROM 1, 2, 3...');
    console.log('================================================================\n');
  } finally {
    // Clean up only the 3 temporary test users
    const testUsernames = [username1, username2, username3];
    await prisma.session.deleteMany({
      where: { user: { username: { in: testUsernames } } },
    });
    await prisma.user.deleteMany({
      where: { username: { in: testUsernames } },
    });

    // Reset sequence so real production registrations start cleanly at 1
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE "public_user_numeric_id_seq" RESTART WITH 1;`);
    console.log('🧹 Cleaned up temporary test users and reset public ID sequence to start cleanly at 1.');
    await prisma.$disconnect();
  }
}

runSequentialTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
