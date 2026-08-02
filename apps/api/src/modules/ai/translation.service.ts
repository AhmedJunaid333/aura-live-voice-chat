import { AiEngineFactory } from '../../../../../packages/ai-engine/src/index.js';

export class TranslationService {
  private aiEngine = AiEngineFactory.createProvider('MOCK');
  private supportedLanguages = new Set(['UR', 'EN', 'AR', 'ZH', 'ES']);

  async translateText(text: string, sourceLang: string, targetLang: string) {
    if (!this.supportedLanguages.has(sourceLang) || !this.supportedLanguages.has(targetLang)) {
      throw new Error(`Unsupported language pair: ${sourceLang} -> ${targetLang}`);
    }

    const result = await this.aiEngine.translateText(text, sourceLang, targetLang);
    return {
      success: true,
      data: result
    };
  }
}
