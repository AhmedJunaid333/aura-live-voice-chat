import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const sourceDir = 'D:/All Frames Application Personal Data/Gifts';
const targetDir = path.join(process.cwd(), 'uploads', 'svga');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const svgaGifts = [
  { file: 'Autumn Windmill .svga', id: 'GIFT-AUTUMN-WINDMILL', name: 'Autumn Windmill', icon: '🍂', cost: 1200, category: 'Popular', animType: 'AUTUMN_WINDMILL_SVGA' },
  { file: 'Blue Enchantress.svga', id: 'GIFT-BLUE-ENCHANTRESS', name: 'Blue Enchantress', icon: '💙', cost: 600, category: 'Draw', animType: 'BLUE_ENCHANTRESS_SVGA' },
  { file: 'Childhood sweethearts (1).svga', id: 'GIFT-CHILDHOOD-SWEETHEARTS', name: 'Childhood Sweethearts', icon: '👫', cost: 1500, category: 'Popular', animType: 'CHILDHOOD_SWEETHEARTS_SVGA' },
  { file: 'Crowning Love (2).svga', id: 'GIFT-CROWNING-LOVE', name: 'Crowning Love', icon: '👑', cost: 3500, category: 'VIP', animType: 'CROWNING_LOVE_SVGA' },
  { file: 'dey (1).svga', id: 'GIFT-MAGIC-DEY', name: 'Magic Lamp Dream', icon: '🪔', cost: 750, category: 'Special FX', animType: 'MAGIC_DEY_SVGA' },
  { file: 'Flower Boat (1).svga', id: 'GIFT-FLOWER-BOAT', name: 'Flower Boat', icon: '⛵', cost: 800, category: 'Popular', animType: 'FLOWER_BOAT_SVGA' },
  { file: 'Mermaid girl (1).svga', id: 'GIFT-MERMAID-GIRL', name: 'Mermaid Girl', icon: '🧜‍♀️', cost: 2200, category: 'Multi', animType: 'MERMAID_GIRL_SVGA' },
  { file: 'Rabbit Heartbeat (1).svga', id: 'GIFT-RABBIT-HEARTBEAT', name: 'Rabbit Heartbeat', icon: '🐰', cost: 1000, category: 'Family Prestige', animType: 'RABBIT_HEARTBEAT_SVGA' },
  { file: 'Runaway Sweetheart (1).svga', id: 'GIFT-RUNAWAY-SWEETHEART', name: 'Runaway Sweetheart', icon: '💖', cost: 1800, category: 'Popular', animType: 'RUNAWAY_SWEETHEART_SVGA' },
  { file: 'Secret Cage (1).svga', id: 'GIFT-SECRET-CAGE', name: 'Secret Cage', icon: '🕊️', cost: 900, category: 'Draw', animType: 'SECRET_CAGE_SVGA' },
];

async function syncSvgGifts() {
  console.log('================================================================');
  console.log('🎁 SYNCING ALL 10 SVGA GIFTS TO DATABASE & RENDER HOSTING');
  console.log('================================================================\n');

  for (const item of svgaGifts) {
    const srcPath = path.join(sourceDir, item.file);
    if (!fs.existsSync(srcPath)) {
      console.warn('⚠️ Source file not found:', srcPath);
      continue;
    }

    const cleanName = path.parse(item.file).name.replace(/[^a-zA-Z0-9_-]/g, '_') + '.svga';
    const localTarget = path.join(targetDir, cleanName);
    fs.copyFileSync(srcPath, localTarget);

    const publicUrl = `https://aura-live-voice-chat-1.onrender.com/uploads/svga/${cleanName}`;

    const upserted = await prisma.gift.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        icon: item.icon,
        costCoins: item.cost,
        rewardDiamonds: Math.floor(item.cost * 0.7),
        category: item.category,
        animationType: item.animType,
        svgaUrl: publicUrl,
        active: true,
      },
      create: {
        id: item.id,
        name: item.name,
        icon: item.icon,
        costCoins: item.cost,
        rewardDiamonds: Math.floor(item.cost * 0.7),
        category: item.category,
        animationType: item.animType,
        svgaUrl: publicUrl,
        active: true,
      },
    });

    console.log(`✅ [${upserted.id}] ${upserted.name} -> svgaUrl: ${upserted.svgaUrl}`);
  }

  const allSvgGifts = await prisma.gift.findMany({
    where: { svgaUrl: { not: null } },
    select: { id: true, name: true, category: true, costCoins: true, svgaUrl: true, active: true },
    orderBy: { costCoins: 'asc' },
  });

  console.log('\n--- ALL ACTIVE SVGA GIFTS IN NEON DATABASE ---');
  console.table(allSvgGifts);
}

syncSvgGifts().finally(() => prisma.$disconnect());
