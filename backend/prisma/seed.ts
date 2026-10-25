import path from 'node:path';
import { config } from 'dotenv';

config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

import { prisma } from '../src/models/prisma';
import { hashPassword } from '../src/utils/password';

async function main() {
  console.log('🌱 Starting database seed...');

  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Existing data cleaned.');

  const defaultPasswordHash = await hashPassword('password123');

  const studentEnrolled = await prisma.user.create({
    data: {
      email: 'student.enrolled@example.com',
      name: 'Alumno Matriculado',
      password: defaultPasswordHash,
    },
  });

  const studentNoAccess = await prisma.user.create({
    data: {
      email: 'student.noaccess@example.com',
      name: 'Alumno Sin Acceso',
      password: defaultPasswordHash,
    },
  });

  console.log('👤 Users created:');
  console.log(`   - Enrolled: ${studentEnrolled.email}`);
  console.log(`   - No Access: ${studentNoAccess.email}`);

  const course1 = await prisma.course.create({
    data: {
      title: 'Practical Everyday English & Pronunciation',
      description:
        'Master essential conversational English for daily situations, travel, dining out, and social interactions with clear pronunciation tips and practical dialogues.',
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Business English & Professional Communication',
      description:
        'Develop your professional English skills for job interviews, workplace meetings, elevator pitches, and professional networking.',
    },
  });

  console.log(`📚 Courses created:`);
  console.log(`   1. "${course1.title}"`);
  console.log(`   2. "${course2.title}"`);

  const lesson1Content = `
Welcome to your practical travel English lesson! In this unit, you will learn the essential phrases, key vocabulary, and common dialogues needed to navigate an international airport and check in at a hotel with confidence.

---

## 1. Key Travel Vocabulary

| Término | ¿Cómo suena? (Pronunciación) | Significado / Uso |
| :--- | :--- | :--- |
| **Boarding pass** | *bór-ding pas* | Tarjeta de embarque física o digital. |
| **Carry-on luggage** | *cárri-on láguedsh* | Equipaje de mano permitido en cabina. |
| **Checked baggage** | *chekt báguedsh* | Maletas facturadas que van a bodega. |
| **Aisle seat** | *áil siit* (la "s" es muda) | Asiento de pasillo. |
| **Window seat** | *uín-dou siit* | Asiento de ventanilla. |
| **Reservation / Booking** | *re-ser-véi-shon / bú-king* | Reserva confirmada de hotel o vuelo. |
| **Keycard** | *kíi-card* | Tarjeta electrónica para abrir la habitación. |
| **Amenities** | *aménitis* | Servicios e instalaciones (piscina, gimnasio, etc.). |

---

## 2. Airport Dialogues & Useful Phrases

### At the Check-in Counter
- **Agent:** *"Good morning! Where are you flying to today?"*
- **Passenger:** *"Good morning. I'm flying to London on flight BA245."*
- **Agent:** *"May I see your passport and booking reference, please?"*
- **Passenger:** *"Here you go. Could I please have an aisle seat if available?"*
- **Agent:** *"Sure. Do you have any bags to check, or just this carry-on?"*
- **Passenger:** *"Just one checked suitcase and a small backpack."*
- **Agent:** *"Here is your boarding pass. Gate B12, boarding starts at 10:15 AM."*

---

## 3. Hotel Check-In Dialogues

### Arriving at the Reception Desk
- **Guest:** *"Hello, good afternoon! I have a reservation under the name Juan."*
- **Receptionist:** *"Welcome to the Grand Central Hotel. Yes, a double room for three nights, correct?"*
- **Guest:** *"That's correct. What time is breakfast served in the morning?"*
- **Receptionist:** *"Breakfast is served from 7:00 AM to 10:30 AM in the main restaurant on the ground floor."*
- **Guest:** *"Is high-speed Wi-Fi included in the room rate?"*
- **Receptionist:** *"Yes, completely complimentary. Here is your keycard for room 402. The elevator is to your right."*

---

## 4. Pronunciation & Common Mistakes Tip
1. **Silent Letters:** En la palabra **aisle** (suena *"áil"*), la letra **s** es completamente muda. Nunca digas *"eyes-le"*.
2. **Travel vs Trip:** 
   - **Travel** es una actividad general o verbo (*"I love to travel"*).
   - **Trip** es un sustantivo para el viaje o trayecto puntual (*"Have a safe trip!"*).
`.trim();

  const lesson2Content = `
Dining out is one of the most rewarding ways to practice spoken English. In this lesson, you will learn how to make reservations, request a table, order meals politely, and ask for the bill.

---

## 1. Restaurant Vocabulary

| Término | ¿Cómo suena? (Pronunciación) | Significado / Uso |
| :--- | :--- | :--- |
| **Appetizer / Starter** | *ápetáiser / stár-ter* | Entrada o plato inicial (ensalada, sopa). |
| **Main course / Entrée** | *méin cors / on-tréi* | Plato principal fuerte. |
| **Side dish** | *sáid dish* | Guarnición (papas fritas, vegetales). |
| **Beverage / Drink** | *béveredsh / drink* | Bebida (con o sin alcohol). |
| **The bill / The check** | *de bil / de chek* | La cuenta al finalizar la comida. |
| **Tip / Gratuity** | *tip / gratúiti* | Propina por el servicio. |
| **Still / Sparkling water** | *stil / spárk-ling uóter* | Agua sin gas (still) o con gas (sparkling). |

---

## 2. Practical Restaurant Dialogue

### Seating and Ordering
- **Server:** *"Good evening! Table for two?"*
- **Customer:** *"Yes, please. Could we sit by the window?"*
- **Server:** *"Right this way. Can I start you off with something to drink?"*
- **Customer:** *"Just tap water for now, thank you. Could we have a few minutes to look over the menu?"*

### Ordering the Main Course
- **Server:** *"Are you ready to order?"*
- **Customer:** *"Yes. I'll have the grilled salmon with asparagus, please."*
- **Server:** *"Excellent choice. And for you, sir?"*
- **Customer 2:** *"Could I get the mushroom risotto? But please, could I have the sauce on the side?"*
- **Server:** *"Of course, no problem at all."*

### Asking for the Check
- **Customer:** *"Excuse me, could we have the check, please?"*
- **Server:** *"Certainly. Will you be paying together or splitting the bill?"*
- **Customer:** *"Together, please. Do you accept contactless credit cards?"*
- **Server:** *"Yes, we do. Take your time."*

---

## 3. Politeness Rule in English
Always prefer **modal verbs** for polite requests:
- Use: *"Could I have..."* or *"I would like..."* (or contracted: *"I'd like..."*).
- Avoid: *"I want the soup"* (sounds blunt and demanding to native speakers).
`.trim();

  const lesson3Content = `
In professional environments, first impressions matter. This lesson covers how to introduce yourself in business settings, deliver a concise elevator pitch, and engage in polite workplace small talk.

---

## 1. Professional Greetings & Introductions

- **Formal:** *"Good morning. It is a pleasure to meet you. My name is..."*
- **Semi-formal / Networking:** *"Hello, great to connect with you. I'm [Name], working as a [Role] at [Company]."*
- **Follow-up question:** *"How long have you been with the company?"* or *"What brings you to this conference?"*

---

## 2. Structure of the 30-Second Elevator Pitch

A successful elevator pitch answers three core questions in less than 30 seconds:
1. **Who you are:** Your background and current specialization.
2. **What problem you solve:** The impact or value you deliver to clients or your team.
3. **Your call to action / Open question:** Inviting further dialogue.

### Example Pitch:
> *"Hi, I'm Juan. I specialize in building modern, accessible web applications and AI-assisted educational platforms. Over the past three years, I've helped teams streamline interactive learning experiences for remote students. I'd love to learn more about how your team approaches digital education."*

---

## 3. Safe Workplace Small Talk Topics
- **Weather & Commute:** *"Did you have any trouble finding the venue today?"*
- **Industry Insights:** *"What did you think of the keynote presentation this morning?"*
- **Weekend / Projects:** *"Any exciting projects keeping your team busy this quarter?"*
`.trim();

  const lesson4Content = `
Effective communication in English-speaking business meetings requires active listening, tactful interruptions, and clear alignment on next steps.

---

## 1. Key Meeting Phrases & Transitions

| Purpose | Recommended Phrase |
| :--- | :--- |
| **Starting the meeting** | *"Let's get down to business. The purpose of today's meeting is..."* |
| **Staying on schedule** | *"Let's make sure we stick to the agenda so we respect everyone's time."* |
| **Asking for input** | *"Sarah, what are your thoughts on this proposal?"* |
| **Polite disagreement** | *"I see where you're coming from, but have we considered the deadline risk?"* |
| **Reaching consensus** | *"Are we all in agreement on this approach moving forward?"* |
| **Assigning next steps** | *"Let's summarize action items: who will take ownership of this task?"* |

---

## 2. Diplomatically Disagreeing
In business English, direct disagreement can sound aggressive. Use softeners:
- Instead of: *"You are wrong about the cost."*
- Use: *"I understand your point, but from our financial projections, the cost might be slightly higher."*
`.trim();

  const lesson1 = await prisma.lesson.create({
    data: {
      courseId: course1.id,
      title: 'At the Airport & Hotel: Essential Travel English',
      content: lesson1Content,
      order: 1,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      courseId: course1.id,
      title: 'Ordering Food & Dining Out: Restaurant Conversations',
      content: lesson2Content,
      order: 2,
    },
  });

  const lesson3 = await prisma.lesson.create({
    data: {
      courseId: course2.id,
      title: 'Professional Introductions & The 30-Second Elevator Pitch',
      content: lesson3Content,
      order: 1,
    },
  });

  const lesson4 = await prisma.lesson.create({
    data: {
      courseId: course2.id,
      title: 'Leading & Participating in Work Meetings',
      content: lesson4Content,
      order: 2,
    },
  });

  console.log(`📖 Lessons created:`);
  console.log(`   - Course 1: "${lesson1.title}", "${lesson2.title}"`);
  console.log(`   - Course 2: "${lesson3.title}", "${lesson4.title}"`);

  await prisma.enrollment.create({
    data: {
      userId: studentEnrolled.id,
      courseId: course1.id,
    },
  });

  console.log(`🎓 Enrollment created:`);
  console.log(`   - "${studentEnrolled.name}" matriculado en "${course1.title}"`);
  console.log(
    `   - "${studentEnrolled.name}" NO matriculado en "${course2.title}" (para probar RBAC)`,
  );
  console.log(
    `   - "${studentNoAccess.name}" NO matriculado en ningún curso (control total de acceso)`,
  );

  console.log('✅ Database seeded successfully with English learning curriculum!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
