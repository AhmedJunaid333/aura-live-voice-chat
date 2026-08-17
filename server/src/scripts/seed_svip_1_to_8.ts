import { prisma } from '../config/database.js';
import { MembershipService } from '../services/membership.service.js';

async function main() {
  console.log('👑 Seeding SVIP 1–8 Nobility System in Neon PostgreSQL...');

  // 1. Delete legacy SVIP tiers > 8
  const deleted = await prisma.svipLevelConfig.deleteMany({
    where: { level: { gt: 8 } },
  });
  console.log(`🧹 Cleaned ${deleted.count} obsolete SVIP tiers (levels 9–15).`);

  // 2. Re-seed clean SVIP 1–8
  await MembershipService.seedSvipLevels();

  // 3. Fetch and print all active SVIP tiers
  const tiers = await prisma.svipLevelConfig.findMany({
    where: { active: true },
    orderBy: { level: 'asc' },
  });

  console.log(`✅ Total active SVIP tiers in Neon PostgreSQL: ${tiers.length}`);
  for (const t of tiers) {
    console.log(`   💎 SVIP ${t.level}: ${t.name} (${t.colorHex}) | XP: ${t.xpRequired.toLocaleString()} | Min Recharge: $${t.minLifetimeRecharge}`);
  }

  // 4. Verify AvatarFrames created for SVIP 1–8
  const frames = await (prisma as any).avatarFrame.findMany({
    where: { slug: { startsWith: 'svip-' } },
    orderBy: { sortOrder: 'asc' },
  });
  console.log(`🎨 Total SVIP Avatar Frames registered: ${frames.length}`);
  for (const f of frames) {
    console.log(`   🖼️ ${f.slug}: ${f.name} (${f.rarity})`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('❌ Error seeding SVIP 1–8:', err);
  process.exit(1);
});
