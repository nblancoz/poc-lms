import { type AiProvider, type TutorPromptContext } from '../../types/tutor';
import { OFF_TOPIC_RESPONSE } from './prompts';

export class MockAiProvider implements AiProvider {
  public readonly name = 'mock';

  public async generateReply(context: TutorPromptContext): Promise<string> {
    const question = context.userMessage.trim().toLowerCase();
    const lessonContent = context.lessonContent.toLowerCase();
    const lessonTitle = context.lessonTitle.toLowerCase();

    const offTopicKeywords = [
      'clima',
      'tiempo',
      'receta',
      'pizza',
      'comida',
      'cocina',
      'capital',
      'fútbol',
      'futbol',
      'película',
      'pelicula',
      'chiste',
      'música',
      'musica',
      'política',
      'politica',
      'bitcoin',
      'cripto',
    ];

    if (offTopicKeywords.some((word) => question.includes(word))) {
      return OFF_TOPIC_RESPONSE;
    }

    const questionTokens = question
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .split(/\s+/)
      .filter((token) => token.length >= 4);

    const matchesLesson = questionTokens.some(
      (token) => lessonContent.includes(token) || lessonTitle.includes(token),
    );

    if (!matchesLesson && questionTokens.length > 0) {
      return OFF_TOPIC_RESPONSE;
    }

    if (question.includes('hola') || question.includes('buenos') || question.includes('saludos')) {
      return `¡Hola! Qué gusto saludarte. Estoy aquí para acompañarte con la lección "${context.lessonTitle}". Cuéntame, ¿qué duda tienes o qué parte te gustaría repasar primero?`;
    }

    return `¡Buena pregunta! En esta lección sobre "${context.lessonTitle}", el punto principal es entender cómo conectar las ideas de forma práctica y sin complicaciones. ¿Quieres que veamos juntos un ejemplo sencillo paso a paso para que te quede súper claro?`;
  }
}
