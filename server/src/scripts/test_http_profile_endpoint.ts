import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import express from 'express';
import http from 'http';
import { prisma } from '../config/database.js';
import { usersRouter } from '../routes/users.routes.js';
import { authRouter } from '../routes/auth.routes.js';
import { generateAccessToken } from '../utils/jwt.js';

async function testHttpProfileEndpoint() {
  console.log('================================================================');
  console.log('🌐 HTTP API ENDPOINT TEST: PUT /api/v1/users/profile/update & GET /api/v1/auth/me');
  console.log('================================================================');

  // Set up test express app
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

  const user = await prisma.user.findFirst({
    where: { numericId: 100002 },
  });
  if (!user) throw new Error('User 100002 not found');

  const token = generateAccessToken({
    userId: user.id,
    numericId: user.numericId,
    username: user.username,
    role: user.role,
  });

  const originalDisplayName = user.displayName || user.username;
  const originalBio = user.bio || '';

  // 1. Send HTTP PUT /api/v1/users/profile/update
  const putPayload = {
    displayName: 'Ahmed Khokhar (HTTP Verified)',
    bio: 'Profile saved successfully through HTTP PUT pipeline! 🚀',
    gender: 'Male',
    country: 'Pakistan',
    birthday: '1995-10-15',
  };

  console.log('\n[1] SENDING HTTP PUT /api/v1/users/profile/update ...');
  const putRes = await fetch(`${baseUrl}/api/v1/users/profile/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(putPayload),
  });

  const putData = await putRes.json();
  console.log(`HTTP Status: ${putRes.status}`);
  console.log('Response JSON:', JSON.stringify(putData, null, 2));

  if (putRes.status !== 200 || !putData.success) {
    throw new Error('HTTP PUT /profile/update failed!');
  }

  // 2. Direct PostgreSQL Query
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, numericId: true, displayName: true, bio: true, gender: true, country: true, birthday: true },
  });
  console.log('\n[2] DIRECT POSTGRESQL QUERY CONFIRMATION:');
  console.table([dbUser]);

  if (dbUser?.displayName !== putPayload.displayName || dbUser?.bio !== putPayload.bio) {
    throw new Error('Database value mismatch after HTTP PUT!');
  }

  // 3. Send HTTP GET /api/v1/auth/me
  console.log('\n[3] SENDING HTTP GET /api/v1/auth/me ...');
  const meRes = await fetch(`${baseUrl}/api/v1/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const meData = await meRes.json();
  console.log(`HTTP Status: ${meRes.status}`);
  console.log('Response JSON:', JSON.stringify(meData, null, 2));

  if (meRes.status !== 200 || meData.data?.displayName !== putPayload.displayName) {
    throw new Error('HTTP GET /auth/me failed to return updated profile!');
  }

  // 4. Send HTTP GET /api/v1/users/100002/profile
  console.log('\n[4] SENDING HTTP GET /api/v1/users/100002/profile ...');
  const profRes = await fetch(`${baseUrl}/api/v1/users/100002/profile`);
  const profData = await profRes.json();
  console.log(`HTTP Status: ${profRes.status}`);
  console.log('Public Profile Display Name:', profData.data?.displayName);
  console.log('Public Profile Bio:', profData.data?.bio);

  if (profRes.status !== 200 || profData.data?.displayName !== putPayload.displayName) {
    throw new Error('HTTP GET /users/:id/profile failed to return updated profile!');
  }

  // Restore DB
  await prisma.user.update({
    where: { id: user.id },
    data: { displayName: originalDisplayName, bio: originalBio },
  });

  server.close();
  console.log('\n================================================================');
  console.log('🎉 ALL HTTP API & POSTGRESQL TESTS COMPLETED WITH 100% SUCCESS');
  console.log('================================================================');
}

testHttpProfileEndpoint()
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
