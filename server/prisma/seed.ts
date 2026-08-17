import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 [Seed] Starting database seed for Neon PostgreSQL...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Seed Super Admin
  const admin = await prisma.user.upsert({
    where: { numericId: 100000 },
    update: {},
    create: {
      numericId: 100000,
      username: 'admin',
      displayName: 'Aura Super Admin 👑',
      email: 'admin@auralive.com',
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      level: 50,
      vipTier: 10,
      coins: 10000000,
      diamonds: 10000000,
      gender: 'Male',
      bio: 'Official Aura Live Platform Executive Admin',
      country: 'Pakistan',
      countryCode: 'PK',
    },
  });
  console.log('✅ Super Admin created:', admin.username, admin.numericId);

  // 2. Seed Primary User 100001 - Ahmed Junaid
  const user1 = await prisma.user.upsert({
    where: { numericId: 100001 },
    update: {
      displayName: 'Ahmed Junaid ✨',
      username: 'ahmed_junaid',
    },
    create: {
      numericId: 100001,
      username: 'ahmed_junaid',
      displayName: 'Ahmed Junaid ✨',
      email: 'ahmed.junaid@auralive.com',
      passwordHash,
      role: 'USER',
      status: 'ACTIVE',
      level: 15,
      vipTier: 5,
      coins: 500000,
      diamonds: 500000,
      gender: 'Male',
      bio: 'Aura Live VIP Broadcaster & Founder ✨',
      country: 'Pakistan',
      countryCode: 'PK',
    },
  });
  console.log('✅ Primary User created:', user1.displayName, user1.numericId);

  // 3. Seed Second User 100002 - Ahmed Khokhar
  const user2 = await prisma.user.upsert({
    where: { numericId: 100002 },
    update: {
      displayName: 'Ahmed Khokhar 🌟',
      username: 'ahmed_khokhar',
    },
    create: {
      numericId: 100002,
      username: 'ahmed_khokhar',
      displayName: 'Ahmed Khokhar 🌟',
      email: 'ahmed.khokhar@auralive.com',
      passwordHash,
      role: 'USER',
      status: 'ACTIVE',
      level: 10,
      vipTier: 3,
      coins: 250000,
      diamonds: 250000,
      gender: 'Male',
      bio: 'Aura Live Elite VIP Member 🌟',
      country: 'Pakistan',
      countryCode: 'PK',
    },
  });
  console.log('✅ Second User created:', user2.displayName, user2.numericId);

  // 4. Seed Host User 100003 - Aura Host Star
  const host1 = await prisma.user.upsert({
    where: { numericId: 100003 },
    update: {},
    create: {
      numericId: 100003,
      username: 'host_star_100003',
      displayName: 'Aura Host Star 🎙️',
      email: 'host.star@auralive.com',
      passwordHash,
      role: 'HOST',
      status: 'ACTIVE',
      level: 10,
      vipTier: 2,
      coins: 100000,
      diamonds: 100000,
      gender: 'Female',
      bio: 'Official Aura Live Featured Audio Host 🎙️',
      country: 'Pakistan',
      countryCode: 'PK',
    },
  });
  console.log('✅ Host User created:', host1.displayName, host1.numericId);

  // 4. Seed Reseller Account for 100001
  await prisma.resellerAccount.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
      resellerCode: 'RESELL-100001',
      displayName: 'Ahmed Official Diamond Merchant',
      role: 'DIAMOND_RESELLER',
      status: 'ACTIVE',
      diamondBalance: 500000,
      diamondsReceived: 500000,
      diamondsSent: 0,
      whatsappNumber: '+923001234567',
      phone: '+923001234567',
      minPurchase: 10000,
      startingRate: '10,000 Diamonds = Rs. 1,500',
      paymentMethods: 'Easypaisa, JazzCash, Bank Transfer',
      isVerified: true,
    },
  });
  console.log('✅ Reseller Account created for user 100001');

  // 5. Seed Default Avatar Frames
  const defaultFrames = [
    {
      id: 'FRM-101',
      name: '👑 Royal Emperor Crown Frame',
      description: 'Imperial gold crown adorned with shimmering diamonds for sovereign royalty.',
      slug: 'royal-emperor-crown',
      assetUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=60',
      thumbnailUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150&auto=format&fit=crop&q=60',
      previewUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=60',
      animationType: 'svga',
      category: 'LUXURY',
      price: 15000,
      currency: 'DIAMOND',
      durationDays: 30,
      isPermanent: false,
      requiredVipLevel: 3,
      requiredUserLevel: 10,
      rarity: 'LEGENDARY',
      status: 'ACTIVE',
      isFeatured: true,
      sortOrder: 1,
    },
    {
      id: 'FRM-102',
      name: '🔥 Cyber Neon Wings Frame',
      description: 'Electric violet wings radiating pulsed cybernetic plasma waves.',
      slug: 'cyber-neon-wings',
      assetUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60',
      previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
      animationType: 'lottie',
      category: 'PREMIUM',
      price: 8000,
      currency: 'DIAMOND',
      durationDays: 30,
      isPermanent: false,
      requiredVipLevel: 1,
      requiredUserLevel: 5,
      rarity: 'EPIC',
      status: 'ACTIVE',
      isFeatured: true,
      sortOrder: 2,
    },
    {
      id: 'FRM-103',
      name: '🐉 Golden Dragon Sovereign Frame',
      description: 'Legendary mythical golden dragon circling the avatar with eternal dragon breath.',
      slug: 'golden-dragon-sovereign',
      assetUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60',
      thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=60',
      previewUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60',
      animationType: 'svga',
      category: 'LUXURY',
      price: 50000,
      currency: 'DIAMOND',
      durationDays: null,
      isPermanent: true,
      requiredVipLevel: 5,
      requiredUserLevel: 20,
      rarity: 'MYTHIC',
      status: 'ACTIVE',
      isFeatured: true,
      sortOrder: 3,
    },
    {
      id: 'FRM-104',
      name: '✨ Neon Rose Halo Frame',
      description: 'Soft glowing neon rose petals creating a gentle romantic ambiance.',
      slug: 'neon-rose-halo',
      assetUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=60',
      thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=150&auto=format&fit=crop&q=60',
      previewUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=60',
      animationType: 'static',
      category: 'CLASSIC',
      price: 3000,
      currency: 'DIAMOND',
      durationDays: 30,
      isPermanent: false,
      requiredVipLevel: 0,
      requiredUserLevel: 1,
      rarity: 'RARE',
      status: 'ACTIVE',
      isFeatured: false,
      sortOrder: 4,
    },
    {
      id: 'FRM-105',
      name: '🇵🇰 Crescent Gold National Frame',
      description: 'Golden national crest with emerald star and crescent moon emblem.',
      slug: 'crescent-gold-national',
      assetUrl: 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=500&auto=format&fit=crop&q=60',
      thumbnailUrl: 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=150&auto=format&fit=crop&q=60',
      previewUrl: 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=500&auto=format&fit=crop&q=60',
      animationType: 'static',
      category: 'COUNTRY',
      price: 5000,
      currency: 'DIAMOND',
      durationDays: 30,
      isPermanent: false,
      requiredVipLevel: 0,
      requiredUserLevel: 1,
      countryAvailability: JSON.stringify(['PK']),
      rarity: 'RARE',
      status: 'ACTIVE',
      isFeatured: false,
      sortOrder: 5,
    },
  ];

  for (const frame of defaultFrames) {
    await prisma.avatarFrame.upsert({
      where: { slug: frame.slug },
      update: {},
      create: frame,
    });
  }
  console.log(`✅ Seeded ${defaultFrames.length} Avatar Frames`);

  // 6. Give User 100001 active ownership of the Royal Crown Frame
  const royalFrame = await prisma.avatarFrame.findUnique({ where: { slug: 'royal-emperor-crown' } });
  if (royalFrame) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await prisma.avatarFrameOwnership.upsert({
      where: { id: `OWN-${user1.id}-${royalFrame.id}` },
      update: {},
      create: {
        id: `OWN-${user1.id}-${royalFrame.id}`,
        userId: user1.id,
        frameId: royalFrame.id,
        source: 'ADMIN_GRANT',
        status: 'ACTIVE',
        isEquipped: true,
        acquiredAt: new Date(),
        expiresAt,
      },
    });
    console.log('✅ Equipped Royal Emperor Crown frame for User 100001');
  }

  // 7. Seed 12 Luxury Virtual Gifts
  const gifts = [
    { id: 'GIFT-101', name: 'Red Rose', icon: '🌹', costCoins: 10, rewardDiamonds: 7, category: 'Popular', animationType: 'ROSE_BURST' },
    { id: 'GIFT-102', name: 'Love Heart', icon: '💖', costCoins: 50, rewardDiamonds: 35, category: 'Romantic', animationType: 'HEART_FOUNTAIN' },
    { id: 'GIFT-103', name: 'Diamond Ring', icon: '💍', costCoins: 200, rewardDiamonds: 140, category: 'Popular', animationType: 'DIAMOND_SHINE' },
    { id: 'GIFT-501', name: 'Royal Crown', icon: '👑', costCoins: 500, rewardDiamonds: 350, category: 'Luxury', animationType: 'ROYAL_CROWN_3D' },
    { id: 'GIFT-1501', name: 'Supercar', icon: '🏎️', costCoins: 1500, rewardDiamonds: 1050, category: 'Luxury', animationType: 'SUPERCAR_3D' },
    { id: 'GIFT-2001', name: 'Galaxy Rocket', icon: '🚀', costCoins: 2000, rewardDiamonds: 1400, category: 'Special FX', animationType: 'GALAXY_ROCKET_3D' },
    { id: 'GIFT-5001', name: 'Super Yacht', icon: '🛥️', costCoins: 5000, rewardDiamonds: 3500, category: 'Luxury', animationType: 'SUPER_YACHT_3D' },
    { id: 'GIFT-8001', name: 'Golden Dragon', icon: '🐉', costCoins: 8000, rewardDiamonds: 5600, category: 'Special FX', animationType: 'DRAGON_FIRE_3D' },
    { id: 'GIFT-10001', name: 'Private Jet', icon: '✈️', costCoins: 10000, rewardDiamonds: 7000, category: 'Luxury', animationType: 'PRIVATE_JET_3D' },
    { id: 'GIFT-20001', name: 'Cosmic Galaxy', icon: '🌌', costCoins: 20000, rewardDiamonds: 14000, category: 'Special FX', animationType: 'COSMIC_PORTAL_3D' },
    { id: 'GIFT-25001', name: 'Royal Castle', icon: '🏰', costCoins: 25000, rewardDiamonds: 17500, category: 'Luxury', animationType: 'ROYAL_CASTLE_3D' },
    { id: 'GIFT-LUCKY-1', name: 'Lucky Chest', icon: '🎰', costCoins: 100, rewardDiamonds: 70, category: 'Lucky', animationType: 'LUCKY_CHEST_3D' },
  ];

  for (const gift of gifts) {
    await prisma.gift.upsert({
      where: { id: gift.id },
      update: {},
      create: {
        id: gift.id,
        name: gift.name,
        icon: gift.icon,
        costCoins: gift.costCoins,
        rewardDiamonds: gift.rewardDiamonds,
        category: gift.category,
        animationType: gift.animationType,
        active: true,
      },
    });
  }
  console.log(`✅ Seeded ${gifts.length} Virtual Gifts`);

  console.log('🎉 [Seed] Neon PostgreSQL database seed successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
