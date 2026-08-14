import { prisma } from '../config/database.js';
import { AuthService } from '../services/auth.service.js';

/**
 * E2E Test: Sequential Permanent User ID System
 *
 * Verifies:
 * 1. New registrations get sequential IDs (numericId = id)
 * 2. numericId is ALWAYS equal to id (database-generated)
 * 3. Login returns the SAME account (no new ID created)
 * 4. Google login returns the SAME account (no new ID created)
 * 5. Deleted user's ID is NEVER reused
 * 6. IDs are always sequential with no gaps from new registrations
 */

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function cleanup() {
  // Delete test users from previous runs
  await prisma.user.deleteMany({
    where: {
      username: {
        in: [
          'seq_test_user_1',
          'seq_test_user_2',
          'seq_test_user_3',
          'seq_test_deleted',
          'seq_test_after_delete',
          'seq_google_user',
          'seq_google_relogin',
        ],
      },
    },
  });
  // Also clean up AuthAccount entries
  try {
    await (prisma as any).authAccount.deleteMany({
      where: {
        providerAccountId: {
          in: ['google_seq_test_sub_1', 'google_seq_test_sub_2'],
        },
      },
    });
  } catch (_) {
    // AuthAccount may not exist yet
  }
}

async function testSequentialRegistration() {
  console.log('\n📋 TEST 1: Sequential Registration (numericId = id)');
  console.log('─'.repeat(50));

  const result1 = await AuthService.register({
    username: 'seq_test_user_1',
    email: 'seq_test_1@test.com',
    password: 'TestPass123!',
  });

  const result2 = await AuthService.register({
    username: 'seq_test_user_2',
    email: 'seq_test_2@test.com',
    password: 'TestPass123!',
  });

  const result3 = await AuthService.register({
    username: 'seq_test_user_3',
    email: 'seq_test_3@test.com',
    password: 'TestPass123!',
  });

  const user1 = result1.user;
  const user2 = result2.user;
  const user3 = result3.user;

  console.log(`  User 1: id=${user1.id}, numericId=${user1.numericId}`);
  console.log(`  User 2: id=${user2.id}, numericId=${user2.numericId}`);
  console.log(`  User 3: id=${user3.id}, numericId=${user3.numericId}`);

  // Core assertion: numericId must ALWAYS equal id
  assert(user1.numericId === user1.id, `User 1 numericId (${user1.numericId}) === id (${user1.id})`);
  assert(user2.numericId === user2.id, `User 2 numericId (${user2.numericId}) === id (${user2.id})`);
  assert(user3.numericId === user3.id, `User 3 numericId (${user3.numericId}) === id (${user3.id})`);

  // Sequential ordering
  assert(user2.numericId > user1.numericId, `User 2 ID (${user2.numericId}) > User 1 ID (${user1.numericId})`);
  assert(user3.numericId > user2.numericId, `User 3 ID (${user3.numericId}) > User 2 ID (${user2.numericId})`);

  // No old 100001-style IDs
  assert(user1.numericId < 100000, `User 1 ID (${user1.numericId}) is sequential (not 100001-style)`);

  return { user1Id: user1.id, user2Id: user2.id, user3Id: user3.id };
}

async function testLoginPreservesId() {
  console.log('\n📋 TEST 2: Login Returns Same Account (No New ID)');
  console.log('─'.repeat(50));

  // Login with same credentials
  const loginResult = await AuthService.login({
    username: 'seq_test_user_1',
    password: 'TestPass123!',
  });

  const dbUser = await prisma.user.findUnique({
    where: { username: 'seq_test_user_1' },
    select: { id: true, numericId: true },
  });

  console.log(`  Login result: id=${loginResult.user.id}, numericId=${loginResult.user.numericId}`);
  console.log(`  DB record:    id=${dbUser?.id}, numericId=${dbUser?.numericId}`);

  assert(loginResult.user.numericId === dbUser?.numericId, 'Login returns same numericId as DB');
  assert(loginResult.user.id === dbUser?.id, 'Login returns same internal id as DB');
  assert(dbUser?.id === dbUser?.numericId, 'DB: id still equals numericId after login');
}

async function testGoogleLoginCreatesSequentialId() {
  console.log('\n📋 TEST 3: Google Login Creates Sequential ID');
  console.log('─'.repeat(50));

  const googleResult = await AuthService.googleLogin({
    googleSubjectId: 'google_seq_test_sub_1',
    email: 'seq_google@test.com',
    displayName: 'Google Test User',
  });

  const googleUser = googleResult.user;
  console.log(`  Google User: id=${googleUser.id}, numericId=${googleUser.numericId}`);

  assert(googleUser.numericId === googleUser.id, `Google user numericId (${googleUser.numericId}) === id (${googleUser.id})`);
  assert(googleUser.numericId < 100000, `Google user ID (${googleUser.numericId}) is sequential (not 100001-style)`);

  return googleUser;
}

async function testGoogleReLoginPreservesId(originalGoogleUser: any) {
  console.log('\n📋 TEST 4: Google Re-Login Returns Same Account');
  console.log('─'.repeat(50));

  // Wait 1.5s so JWT timestamp differs (avoids session token uniqueness collision)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const reloginResult = await AuthService.googleLogin({
    googleSubjectId: 'google_seq_test_sub_1',
    email: 'seq_google@test.com',
    displayName: 'Google Test User',
  });

  const reloginUser = reloginResult.user;
  console.log(`  Original: id=${originalGoogleUser.id}, numericId=${originalGoogleUser.numericId}`);
  console.log(`  Re-Login: id=${reloginUser.id}, numericId=${reloginUser.numericId}`);

  assert(reloginUser.id === originalGoogleUser.id, 'Google re-login returns same internal id');
  assert(reloginUser.numericId === originalGoogleUser.numericId, 'Google re-login returns same numericId');
}

async function testDeletedIdNeverReused() {
  console.log('\n📋 TEST 5: Deleted User ID is NEVER Reused');
  console.log('─'.repeat(50));

  // Create a user to delete
  const toDelete = await AuthService.register({
    username: 'seq_test_deleted',
    email: 'seq_deleted@test.com',
    password: 'TestPass123!',
  });

  const deletedId = toDelete.user.numericId;
  const deletedInternalId = toDelete.user.id;
  console.log(`  Created user to delete: id=${deletedInternalId}, numericId=${deletedId}`);

  // Delete the user
  await prisma.user.delete({ where: { id: deletedInternalId } });
  console.log(`  Deleted user with numericId=${deletedId}`);

  // Create a new user after deletion
  const afterDelete = await AuthService.register({
    username: 'seq_test_after_delete',
    email: 'seq_after_delete@test.com',
    password: 'TestPass123!',
  });

  const newId = afterDelete.user.numericId;
  console.log(`  New user after deletion: numericId=${newId}`);

  assert(newId !== deletedId, `New ID (${newId}) is NOT the deleted ID (${deletedId})`);
  assert(newId > deletedId, `New ID (${newId}) > deleted ID (${deletedId}) — IDs never go backward`);
  assert(newId === afterDelete.user.id, `New user numericId (${newId}) === id (${afterDelete.user.id})`);
}

async function testAllExistingUsersConsistent() {
  console.log('\n📋 TEST 6: All Users in Database Have numericId = id');
  console.log('─'.repeat(50));

  const allUsers = await prisma.user.findMany({
    select: { id: true, numericId: true, username: true },
    orderBy: { id: 'asc' },
  });

  let allMatch = true;
  for (const u of allUsers) {
    const match = u.id === u.numericId;
    if (!match) {
      console.log(`  ❌ MISMATCH: id=${u.id} numericId=${u.numericId} username="${u.username}"`);
      allMatch = false;
    }
  }

  assert(allMatch, `All ${allUsers.length} users have numericId === id`);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Run all tests
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function runAllTests() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  E2E TEST: Sequential Permanent User ID System        ║');
  console.log('║  Verifying numericId = id (1, 2, 3, 4...)            ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  await cleanup();

  try {
    await testSequentialRegistration();
    await testLoginPreservesId();
    const googleUser = await testGoogleLoginCreatesSequentialId();
    await testGoogleReLoginPreservesId(googleUser);
    await testDeletedIdNeverReused();
    await testAllExistingUsersConsistent();
  } catch (err: any) {
    console.error('\n💥 UNEXPECTED ERROR:', err.message);
    failed++;
  }

  await cleanup();

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log(`║  RESULTS: ${passed} PASSED / ${failed} FAILED                        ║`);
  if (failed === 0) {
    console.log('║  🎉 ALL TESTS PASSED — Sequential User IDs Working!  ║');
  } else {
    console.log('║  ❌ SOME TESTS FAILED — Review output above.         ║');
  }
  console.log('╚════════════════════════════════════════════════════════╝');

  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runAllTests();
