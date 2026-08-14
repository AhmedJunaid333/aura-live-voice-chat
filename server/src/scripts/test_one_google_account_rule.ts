import { prisma } from '../config/database.js';
import { AuthService } from '../services/auth.service.js';

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
  const testEmails = [
    'google_user_alpha@gmail.com',
    'google_user_beta@gmail.com',
    'concurrent_google_user@gmail.com',
  ];

  await prisma.user.deleteMany({
    where: {
      email: { in: testEmails },
    },
  });

  try {
    await (prisma as any).authAccount.deleteMany({
      where: {
        providerAccountId: {
          in: [
            'google_sub_alpha_123',
            'google_sub_beta_456',
            'concurrent_google_sub_789',
            'g_email_google_user_alpha@gmail.com',
            'g_email_google_user_beta@gmail.com',
            'g_email_concurrent_google_user@gmail.com',
          ],
        },
      },
    });
  } catch (_) {}
}

async function runTestSuite() {
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║  TEST SUITE: ONE GOOGLE / GMAIL ACCOUNT = ONE AURA LIVE ACCOUNT   ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');

  await cleanup();

  let accountA_ID: number = 0;
  let accountA_NumericId: number = 0;

  // ─────────────────────────────────────────────────────────────────
  // TEST 1: First-time Registration of Google Account A
  // ─────────────────────────────────────────────────────────────────
  console.log('📋 STEP 1: Register Google Account A (First Time)');
  console.log('─'.repeat(60));
  const regA = await AuthService.googleLogin({
    googleSubjectId: 'google_sub_alpha_123',
    email: 'google_user_alpha@gmail.com',
    displayName: 'Alpha Google User',
    avatar: 'https://cdn.auralive.io/avatar/alpha.png',
  });

  accountA_ID = regA.user.id;
  accountA_NumericId = regA.user.numericId;

  console.log(`  Created Account A: User ID = ${accountA_NumericId} (internal id=${accountA_ID})`);
  assert(accountA_NumericId > 0, `Account A created with valid numericId=${accountA_NumericId}`);
  assert(accountA_NumericId === accountA_ID, `Account A numericId (${accountA_NumericId}) === internal id (${accountA_ID})`);
  assert(regA.user.email === 'google_user_alpha@gmail.com', 'Account A email is saved properly');

  // ─────────────────────────────────────────────────────────────────
  // TEST 2: Logout Account A
  // ─────────────────────────────────────────────────────────────────
  console.log('\n📋 STEP 2: Logout Google Account A');
  console.log('─'.repeat(60));
  const logoutRes = await AuthService.logout(accountA_ID);
  assert(logoutRes === true, 'Account A logged out successfully');

  // ─────────────────────────────────────────────────────────────────
  // TEST 3: Attempt to Register Same Gmail/Google via /register -> MUST FAIL
  // ─────────────────────────────────────────────────────────────────
  console.log('\n📋 STEP 3: Attempt Second Registration with same Gmail -> MUST BE REJECTED');
  console.log('─'.repeat(60));
  let regDuplicateFailed = false;
  try {
    await AuthService.register({
      username: 'alpha_duplicate_attempt',
      email: 'google_user_alpha@gmail.com',
      password: 'Password123!',
    });
  } catch (err: any) {
    regDuplicateFailed = true;
    console.log(`  Rejected as expected: "${err.message}"`);
    assert(
      err.message.includes('ACCOUNT_ALREADY_EXISTS'),
      'Error message contains ACCOUNT_ALREADY_EXISTS'
    );
  }
  assert(regDuplicateFailed, 'Duplicate registration attempt with same Gmail was BLOCKED');

  // ─────────────────────────────────────────────────────────────────
  // TEST 4: Login Google Account A -> MUST Return SAME Account A (Same ID)
  // ─────────────────────────────────────────────────────────────────
  console.log('\n📋 STEP 4: Login with Google Account A');
  console.log('─'.repeat(60));
  const loginA1 = await AuthService.googleLogin({
    googleSubjectId: 'google_sub_alpha_123',
    email: 'google_user_alpha@gmail.com',
    displayName: 'Alpha Google User',
  });

  console.log(`  Login Result: User ID = ${loginA1.user.numericId} (internal id=${loginA1.user.id})`);
  assert(loginA1.user.id === accountA_ID, 'Login returns SAME internal id');
  assert(loginA1.user.numericId === accountA_NumericId, `Login returns SAME User ID (${accountA_NumericId}), NOT a new ID`);
  assert(loginA1.user.email === 'google_user_alpha@gmail.com', 'Login returned same profile email');

  // ─────────────────────────────────────────────────────────────────
  // TEST 5: Login Google Account A Again -> MUST Return SAME Account A
  // ─────────────────────────────────────────────────────────────────
  console.log('\n📋 STEP 5: Login with Google Account A Again (Repeated Login)');
  console.log('─'.repeat(60));
  const loginA2 = await AuthService.googleLogin({
    googleSubjectId: 'google_sub_alpha_123',
    email: 'google_user_alpha@gmail.com',
  });

  assert(loginA2.user.id === accountA_ID, 'Repeated login returns SAME internal id');
  assert(loginA2.user.numericId === accountA_NumericId, `Repeated login returns SAME User ID (${accountA_NumericId})`);

  // ─────────────────────────────────────────────────────────────────
  // TEST 6: Register Different Google Account B -> MUST Receive Different ID
  // ─────────────────────────────────────────────────────────────────
  console.log('\n📋 STEP 6: Create Google Account B -> MUST Receive Different ID');
  console.log('─'.repeat(60));
  const regB = await AuthService.googleLogin({
    googleSubjectId: 'google_sub_beta_456',
    email: 'google_user_beta@gmail.com',
    displayName: 'Beta Google User',
  });

  const accountB_ID = regB.user.id;
  const accountB_NumericId = regB.user.numericId;

  console.log(`  Account B: User ID = ${accountB_NumericId} (internal id=${accountB_ID})`);
  assert(accountB_NumericId !== accountA_NumericId, `Account B User ID (${accountB_NumericId}) !== Account A ID (${accountA_NumericId})`);
  assert(accountB_NumericId > accountA_NumericId, `Account B received sequential next ID (${accountB_NumericId} > ${accountA_NumericId})`);

  // ─────────────────────────────────────────────────────────────────
  // TEST 7: Database Verification -> No Duplicate Gmail Accounts
  // ─────────────────────────────────────────────────────────────────
  console.log('\n📋 STEP 7: Verify Database Integrity (No Duplicates)');
  console.log('─'.repeat(60));
  const matchingUsersA = await prisma.user.findMany({
    where: { email: 'google_user_alpha@gmail.com' },
  });
  assert(matchingUsersA.length === 1, `Exactly 1 user record in DB for google_user_alpha@gmail.com (found: ${matchingUsersA.length})`);

  const matchingUsersB = await prisma.user.findMany({
    where: { email: 'google_user_beta@gmail.com' },
  });
  assert(matchingUsersB.length === 1, `Exactly 1 user record in DB for google_user_beta@gmail.com (found: ${matchingUsersB.length})`);

  const matchingAuthAccountsA = await (prisma as any).authAccount.findMany({
    where: { providerAccountId: 'google_sub_alpha_123' },
  });
  assert(matchingAuthAccountsA.length === 1, `Exactly 1 AuthAccount record in DB for google_sub_alpha_123 (found: ${matchingAuthAccountsA.length})`);

  // ─────────────────────────────────────────────────────────────────
  // TEST 8: Concurrent Registration Collision Test
  // ─────────────────────────────────────────────────────────────────
  console.log('\n📋 STEP 8: High Concurrency Collision Test (5 Simultaneous Google Logins)');
  console.log('─'.repeat(60));
  const concurrentPromises = Array.from({ length: 5 }).map((_, idx) =>
    AuthService.googleLogin({
      googleSubjectId: 'concurrent_google_sub_789',
      email: 'concurrent_google_user@gmail.com',
      displayName: `Concurrent User Try ${idx + 1}`,
    })
  );

  const concurrentResults = await Promise.all(concurrentPromises);
  const distinctUserIds = new Set(concurrentResults.map((r) => r.user.numericId));
  const distinctDbIds = new Set(concurrentResults.map((r) => r.user.id));

  console.log(`  5 Concurrent Requests Returned User IDs: [${concurrentResults.map((r) => r.user.numericId).join(', ')}]`);
  assert(distinctUserIds.size === 1, `All 5 concurrent requests returned the EXACT SAME User ID (${Array.from(distinctUserIds)[0]})`);
  assert(distinctDbIds.size === 1, `All 5 concurrent requests mapped to the EXACT SAME DB record (${Array.from(distinctDbIds)[0]})`);

  const concurrentDbUsers = await prisma.user.findMany({
    where: { email: 'concurrent_google_user@gmail.com' },
  });
  assert(concurrentDbUsers.length === 1, `Exactly 1 user created in DB under concurrency (found: ${concurrentDbUsers.length})`);

  await cleanup();

  console.log('\n╔════════════════════════════════════════════════════════════════════╗');
  console.log(`║  TEST RESULTS: ${passed} PASSED / ${failed} FAILED                                ║`);
  if (failed === 0) {
    console.log('║  🎉 ALL TESTS PASSED: ONE GOOGLE ACCOUNT = ONE AURA LIVE ACCOUNT  ║');
  } else {
    console.log('║  ❌ TEST FAILURES DETECTED!                                      ║');
  }
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');

  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runTestSuite();
