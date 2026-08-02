import { AiRecommendationService } from '../src/modules/ai/recommendation.service.js';

async function runRecommendationTests() {
  console.log('🧪 Starting Test: AI Recommendation Engine & Interest Profiles...');

  const aiRec = new AiRecommendationService();

  // Test 1: Record User Behavior Event
  aiRec.recordEvent('u-test-user', 'ROOM_JOINED', '101');
  aiRec.recordEvent('u-test-user', 'GIFT_SENT', '101');

  const profile = aiRec.getUserProfile('u-test-user');
  console.assert(profile.giftPropensityScore > 0.60, 'Gift propensity score failed to increase on gift event');

  // Test 2: Room Recommendation Scoring
  const rooms = [
    { id: '101', roomNumber: '888999', title: '🔥 Late Night Music & Gossip', hostId: 'u-host-101', category: 'Music', language: 'UR', activeUsers: 450 },
    { id: '102', roomNumber: '888100', title: '🎤 Global Vocal Club', hostId: 'u-host-102', category: 'Chat', language: 'EN', activeUsers: 1200 }
  ];

  const recommended = aiRec.recommendRooms('u-test-user', rooms);
  console.assert(recommended.length === 2, 'Recommendation count mismatch');
  console.assert(recommended[0].roomId === '101', 'Affinity match room 101 should be ranked #1');

  console.log('✅ AI Recommendation Engine & Interest Profiles Tests PASSED!\n');
}

runRecommendationTests().catch(console.error);
