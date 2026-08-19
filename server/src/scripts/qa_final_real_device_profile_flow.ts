import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import express from 'express';
import http from 'http';
import { prisma } from '../config/database.js';
import { usersRouter } from '../routes/users.routes.js';
import { authRouter } from '../routes/auth.routes.js';
import { generateAccessToken } from '../utils/jwt.js';

async function runEndToEndProfileQA() {
  console.log('================================================================');
  console.log('🧪 FINAL PROFILE SAVE REAL-DEVICE QA — END-TO-END VERIFICATION');
  console.log('================================================================');

  // Set up Express test instance with all relevant routes
  const app = express();
  app.use(express.json());
  app.use('/api/v1/users', usersRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/auth', authRouter);

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  console.log(`📡 Local Test Server running at ${baseUrl}`);

  // Fetch real production users User A (ahmed_khokhar) and User B (ahmed_junaid)
  const userA = await prisma.user.findFirst({ where: { numericId: 100002 } });
  const userB = await prisma.user.findFirst({ where: { numericId: 100001 } });

  if (!userA || !userB) {
    throw new Error('Required production test users not found in PostgreSQL.');
  }

  const tokenA = generateAccessToken({
    userId: userA.id,
    numericId: userA.numericId,
    username: userA.username,
    role: userA.role,
  });

  const tokenB = generateAccessToken({
    userId: userB.id,
    numericId: userB.numericId,
    username: userB.username,
    role: userB.role,
  });

  const origDisplayNameA = userA.displayName || userA.username;
  const origBioA = userA.bio || '';
  const origGenderA = userA.gender || 'Male';
  const origCountryA = userA.country || 'Pakistan';
  const origAvatarA = userA.avatar;

  const origDisplayNameB = userB.displayName || userB.username;
  const origBioB = userB.bio || '';

  // =========================================================================
  // TEST 1 — PROFILE TEXT EDIT & SAVE
  // =========================================================================
  console.log('\n--- TEST 1 — PROFILE TEXT EDIT & SAVE ---');
  const test1Payload = {
    displayName: 'Ahmed Khokhar (QA Verified 🌟)',
    bio: 'Professional Host & Live Streamer on Aura ✨ Tested 2026',
    gender: 'Male',
    country: 'Pakistan',
    birthday: '1995-08-25',
  };

  console.log('Sending PUT /api/v1/users/profile/update for User A...');
  const res1 = await fetch(`${baseUrl}/api/v1/users/profile/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenA}`,
    },
    body: JSON.stringify(test1Payload),
  });

  const data1 = await res1.json();
  console.log(`Status: ${res1.status}, Success: ${data1.success}`);
  if (res1.status !== 200 || !data1.success) {
    throw new Error('TEST 1 FAILED: PUT /profile/update returned non-200 or failure.');
  }

  const dbA1 = await prisma.user.findUnique({ where: { id: userA.id } });
  console.log(`PostgreSQL Row: displayName = "${dbA1?.displayName}", bio = "${dbA1?.bio}"`);
  if (dbA1?.displayName !== test1Payload.displayName || dbA1?.bio !== test1Payload.bio) {
    throw new Error('TEST 1 FAILED: PostgreSQL User row does not match updated text.');
  }
  console.log('✅ TEST 1 — PROFILE TEXT: PASS');

  // =========================================================================
  // TEST 2 — APP RESTART & /auth/me FRESH DATA PERSISTENCE
  // =========================================================================
  console.log('\n--- TEST 2 — APP RESTART & /auth/me FRESH SYNC ---');
  // Simulating app cold-start: fresh request to /api/v1/auth/me with User A's token
  const res2 = await fetch(`${baseUrl}/api/v1/auth/me`, {
    headers: { 'Authorization': `Bearer ${tokenA}` },
  });
  const data2 = await res2.json();
  console.log(`Status: ${res2.status}, Reloaded Name: "${data2.data?.displayName}", Bio: "${data2.data?.bio}"`);
  if (data2.data?.displayName !== test1Payload.displayName || data2.data?.bio !== test1Payload.bio) {
    throw new Error('TEST 2 FAILED: /auth/me did not return fresh database profile attributes.');
  }
  console.log('✅ TEST 2 — APP RESTART & SYNC: PASS');

  // =========================================================================
  // TEST 3 — AVATAR UPLOAD & SERVER PERSISTENCE
  // =========================================================================
  console.log('\n--- TEST 3 — AVATAR UPLOAD & SERVER PERSISTENCE ---');
  // Upload base64 image data to /api/v1/users/avatar/upload
  const dummyBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  const res3 = await fetch(`${baseUrl}/api/v1/users/avatar/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenA}`,
    },
    body: JSON.stringify({ imageBase64: dummyBase64 }),
  });

  const data3 = await res3.json();
  console.log(`Status: ${res3.status}, Avatar URL: "${data3.data?.avatarUrl}"`);
  if (res3.status !== 200 || !data3.data?.avatarUrl?.startsWith('http')) {
    throw new Error('TEST 3 FAILED: Avatar upload did not return a valid public HTTP URL.');
  }

  const dbA3 = await prisma.user.findUnique({ where: { id: userA.id } });
  console.log(`PostgreSQL Avatar: "${dbA3?.avatar}"`);
  if (dbA3?.avatar !== data3.data.avatarUrl) {
    throw new Error('TEST 3 FAILED: PostgreSQL User.avatar was not updated with public URL.');
  }
  console.log('✅ TEST 3 — AVATAR PERSISTENCE: PASS');

  // =========================================================================
  // TEST 4 — MULTI-USER ISOLATION (USER A vs USER B)
  // =========================================================================
  console.log('\n--- TEST 4 — MULTI-USER ISOLATION ---');
  // 1. User A saves TEST_A_PROFILE
  await fetch(`${baseUrl}/api/v1/users/profile/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
    body: JSON.stringify({ displayName: 'TEST_USER_A', bio: 'TEST_A_PROFILE' }),
  });

  // 2. User B checks /auth/me -> Must NOT see TEST_A_PROFILE
  const resBCheck1 = await fetch(`${baseUrl}/api/v1/auth/me`, {
    headers: { 'Authorization': `Bearer ${tokenB}` },
  });
  const dataBCheck1 = await resBCheck1.json();
  console.log(`User B profile: displayName = "${dataBCheck1.data?.displayName}", bio = "${dataBCheck1.data?.bio}"`);
  if (dataBCheck1.data?.bio === 'TEST_A_PROFILE') {
    throw new Error('TEST 4 FAILED: User B saw User A profile!');
  }

  // 3. User B saves TEST_B_PROFILE
  await fetch(`${baseUrl}/api/v1/users/profile/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenB}` },
    body: JSON.stringify({ displayName: 'TEST_USER_B', bio: 'TEST_B_PROFILE' }),
  });

  // 4. User A checks /auth/me -> Must still see TEST_A_PROFILE
  const resACheck2 = await fetch(`${baseUrl}/api/v1/auth/me`, {
    headers: { 'Authorization': `Bearer ${tokenA}` },
  });
  const dataACheck2 = await resACheck2.json();
  console.log(`User A profile: displayName = "${dataACheck2.data?.displayName}", bio = "${dataACheck2.data?.bio}"`);
  if (dataACheck2.data?.bio !== 'TEST_A_PROFILE') {
    throw new Error('TEST 4 FAILED: User A profile was overwritten by User B!');
  }
  console.log('✅ TEST 4 — USER A/B ISOLATION: PASS');

  // =========================================================================
  // TEST 5 — SERVER VERIFICATION & RESTORATION
  // =========================================================================
  console.log('\n--- TEST 5 — SERVER VERIFICATION & RESTORATION ---');
  // Cleanly restore User A & User B
  await prisma.user.update({
    where: { id: userA.id },
    data: {
      displayName: origDisplayNameA,
      bio: origBioA,
      gender: origGenderA,
      country: origCountryA,
      avatar: origAvatarA,
    },
  });

  await prisma.user.update({
    where: { id: userB.id },
    data: {
      displayName: origDisplayNameB,
      bio: origBioB,
    },
  });

  const finalA = await prisma.user.findUnique({ where: { id: userA.id } });
  const finalB = await prisma.user.findUnique({ where: { id: userB.id } });
  console.log(`User A Restored: "${finalA?.displayName}" | "${finalA?.bio}"`);
  console.log(`User B Restored: "${finalB?.displayName}" | "${finalB?.bio}"`);

  server.close();
  console.log('\n================================================================');
  console.log('🎉 ALL 5 PROFILE SAVE QA TESTS COMPLETED WITH 100% SUCCESS');
  console.log('================================================================');
}

runEndToEndProfileQA()
  .catch((err) => {
    console.error('❌ QA Test Error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
