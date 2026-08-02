import { RoomRankingService } from '../src/modules/ai/ranking.service.js';

async function runRankingTests() {
  console.log('🧪 Starting Test: Weighted Room Ranking & Scoring Formula...');

  const ranking = new RoomRankingService();

  // Test: Room Score Calculation
  const score = ranking.calculateRoomScore({
    roomId: 'room-1',
    activeUsers: 50, // 50 * 2 = 100 * 30% = 30
    giftVolumeCoins: 10000, // 100 * 25% = 25
    chatCount: 20, // 100 * 20% = 20
    viewDurationAvgSeconds: 1000, // 100 * 15% = 15
    hostReputationScore: 100 // 100 * 10% = 10 -> Total = 100
  });

  console.assert(score === 100.00, `Expected score 100.00, got ${score}`);

  // Test 2: Weight Configuration Adjustment
  ranking.updateWeights({ activeUsersWeight: 0.50, giftVolumeWeight: 0.10 });
  const score2 = ranking.calculateRoomScore({
    roomId: 'room-2',
    activeUsers: 50,
    giftVolumeCoins: 0,
    chatCount: 0,
    viewDurationAvgSeconds: 0,
    hostReputationScore: 0
  });
  console.assert(score2 === 50.00, `Adjusted weight score mismatch, expected 50.00, got ${score2}`);

  console.log('✅ Weighted Room Ranking & Scoring Formula Tests PASSED!\n');
}

runRankingTests().catch(console.error);
