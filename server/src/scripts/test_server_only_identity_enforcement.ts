/**
 * ============================================================================
 * 🧪 TEST SUITE: SERVER-ONLY IDENTITY ENFORCEMENT & PUBLIC NUMERIC ID VERIFICATION
 * ============================================================================
 */
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import { PrismaClient } from '@prisma/client';
import { AuthService } from '../services/auth.service';
import assert from 'node:assert';

const prisma = new PrismaClient();

async function runTest() {
  console.log('================================================================');
  console.log('🧪 RUNNING SERVER-ONLY USER IDENTITY INTEGRITY TESTS');
  console.log('================================================================\n');

  // Snapshot before test
  const initialUsers = await prisma.user.findMany({ select: { id: true, numericId: true, username: true } });
  console.log(`Initial PostgreSQL Users in DB: ${initialUsers.length}`);

  const testStamp = Date.now();
  const usernameA = `test_usr_a_${testStamp}`;
  const usernameB = `test_usr_b_${testStamp}`;
  const password = 'Password@123';

  try {
    // -------------------------------------------------------------------------
    // TEST A: Register User 1 via Server API
    // -------------------------------------------------------------------------
    console.log('\n--- 1️⃣ TEST A: Register User 1 via Server ---');
    const regResultA = await AuthService.register({
      username: usernameA,
      email: `${usernameA}@test.com`,
      password: password,
      country: 'Pakistan',
      gender: 'MALE',
    });

    console.log(`✅ User A Created: DB ID=${regResultA.user.id}, Numeric ID=${regResultA.user.numericId}, Username=${regResultA.user.username}`);
    assert(regResultA.user.numericId > 0, 'User A must have a positive numericId assigned by server');
    assert.strictEqual(regResultA.user.id, regResultA.user.numericId, 'User A numericId must equal DB autoincrement ID');
    assert(regResultA.accessToken.length > 20, 'User A must receive a valid server JWT');

    // -------------------------------------------------------------------------
    // TEST B: Register User 2 via Server API
    // -------------------------------------------------------------------------
    console.log('\n--- 2️⃣ TEST B: Register User 2 via Server ---');
    const regResultB = await AuthService.register({
      username: usernameB,
      email: `${usernameB}@test.com`,
      password: password,
      country: 'Pakistan',
      gender: 'FEMALE',
    });

    console.log(`✅ User B Created: DB ID=${regResultB.user.id}, Numeric ID=${regResultB.user.numericId}, Username=${regResultB.user.username}`);
    assert(regResultB.user.numericId > regResultA.user.numericId, 'User B numericId must be strictly greater than User A numericId');
    assert.notStrictEqual(regResultA.user.numericId, regResultB.user.numericId, 'User IDs must be distinct and unique');

    // -------------------------------------------------------------------------
    // TEST C: Login User 1 via Username
    // -------------------------------------------------------------------------
    console.log('\n--- 3️⃣ TEST C: Login User 1 via Username ---');
    const loginResultA = await AuthService.login({
      username: usernameA,
      password: password,
    });
    console.log(`✅ User A Logged in: Returned Numeric ID=${loginResultA.user.numericId}`);
    assert.strictEqual(loginResultA.user.numericId, regResultA.user.numericId, 'Login must return EXACT SAME numericId as registration');
    assert.strictEqual(loginResultA.user.id, regResultA.user.id, 'Login must return EXACT SAME primary key');

    // -------------------------------------------------------------------------
    // TEST D: Login User 1 via numericId
    // -------------------------------------------------------------------------
    console.log('\n--- 4️⃣ TEST D: Login User 1 via Public Numeric ID ---');
    const loginByIdResultA = await AuthService.login({
      username: regResultA.user.numericId.toString(),
      password: password,
    });
    console.log(`✅ User A Logged in via Numeric ID (${regResultA.user.numericId}): Username=${loginByIdResultA.user.username}`);
    assert.strictEqual(loginByIdResultA.user.id, regResultA.user.id, 'Login via numericId must resolve to correct user record');

    // -------------------------------------------------------------------------
    // TEST E: Reject Non-Existent User / Invalid Credentials
    // -------------------------------------------------------------------------
    console.log('\n--- 5️⃣ TEST E: Reject Invalid Credentials / Non-Existent User ---');
    let rejectedNonExistent = false;
    try {
      await AuthService.login({
        username: 'non_existent_ghost_user_999999',
        password: 'wrong_password',
      });
    } catch (e: any) {
      rejectedNonExistent = true;
      console.log(`✅ Correctly rejected non-existent user: "${e.message}"`);
    }
    assert(rejectedNonExistent, 'Server must reject non-existent user');

    let rejectedWrongPassword = false;
    try {
      await AuthService.login({
        username: usernameA,
        password: 'incorrect_password_123',
      });
    } catch (e: any) {
      rejectedWrongPassword = true;
      console.log(`✅ Correctly rejected incorrect password: "${e.message}"`);
    }
    assert(rejectedWrongPassword, 'Server must reject incorrect password');

    // -------------------------------------------------------------------------
    // TEST F: Database ID Uniqueness & Non-Null Audit
    // -------------------------------------------------------------------------
    console.log('\n--- 6️⃣ TEST F: Verify 100% Unique & Non-Null Numeric IDs in PostgreSQL ---');
    const allUsers = await prisma.user.findMany({
      select: { id: true, numericId: true, username: true },
    });

    const numericIdSet = new Set<number>();
    for (const u of allUsers) {
      assert(u.numericId !== null && u.numericId !== undefined && u.numericId > 0, `User ${u.username} (id=${u.id}) has invalid numericId: ${u.numericId}`);
      assert(!numericIdSet.has(u.numericId), `Duplicate numericId detected in database: ${u.numericId} (user: ${u.username})`);
      numericIdSet.add(u.numericId);
    }
    console.log(`✅ Verified ${allUsers.length} total database users. ZERO duplicates, ZERO nulls, 100% server authority.`);

    console.log('\n================================================================');
    console.log('🎉 ALL SERVER-ONLY USER IDENTITY TESTS PASSED 100%');
    console.log('================================================================\n');
  } finally {
    // Clean up only the two temporary test users created during this test run
    await prisma.session.deleteMany({
      where: { user: { username: { in: [usernameA, usernameB] } } },
    });
    await prisma.user.deleteMany({
      where: { username: { in: [usernameA, usernameB] } },
    });
    console.log('🧹 Cleaned up temporary test users.');
    await prisma.$disconnect();
  }
}

runTest().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
