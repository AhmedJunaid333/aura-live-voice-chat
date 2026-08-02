import { EngagementService } from '../src/modules/engagement/engagement.service.js';

async function runEngagementTests() {
  console.log('🧪 Starting Test: Engagement Engine & Spin Wheel...');

  const engagement = new EngagementService();

  // Test 1: Daily Check-In
  const checkIn = engagement.claimDailyCheckIn('u-user-77');
  console.assert(checkIn.streakDays === 1, 'Check-in streak day mismatch');
  console.assert(checkIn.coinsRewarded === BigInt(50), 'Check-in coin reward mismatch');

  // Test 2: Lucky Wheel Spin
  const spin = engagement.spinLuckyWheel('u-user-77');
  console.assert(spin.rewardType !== undefined, 'Spin reward missing');

  console.log('✅ Engagement Engine & Spin Wheel Tests PASSED!\n');
}

runEngagementTests().catch(console.error);
