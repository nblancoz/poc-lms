import { type AiProvider } from '../../types/tutor';
import { GeminiProvider } from './gemini.provider';
import { MockAiProvider } from './mock.provider';

let cachedProvider: AiProvider | null = null;

export function resetAiProvider(): void {
  cachedProvider = null;
}

export function getAiProvider(): AiProvider {
  if (cachedProvider) {
    return cachedProvider;
  }

  const providerType = (process.env.AI_PROVIDER || 'mock').trim().toLowerCase();

  if (providerType === 'gemini') {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const isPlaceholderOrEmpty = !apiKey || apiKey === '' || apiKey === 'your_gemini_api_key_here';

    if (isPlaceholderOrEmpty) {
      console.warn(
        '⚠️ [AI Provider] GEMINI_API_KEY is missing or set to placeholder. Falling back to MockAiProvider for seamless offline evaluation.',
      );
      cachedProvider = new MockAiProvider();
      return cachedProvider;
    }

    console.log('🤖 [AI Provider] Initialized GeminiProvider (model: gemini-3.5-flash)');
    cachedProvider = new GeminiProvider(apiKey);
    return cachedProvider;
  }

  if (providerType === 'mock') {
    console.log('🧪 [AI Provider] Initialized MockAiProvider');
    cachedProvider = new MockAiProvider();
    return cachedProvider;
  }

  console.warn(
    `⚠️ [AI Provider] Unsupported AI_PROVIDER: "${providerType}". Falling back to MockAiProvider.`,
  );
  cachedProvider = new MockAiProvider();
  return cachedProvider;
}
