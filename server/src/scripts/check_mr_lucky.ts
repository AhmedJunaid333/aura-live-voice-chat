import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkMrLucky() {
  console.log('================================================================');
  console.log('🔍 SEARCHING DATABASE FOR "Mr lucky" OR SIMILAR USERS');
  console.log('================================================================\n');

  // Search by username, displayName, bio
  const matches = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: 'lucky', mode: 'insensitive' } },
        { displayName: { contains: 'lucky', mode: 'insensitive' } },
        { username: { contains: 'mr', mode: 'insensitive' } },
        { displayName: { contains: 'mr', mode: 'insensitive' } },
        { numericId: 100002 },
      ]
    },
    select: {
      id: true,
      numericId: true,
      username: true,
      displayName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  console.log('--- MATCHING USERS IN DATABASE ---');
  console.table(matches);

  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      numericId: true,
      username: true,
      displayName: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { id: 'asc' }
  });

  console.log('\n--- ALL USERS CURRENTLY IN DATABASE ---');
  console.table(allUsers);
}

checkMrLucky().finally(() => prisma.$disconnect());
