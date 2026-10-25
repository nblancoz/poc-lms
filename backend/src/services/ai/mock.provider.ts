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
      return `¡Hola! Soy tu tutor para la lección "${context.lessonTitle}". ¿En qué concepto o duda de esta lección te gustaría que profundicemos?`;
    }

    return `Excelente pregunta sobre "${context.lessonTitle}". Según el contenido de esta lección, los aspectos clave a tener en cuenta son la correcta estructuración y aplicación de los principios explicados en el temario. ¿Te gustaría ver un ejemplo práctico de este punto?`;
  }
}
