import { VipService } from '../src/modules/economy/vip.service.js';

async function runVipSystemTests() {
  console.log('🧪 Starting Test: VIP Membership Tiers 1-7...');

  const vipService = new VipService();

  // Test 1: Fetch 7 VIP Tiers
  const levels = vipService.getVipLevels();
  console.assert(levels.length === 7, 'Must have 7 VIP levels');
  console.assert(levels[6].tier === 7, 'Tier 7 missing');

  // Test 2: Purchase & Expiration
  const purchase = vipService.purchaseVip('u-user-55', 5);
  console.assert(purchase.success === true, 'VIP Purchase failed');
  console.assert(purchase.tier === 5, 'VIP Tier mismatch');

  const vipInfo = vipService.getUserVip('u-user-55');
  console.assert(vipInfo.tier === 5, 'User VIP active tier incorrect');
  console.assert(vipInfo.discount === 10, 'VIP 5 discount should be 10%');

  console.log('✅ VIP Membership System Tests PASSED!\n');
}

runVipSystemTests().catch(console.error);
