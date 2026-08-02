export interface ToxicityAnalysisResult {
  isToxic: boolean;
  toxicityScore: number; // 0.00 to 1.00
  categories: string[];
  suggestedAction: 'LOG_ONLY' | 'WARNING' | 'AUTO_MUTE' | 'BAN_ALERT';
}

export interface SpeechToTextResult {
  text: string;
  detectedLanguage: string;
  confidence: number;
}

export interface TranslationResult {
  sourceText: string;
  sourceLanguage: string;
  translatedText: string;
  targetLanguage: string;
}

export interface IAiEngineProvider {
  readonly providerName: string;

  /**
   * Transcribes raw audio stream chunk into text
   */
  speechToText(audioBuffer: Buffer, language?: string): Promise<SpeechToTextResult>;

  /**
   * Analyzes text for toxicity, harassment, and scams
   */
  analyzeToxicity(text: string): Promise<ToxicityAnalysisResult>;

  /**
   * Translates text between supported global languages
   */
  translateText(text: string, sourceLang: string, targetLang: string): Promise<TranslationResult>;
}
