import { MockAiProvider } from '../src/services/ai/mock.provider';
import { OFF_TOPIC_RESPONSE } from '../src/services/ai/prompts';

describe('MockAiProvider Pedagogical Tutor', () => {
  const provider = new MockAiProvider();
  const sampleContext = {
    lessonTitle: 'Travel English: Airports & Hotels',
    lessonContent:
      'Boarding pass, carry-on luggage, checked baggage, aisle seat, window seat, reservation, keycard, amenities.',
    history: [],
  };

  it('provides a warm welcome response with bilingual tags when greeted', async () => {
    const reply = await provider.generateReply({
      ...sampleContext,
      userMessage: '¡Hola! Buenos días',
    });

    expect(reply).toContain('¡Hola! Qué gusto saludarte.');
    expect(reply).toContain('<span lang="en">"carry-on luggage"</span>');
  });

  it('explains carry-on luggage vs checked baggage with audio language tags', async () => {
    const reply = await provider.generateReply({
      ...sampleContext,
      userMessage: '¿Cuál es la diferencia entre carry-on luggage y checked baggage?',
    });

    expect(reply).toContain('La diferencia principal está en la ubicación del equipaje');
    expect(reply).toContain('<span lang="en">"carry-on luggage"</span>');
    expect(reply).toContain('<span lang="en">"checked baggage"</span>');
  });

  it('explains aisle seat and window seat with silent "s" phonetic guidance', async () => {
    const reply = await provider.generateReply({
      ...sampleContext,
      userMessage: '¿Cómo pido un asiento de pasillo (aisle seat)?',
    });

    expect(reply).toContain('<span lang="en">"aisle seat"</span>');
    expect(reply).toContain('la letra "s" es totalmente muda');
    expect(reply).toContain(
      '<span lang="en">"Could I please have an aisle seat if available?"</span>',
    );
  });

  it('explains hotel reservation and keycard protocols', async () => {
    const reply = await provider.generateReply({
      ...sampleContext,
      userMessage: '¿Cómo hago el check-in en el hotel y pido mi keycard?',
    });

    expect(reply).toContain(
      '<span lang="en">"Hello, good afternoon! I have a reservation under the name Juan."</span>',
    );
    expect(reply).toContain('<span lang="en">"keycard"</span>');
  });

  it('explains travel vs trip grammar differences with examples', async () => {
    const reply = await provider.generateReply({
      ...sampleContext,
      userMessage: '¿Qué diferencia hay entre travel y trip?',
    });

    expect(reply).toContain('<span lang="en">"Travel"</span> se utiliza habitualmente como verbo');
    expect(reply).toContain('<span lang="en">"trip"</span> es un sustantivo');
  });

  it('strictly returns OFF_TOPIC_RESPONSE for out-of-scope topics', async () => {
    const offTopicQueries = [
      '¿Cuál es la receta de pizza margarita?',
      '¿Quién ganó el último partido de fútbol?',
      '¿Cuánto cuesta un bitcoin hoy?',
      'Escribe un script en Python para ordenar una lista',
    ];

    for (const userMessage of offTopicQueries) {
      const reply = await provider.generateReply({
        ...sampleContext,
        userMessage,
      });

      expect(reply).toBe(OFF_TOPIC_RESPONSE);
      expect(reply).toBe('No tengo información en esta lección para responder a eso.');
    }
  });

  it('strictly returns OFF_TOPIC_RESPONSE for queries unrelated to lesson tokens', async () => {
    const reply = await provider.generateReply({
      ...sampleContext,
      userMessage: '¿Qué opinas de la fotosíntesis en los árboles?',
    });

    expect(reply).toBe(OFF_TOPIC_RESPONSE);
  });
});
