import { PkBattleService } from '../src/modules/pk/pk-battle.service.js';

async function runPkBattleTests() {
  console.log('🧪 Starting Test: PK Battle Engine, Scoring & Winner Determination...');

  const pkService = new PkBattleService();

  // Step 1: Start PK Battle
  const battle = pkService.startBattle('room-1', 'room-2', 'host-1', 'host-2', 300);
  console.assert(battle.status === 'LIVE', 'Battle status should be LIVE');

  // Step 2: Add Gift Score
  pkService.addGiftScore(battle.id, 'host-1', BigInt(5000));
  pkService.addGiftScore(battle.id, 'host-2', BigInt(2000));

  // Step 3: End Battle
  const ended = pkService.endBattle(battle.id);
  console.assert(ended.status === 'FINISHED', 'Battle status should be FINISHED');
  console.assert(ended.winnerId === 'host-1', 'Winner host mismatch');

  console.log('✅ PK Battle Engine, Scoring & Winner Determination Tests PASSED!\n');
}

runPkBattleTests().catch(console.error);
