import { MembershipService } from '../services/membership.service.js';
import { prisma } from '../config/database.js';

async function main() {
  console.log('🔍 Testing MembershipService SVIP 1–8 Engine...');

  const svipTiers = await MembershipService.getSvipTiers();
  console.log(`✅ Retrieved ${svipTiers.length} SVIP tiers.`);

  for (const tier of svipTiers) {
    const perks = JSON.parse(tier.perksJson || '[]');
    console.log(`\n👑 Tier ${tier.level}: ${tier.name} (${tier.colorHex})`);
    console.log(`   💎 Title: ${tier.title}`);
    console.log(`   ⚡ Required XP: ${tier.xpRequired.toLocaleString()} | Min Recharge: $${tier.minLifetimeRecharge}`);
    console.log(`   🖼️ Frame ID: ${tier.frameId} | Chat Bubble: ${tier.chatBubble}`);
    console.log(`   🎁 Perks (${perks.length}):`);
    perks.forEach((p: string) => console.log(`      - ${p}`));
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
