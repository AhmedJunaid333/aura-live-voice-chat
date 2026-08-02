import { IAiEngineProvider, ToxicityAnalysisResult, SpeechToTextResult, TranslationResult } from '../interfaces/ai-provider.interface.js';

export class MockAiEngineProvider implements IAiEngineProvider {
  readonly providerName = 'MOCK_AI';

  async speechToText(audioBuffer: Buffer, language: string = 'UR'): Promise<SpeechToTextResult> {
    return {
      text: 'Mock Voice Room Audio Stream',
      detectedLanguage: language,
      confidence: 1.0
    };
  }

  async analyzeToxicity(text: string): Promise<ToxicityAnalysisResult> {
    const isToxic = text.includes('scam') || text.includes('hate');
    return {
      isToxic,
      toxicityScore: isToxic ? 0.90 : 0.01,
      categories: isToxic ? ['SCAM'] : [],
      suggestedAction: isToxic ? 'AUTO_MUTE' : 'LOG_ONLY'
    };
  }

  async translateText(text: string, sourceLang: string, targetLang: string): Promise<TranslationResult> {
    return {
      sourceText: text,
      sourceLanguage: sourceLang,
      translatedText: `Translated (${sourceLang} -> ${targetLang}): ${text}`,
      targetLanguage: targetLang
    };
  }
}
