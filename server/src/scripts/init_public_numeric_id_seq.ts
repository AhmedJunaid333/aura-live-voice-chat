import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function initSequence() {
  console.log('Checking / Initializing dedicated PostgreSQL sequence "public_user_numeric_id_seq"...');
  
  // Create or reset sequence to 1
  await prisma.$executeRawUnsafe(`CREATE SEQUENCE IF NOT EXISTS "public_user_numeric_id_seq" START WITH 1 INCREMENT BY 1;`);
  
  // Check lowest available positive integer for numericId
  const usedNumericIds = (await prisma.user.findMany({ select: { numericId: true } })).map(u => u.numericId);
  console.log('Currently used numericIds in DB:', usedNumericIds);

  // If 1 is not used, reset sequence to 1
  let firstAvailable = 1;
  while (usedNumericIds.includes(firstAvailable)) {
    firstAvailable++;
  }
  console.log(`First available public numericId: ${firstAvailable}`);

  // Set sequence to restart at firstAvailable
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "public_user_numeric_id_seq" RESTART WITH ${firstAvailable};`);
  console.log(`✅ Sequence "public_user_numeric_id_seq" initialized to start at: ${firstAvailable}`);
}

initSequence().finally(() => prisma.$disconnect());
