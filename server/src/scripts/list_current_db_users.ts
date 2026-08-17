import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, numericId: true, username: true, role: true, status: true, email: true, createdAt: true },
    orderBy: { id: 'asc' }
  });
  console.log('CURRENT USERS IN DB:');
  console.table(users);
}
main().finally(() => prisma.$disconnect());
