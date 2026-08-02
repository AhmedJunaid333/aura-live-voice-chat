import { IAiEngineProvider, ToxicityAnalysisResult, SpeechToTextResult, TranslationResult } from '../interfaces/ai-provider.interface.js';

export class LocalAiEngineProvider implements IAiEngineProvider {
  readonly providerName = 'LOCAL_AI';

  async speechToText(audioBuffer: Buffer, language: string = 'UR'): Promise<SpeechToTextResult> {
    return {
      text: 'Local Whisper.cpp transcription result',
      detectedLanguage: language,
      confidence: 0.92
    };
  }

  async analyzeToxicity(text: string): Promise<ToxicityAnalysisResult> {
    return {
      isToxic: false,
      toxicityScore: 0.02,
      categories: [],
      suggestedAction: 'LOG_ONLY'
    };
  }

  async translateText(text: string, sourceLang: string, targetLang: string): Promise<TranslationResult> {
    return {
      sourceText: text,
      sourceLanguage: sourceLang,
      translatedText: `[Local translation]: ${text}`,
      targetLanguage: targetLang
    };
  }
}
