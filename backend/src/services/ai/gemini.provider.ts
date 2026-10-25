import { GoogleGenAI } from '@google/genai';
import { type AiProvider, type TutorPromptContext } from '../../types/tutor';
import { buildSystemPrompt } from './prompts';

export class GeminiProvider implements AiProvider {
  public readonly name = 'gemini';
  private client: GoogleGenAI;
  private modelName = 'gemini-3.5-flash';

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
  }

  public async generateReply(context: TutorPromptContext): Promise<string> {
    const systemInstruction = buildSystemPrompt(context.lessonTitle, context.lessonContent);

    const contents = [
      ...context.history.slice(-10).map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      {
        role: 'user',
        parts: [{ text: context.userMessage }],
      },
    ];

    const response = await this.client.models.generateContent({
      model: this.modelName,
      contents,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    const reply = response.text?.trim();
    if (!reply) {
      throw new Error('Gemini API returned an empty response');
    }

    return reply;
  }
}
