export * from './interfaces/ai-provider.interface.js';
export * from './providers/openai.provider.js';
export * from './providers/local.provider.js';
export * from './providers/mock.provider.js';

import { IAiEngineProvider } from './interfaces/ai-provider.interface.js';
import { OpenAiEngineProvider } from './providers/openai.provider.js';
import { LocalAiEngineProvider } from './providers/local.provider.js';
import { MockAiEngineProvider } from './providers/mock.provider.js';

export class AiEngineFactory {
  static createProvider(type: 'OPENAI' | 'LOCAL' | 'MOCK', apiKey?: string): IAiEngineProvider {
    switch (type) {
      case 'OPENAI':
        return new OpenAiEngineProvider(apiKey || 'MOCK_OPENAI_KEY');
      case 'LOCAL':
        return new LocalAiEngineProvider();
      case 'MOCK':
      default:
        return new MockAiEngineProvider();
    }
  }
}
