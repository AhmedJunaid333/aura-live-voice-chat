import { ModerationService } from '../src/modules/moderation/moderation.service.js';

async function runModerationTests() {
  console.log('🧪 Starting Test: Moderation, Profanity Filter & Ban System...');

  const moderation = new ModerationService();

  // Test 1: Profanity Filter
  const filterRes = moderation.filterContent('Hello everyone, this is badword text');
  console.assert(filterRes.isClean === false, 'Profanity detection failed');
  console.assert(filterRes.sanitizedText.includes('***'), 'Sanitization mask failed');

  // Test 2: User Ban
  moderation.banUser('u-bad-actor', 'Repeated spam', 7);
  console.assert(moderation.isUserBanned('u-bad-actor') === true, 'User ban check failed');
  console.assert(moderation.isUserBanned('u-good-actor') === false, 'Non-banned user falsely flagged');

  console.log('✅ Moderation, Profanity Filter & Ban System Tests PASSED!\n');
}

runModerationTests().catch(console.error);
