import { CommissionService } from '../src/modules/agency/commission.service.js';

async function runCommissionTests() {
  console.log('🧪 Starting Test: Agency & Creator Revenue Commission Split...');

  const commissionService = new CommissionService();

  // Test: 10,000 Diamonds Revenue Split (20% Platform, 10% Agency, 70% Creator)
  const split = commissionService.calculateSplit(BigInt(10000), 20, 10);

  console.assert(split.platformDiamonds === BigInt(2000), 'Platform 20% commission mismatch');
  console.assert(split.agencyDiamonds === BigInt(1000), 'Agency 10% commission mismatch');
  console.assert(split.creatorDiamonds === BigInt(7000), 'Creator 70% earnings mismatch');
  console.assert(
    split.platformDiamonds + split.agencyDiamonds + split.creatorDiamonds === BigInt(10000),
    'Commission sum total mismatch'
  );

  console.log('✅ Agency & Creator Commission Split Tests PASSED!\n');
}

runCommissionTests().catch(console.error);
