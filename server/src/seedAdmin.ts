import { prisma } from './config/database.js';
import { hashPassword } from './utils/hash.js';
import { ENV } from './config/env.js';

async function seedAdmin() {
  const adminEmail = ENV.ADMIN_INITIAL_EMAIL || 'admin@auralive.io';
  const adminPassword = ENV.ADMIN_INITIAL_PASSWORD || 'Password123!';
  const defaultPasswordHash = await hashPassword('Password123!');

  // 1. Seed Super Admin
  const adminExisting = await prisma.user.findFirst({
    where: { OR: [{ email: adminEmail }, { username: 'Admin_Master' }] },
  });

  if (!adminExisting) {
    const adminPasswordHash = await hashPassword(adminPassword);
    await prisma.user.create({
      data: {
        numericId: 999999,
        username: 'Admin_Master',
        email: adminEmail,
        passwordHash: adminPasswordHash,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        coins: 10000000,
        diamonds: 5000000,
        bio: 'Master Enterprise System Administrator 🛡️',
        country: 'Pakistan',
      },
    });
    console.log(`👑 Super Admin Initialized (UID: 999999, Username: Admin_Master, Pass: Password123!)`);
  }

  // 2. Seed Standard Initial Registered User Accounts (Username + Password)
  const initialUsers = [
    { numericId: 100001, username: 'User_100001', email: 'user100001@auralive.io', role: 'DIAMOND_RESELLER', coins: 50000, diamonds: 100000 },
    { numericId: 100002, username: 'User_100002', email: 'user100002@auralive.io', role: 'USER', coins: 25000, diamonds: 50000 },
    { numericId: 100003, username: 'User_100003', email: 'user100003@auralive.io', role: 'USER', coins: 15000, diamonds: 10000 },
  ];

  for (const u of initialUsers) {
    const exists = await prisma.user.findFirst({
      where: { OR: [{ numericId: u.numericId }, { username: u.username }] },
    });

    if (!exists) {
      await prisma.user.create({
        data: {
          numericId: u.numericId,
          username: u.username,
          email: u.email,
          passwordHash: defaultPasswordHash,
          role: u.role,
          status: 'ACTIVE',
          coins: u.coins,
          diamonds: u.diamonds,
          bio: 'Registered Aura Live Username + Password Account ✨',
          country: 'Pakistan',
        },
      });
      console.log(`👤 Initial User Account Created: ${u.username} (UID: ${u.numericId}, Pass: Password123!)`);
    } else {
      // Ensure password hash is updated to Password123! if requested
      await prisma.user.update({
        where: { id: exists.id },
        data: { passwordHash: defaultPasswordHash },
      });
    }
  }
}

seedAdmin()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
