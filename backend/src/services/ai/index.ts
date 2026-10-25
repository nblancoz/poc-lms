import { type AiProvider } from '../../types/tutor';
import { GeminiProvider } from './gemini.provider';
import { MockAiProvider } from './mock.provider';

let cachedProvider: AiProvider | null = null;

export function getAiProvider(): AiProvider {
  if (cachedProvider) {
    return cachedProvider;
  }

  const providerType = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

  if (providerType === 'gemini') {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      throw new Error(
        'GEMINI_API_KEY is required when AI_PROVIDER is set to "gemini". Set your key in .env or switch AI_PROVIDER to "mock".',
      );
    }
    console.log('🤖 [AI Provider] Initialized GeminiProvider (model: gemini-3.5-flash)');
    cachedProvider = new GeminiProvider(apiKey.trim());
    return cachedProvider;
  }

  if (providerType === 'mock') {
    console.log('🧪 [AI Provider] Initialized MockAiProvider');
    cachedProvider = new MockAiProvider();
    return cachedProvider;
  }

  throw new Error(
    `Unsupported AI_PROVIDER: "${providerType}". Supported options: "gemini" | "mock".`,
  );
}
