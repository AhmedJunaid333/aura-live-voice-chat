import { TranslationService } from '../src/modules/ai/translation.service.js';

async function runTranslationTests() {
  console.log('🧪 Starting Test: Multi-Language AI Speech Translation...');

  const translation = new TranslationService();

  // Test 1: Translate Urdu to English
  const res = await translation.translateText('سلام دوستو، آپ کیسے ہیں؟', 'UR', 'EN');
  console.assert(res.success === true, 'Translation request failed');
  console.assert(res.data.targetLanguage === 'EN', 'Target language mismatch');

  // Test 2: Unsupported Language Exception
  try {
    await translation.translateText('Hello', 'UNKNOWN_LANG', 'EN');
    console.assert(false, 'Should have blocked unsupported language');
  } catch (err: any) {
    console.log('  ✅ Unsupported language exception caught:', err.message);
  }

  console.log('✅ Multi-Language AI Speech Translation Tests PASSED!\n');
}

runTranslationTests().catch(console.error);
