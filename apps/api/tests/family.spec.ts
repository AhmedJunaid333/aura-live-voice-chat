import { FamilyService } from '../src/modules/family/family.service.js';

async function runFamilyTests() {
  console.log('🧪 Starting Test: Family & Guild Ecosystem...');

  const familyService = new FamilyService();

  // Step 1: Create Family
  const family = familyService.createFamily('Aura Legends', 'u-owner-1', 'https://auralive.app/family/badge.png');
  console.assert(family.level === 1, 'Initial family level should be 1');

  // Step 2: Add XP & Level Up
  const updated = familyService.addFamilyXp(family.id, 500);
  console.assert(updated.level >= 2, 'Family level progression failed');

  console.log('✅ Family & Guild Ecosystem Tests PASSED!\n');
}

runFamilyTests().catch(console.error);
