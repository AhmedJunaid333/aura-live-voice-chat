import { AiEngineFactory } from '../../../../../packages/ai-engine/src/index.js';

export interface ModerationDecision {
  roomId: string;
  speakerId: string;
  transcription: string;
  toxicityScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  actionTaken: 'LOG_ONLY' | 'WARNING' | 'AUTO_MUTE' | 'BAN_ALERT';
}

export class VoiceModerationService {
  private aiEngine = AiEngineFactory.createProvider('MOCK');

  async processAudioStreamChunk(roomId: string, speakerId: string, rawAudioChunk: Buffer): Promise<ModerationDecision> {
    // 1. Speech To Text
    const stt = await this.aiEngine.speechToText(rawAudioChunk);

    // 2. AI Classification & Toxicity Analysis
    const toxicity = await this.aiEngine.analyzeToxicity(stt.text);

    // 3. Risk Level Determination
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    let actionTaken: 'LOG_ONLY' | 'WARNING' | 'AUTO_MUTE' | 'BAN_ALERT' = 'LOG_ONLY';

    if (toxicity.toxicityScore >= 0.85) {
      riskLevel = 'CRITICAL';
      actionTaken = 'BAN_ALERT';
    } else if (toxicity.toxicityScore >= 0.70) {
      riskLevel = 'HIGH';
      actionTaken = 'AUTO_MUTE';
    } else if (toxicity.toxicityScore >= 0.40) {
      riskLevel = 'MEDIUM';
      actionTaken = 'WARNING';
    }

    return {
      roomId,
      speakerId,
      transcription: stt.text,
      toxicityScore: toxicity.toxicityScore,
      riskLevel,
      actionTaken
    };
  }
}
