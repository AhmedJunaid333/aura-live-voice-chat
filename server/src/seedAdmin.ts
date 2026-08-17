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

  // 2. Seed Standard Initial Registered User Accounts (no hard-coded numericIds — autoincrement from DB)
  const initialUsers = [
    { username: 'Test_Reseller', email: 'test_reseller@auralive.io', role: 'DIAMOND_RESELLER', coins: 50000, diamonds: 100000 },
    { username: 'Test_User_A', email: 'test_usera@auralive.io', role: 'USER', coins: 25000, diamonds: 50000 },
    { username: 'Test_User_B', email: 'test_userb@auralive.io', role: 'USER', coins: 15000, diamonds: 10000 },
  ];

  for (const u of initialUsers) {
    const exists = await prisma.user.findFirst({
      where: { OR: [{ email: u.email }, { username: u.username }] },
    });

    if (!exists) {
      // Use atomic transaction: create → set numericId = autoincrement id
      await prisma.$transaction(async (tx) => {
        const created = await tx.user.create({
          data: {
            numericId: -(Math.floor(Math.random() * 2000000000) + 1), // temporary placeholder
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
        await tx.user.update({
          where: { id: created.id },
          data: { numericId: created.id },
        });
        console.log(`👤 Seed User Created: ${u.username} (autoincrement numericId = ${created.id}, Pass: Password123!)`);
      });
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
