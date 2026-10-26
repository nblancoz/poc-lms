import { type AiProvider, type TutorPromptContext } from '../../types/tutor';
import { OFF_TOPIC_RESPONSE } from './prompts';

export class MockAiProvider implements AiProvider {
  public readonly name = 'mock';

  public async generateReply(context: TutorPromptContext): Promise<string> {
    const question = context.userMessage.trim().toLowerCase();
    const lessonContent = context.lessonContent.toLowerCase();
    const lessonTitle = context.lessonTitle.toLowerCase();

    // 1. Explicit out-of-scope topics that must strictly decline
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
      'dólar',
      'dolar',
      'presidente',
      'matemática',
      'matematica',
      'código',
      'codigo',
      'python',
      'javascript',
      'react',
      'dinosaurio',
    ];

    if (offTopicKeywords.some((word) => question.includes(word))) {
      return OFF_TOPIC_RESPONSE;
    }

    // 2. Greetings and welcome intent
    if (
      question.includes('hola') ||
      question.includes('buenos') ||
      question.includes('buenas') ||
      question.includes('saludos') ||
      question.includes('hello') ||
      question.includes('hi')
    ) {
      return `¡Hola! Qué gusto saludarte. Soy tu tutor personal para la lección "${context.lessonTitle}". Puedes preguntarme por vocabulario de viaje como <span lang="en">"carry-on luggage"</span>, cómo solicitar un <span lang="en">"aisle seat"</span>, o diálogos en la recepción del hotel. ¿En qué te gustaría concentrarte hoy?`;
    }

    // 3. Educational intent: Carry-on vs Checked baggage
    if (
      question.includes('carry-on') ||
      question.includes('carry on') ||
      question.includes('equipaje') ||
      question.includes('maleta') ||
      question.includes('bodega') ||
      question.includes('cabina') ||
      question.includes('checked')
    ) {
      return `¡Excelente pregunta! La diferencia principal está en la ubicación del equipaje: <span lang="en">"carry-on luggage"</span> es el equipaje de mano que llevas contigo dentro de la cabina del avión, mientras que <span lang="en">"checked baggage"</span> son las maletas facturadas que viajan en la bodega. En el mostrador de facturación es muy común que el agente te pregunte: <span lang="en">"Do you have any bags to check, or just this carry-on?"</span>.`;
    }

    // 4. Educational intent: Boarding pass
    if (
      question.includes('boarding pass') ||
      question.includes('boarding') ||
      question.includes('tarjeta de embarque') ||
      question.includes('embarque') ||
      question.includes('gate')
    ) {
      return `El término <span lang="en">"boarding pass"</span> hace referencia a tu tarjeta de embarque, ya sea impresa en papel o digital en tu teléfono. La aerolínea te la solicitará en el control y en la puerta de embarque con frases como: <span lang="en">"Here is your boarding pass. Gate B12, boarding starts at 10:15 AM."</span>.`;
    }

    // 5. Educational intent: Aisle seat vs Window seat & pronunciation
    if (
      question.includes('aisle') ||
      question.includes('window') ||
      question.includes('asiento') ||
      question.includes('pasillo') ||
      question.includes('ventanilla') ||
      question.includes('silla')
    ) {
      return `En el avión cuentas con dos opciones principales de asiento: <span lang="en">"aisle seat"</span> (asiento de pasillo) y <span lang="en">"window seat"</span> (asiento de ventanilla). Un detalle de pronunciación muy importante: en <span lang="en">"aisle"</span> la letra "s" es totalmente muda (suena como "áil"). Puedes pedirlo diciendo: <span lang="en">"Could I please have an aisle seat if available?"</span>.`;
    }

    // 6. Educational intent: Hotel check-in & Keycard
    if (
      question.includes('hotel') ||
      question.includes('reception') ||
      question.includes('recepción') ||
      question.includes('recepcion') ||
      question.includes('reserva') ||
      question.includes('reservation') ||
      question.includes('keycard') ||
      question.includes('llave') ||
      question.includes('habitacion') ||
      question.includes('habitación')
    ) {
      return `Para realizar el check-in en el hotel, puedes acercarte al mostrador y decir con naturalidad: <span lang="en">"Hello, good afternoon! I have a reservation under the name Juan."</span>. El recepcionista confirmará tu estancia y te entregará tu <span lang="en">"keycard"</span> (tarjeta magnética de la habitación) diciéndote: <span lang="en">"Here is your keycard for room 402."</span>.`;
    }

    // 7. Educational intent: Breakfast & Amenities
    if (
      question.includes('breakfast') ||
      question.includes('desayuno') ||
      question.includes('wifi') ||
      question.includes('wi-fi') ||
      question.includes('internet') ||
      question.includes('amenities')
    ) {
      return `En el diálogo del hotel se consultan dos servicios esenciales: el horario del desayuno (<span lang="en">"What time is breakfast served in the morning?"</span>), que se sirve de 7:00 AM a 10:30 AM, y la conexión a internet (<span lang="en">"Is high-speed Wi-Fi included in the room rate?"</span>), que es gratuita para los huéspedes.`;
    }

    // 8. Educational intent: Travel vs Trip (Grammar tip)
    if (
      (question.includes('travel') && question.includes('trip')) ||
      question.includes('diferencia') ||
      question.includes('viaje')
    ) {
      return `¡Una excelente distinción gramatical! <span lang="en">"Travel"</span> se utiliza habitualmente como verbo o actividad general (por ejemplo: <span lang="en">"I love to travel"</span>). En cambio, <span lang="en">"trip"</span> es un sustantivo para referirse a un viaje puntual con principio y fin (por ejemplo: <span lang="en">"Have a safe trip!"</span>).`;
    }

    // 9. Educational intent: Practice or Roleplay
    if (
      question.includes('practicar') ||
      question.includes('dialogo') ||
      question.includes('diálogo') ||
      question.includes('roleplay') ||
      question.includes('simular')
    ) {
      return `¡Genial! Practiquemos una simulación rápida en el aeropuerto. Imagina que llego como agente al mostrador: <span lang="en">"Good morning! Where are you flying to today?"</span>. ¿Cómo me responderías en inglés usando el contenido de la lección?`;
    }

    // 10. Fallback for lesson-relevant terms
    const questionTokens = question
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .split(/\s+/)
      .filter((token) => token.length >= 4);

    const matchesLesson = questionTokens.some(
      (token) => lessonContent.includes(token) || lessonTitle.includes(token),
    );

    if (matchesLesson) {
      return `En la lección "${context.lessonTitle}" estudiamos vocabulario y frases prácticas como <span lang="en">"boarding pass"</span>, <span lang="en">"carry-on luggage"</span> o diálogos como <span lang="en">"Could I please have an aisle seat?"</span>. ¿Te gustaría repasar la pronunciación de algún término o simular un diálogo en inglés?`;
    }

    // 11. Strict off-topic boundary for any unmatched query
    return OFF_TOPIC_RESPONSE;
  }
}
