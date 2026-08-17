import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import { PrismaClient } from '@prisma/client';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

const prisma = new PrismaClient();

async function checkApiOutputs() {
  console.log('================================================================');
  console.log('🔍 CHECKING BACKEND USER SERVICE & AUTH SERVICE OUTPUTS');
  console.log('================================================================\n');

  // Check numericId 100002
  console.log('--- 1. Checking numericId 100002 in UserService.getUserProfile ---');
  const profile100002 = await UserService.getUserProfile(100002);
  console.log('Profile 100002 Result:');
  console.log(JSON.stringify(profile100002, null, 2));

  // Check login for host@auralive.com (which has numericId 100002)
  console.log('\n--- 2. Checking Login for user with numericId 100002 (ahmed_khokhar) ---');
  const user100002 = await prisma.user.findUnique({
    where: { numericId: 100002 }
  });
  console.log('DB Record for 100002:', user100002 ? {
    id: user100002.id,
    numericId: user100002.numericId,
    username: user100002.username,
    displayName: user100002.displayName,
    email: user100002.email,
    role: user100002.role,
  } : 'NOT FOUND');

  // Check all current users in DB
  console.log('\n--- 3. All Current Users in PostgreSQL ---');
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      numericId: true,
      username: true,
      displayName: true,
      email: true,
      role: true,
    },
    orderBy: { id: 'asc' }
  });
  console.table(allUsers);
}

checkApiOutputs().finally(() => prisma.$disconnect());
