import { prisma } from './config/database.js';
import { hashPassword } from './utils/hash.js';
import { ENV } from './config/env.js';

async function seedAdmin() {
  const adminEmail = ENV.ADMIN_INITIAL_EMAIL;
  const adminPassword = ENV.ADMIN_INITIAL_PASSWORD;

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: adminEmail }, { username: 'Admin_Master' }],
    },
  });

  if (existing) {
    console.log(`✅ Admin already exists (UID: ${existing.numericId}, Email: ${existing.email})`);
    return;
  }

  const passwordHash = await hashPassword(adminPassword);

  const admin = await prisma.user.create({
    data: {
      numericId: 999999,
      username: 'Admin_Master',
      email: adminEmail,
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      coins: 10000000,
      diamonds: 5000000,
      bio: 'Master Enterprise System Administrator 🛡️',
      country: 'Pakistan',
    },
  });

  console.log(`👑 Super Admin Initialized: ${admin.email} (UID: ${admin.numericId})`);
}

seedAdmin()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
