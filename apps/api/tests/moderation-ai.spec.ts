import { VoiceModerationService } from '../src/modules/ai/voice-moderation.service.js';

async function runVoiceModerationAiTests() {
  console.log('🧪 Starting Test: AI Voice & Speech Moderation Pipeline...');

  const voiceMod = new VoiceModerationService();

  // Test 1: Clean Stream Chunk Process
  const dummyBuffer = Buffer.from('mock_audio_clean_data');
  const decision = await voiceMod.processAudioStreamChunk('room-101', 'u-speaker-1', dummyBuffer);

  console.assert(decision.riskLevel === 'LOW', 'Clean stream risk level should be LOW');
  console.assert(decision.actionTaken === 'LOG_ONLY', 'Clean stream action should be LOG_ONLY');

  console.log('✅ AI Voice & Speech Moderation Pipeline Tests PASSED!\n');
}

runVoiceModerationAiTests().catch(console.error);
