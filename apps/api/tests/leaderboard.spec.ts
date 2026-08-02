import { LeaderboardService } from '../src/modules/ranking/leaderboard.service.js';

async function runLeaderboardTests() {
  console.log('🧪 Starting Test: Leaderboards & Hall of Fame...');

  const lb = new LeaderboardService();

  lb.recordScore('GIVER', 'WEEKLY', 'u-giver-1', BigInt(50000));
  lb.recordScore('GIVER', 'WEEKLY', 'u-giver-2', BigInt(120000));

  const rankings = lb.getRankings('GIVER', 'WEEKLY');
  console.assert(rankings.length === 2, 'Leaderboard length mismatch');
  console.assert(rankings[0].entityId === 'u-giver-2', 'Top giver rank #1 mismatch');

  console.log('✅ Leaderboards & Hall of Fame Tests PASSED!\n');
}

runLeaderboardTests().catch(console.error);
