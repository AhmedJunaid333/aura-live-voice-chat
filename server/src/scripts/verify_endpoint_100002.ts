import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import { PrismaClient } from '@prisma/client';
import { UserService } from '../services/user.service';
import assert from 'node:assert';

const prisma = new PrismaClient();

async function verifyEndpoint() {
  console.log('================================================================');
  console.log('🔍 VERIFYING BACKEND ENDPOINT /api/users/100002/profile');
  console.log('================================================================\n');

  // 1. Fetch Profile for 100002
  const profile = await UserService.getUserProfile(100002);
  console.log('Profile Output for 100002:');
  console.log(JSON.stringify(profile, null, 2));

  assert(profile, 'Profile for 100002 must exist in DB');
  assert.strictEqual(profile.numericId, 100002, 'numericId must be 100002');
  assert.strictEqual(profile.username, 'ahmed_khokhar', 'username must be ahmed_khokhar');
  assert.strictEqual(profile.displayName, 'Ahmed Khokhar 🌟', 'displayName must be Ahmed Khokhar 🌟');
  assert.notStrictEqual(profile.displayName, 'Mr lucky', 'displayName MUST NEVER be Mr lucky');

  console.log('\n✅ Verified: Backend profile returns authentic PostgreSQL user "ahmed_khokhar" (100002)');

  // 2. Verify sequence state
  const seqInfo = await prisma.$queryRaw<any[]>`
    SELECT schemaname, sequencename, start_value, min_value, max_value, increment_by, cycle, cache_size, last_value 
    FROM pg_sequences 
    WHERE sequencename = 'public_user_numeric_id_seq';
  `;
  console.log('\n--- Dedicated Public User ID Sequence Status ---');
  console.table(seqInfo);

  // 3. Verify real users in DB
  const users = await prisma.user.findMany({
    select: { id: true, numericId: true, username: true, displayName: true, email: true },
    orderBy: { id: 'asc' }
  });
  console.log(`\n--- Real Production Users in PostgreSQL (${users.length}) ---`);
  console.table(users);
}

verifyEndpoint().finally(() => prisma.$disconnect());
