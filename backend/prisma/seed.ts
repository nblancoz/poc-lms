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

  const course = await prisma.course.create({
    data: {
      title: 'Desarrollo Avanzado con TypeScript y Arquitectura de Software',
      description:
        'Curso completo sobre tipado estático, buenas prácticas de desarrollo en TypeScript y patrones arquitectónicos modernos como Arquitectura Hexagonal.',
    },
  });

  console.log(`📚 Course created: "${course.title}"`);

  const lesson1Content = `
# Lección 1: Fundamentos de TypeScript y Tipado Estático

TypeScript es un superset tipado de JavaScript desarrollado por Microsoft que añade tipado estático opcional y características avanzadas al lenguaje. Todo código JavaScript válido es código TypeScript válido.

## Beneficios Principales
1. **Detección temprana de errores**: Los errores de tipo se detectan en tiempo de compilación y no en tiempo de ejecución en producción.
2. **Autocompletado y refactorización segura**: Los IDEs proporcionan IntelliSense contextual preciso.
3. **Documentación viva**: Los tipos sirven como especificación clara del contrato de las funciones y componentes.

## Tipos Básicos
- Primitivos: \`string\`, \`number\`, \`boolean\`, \`null\`, \`undefined\`, \`symbol\`, \`bigint\`.
- Especiales: \`any\` (desactiva comprobaciones de tipo, evitar cuando sea posible), \`unknown\` (tipo seguro opuesto a any, exige comprobación previa antes de operar), \`void\` (funciones sin retorno), \`never\` (valores que nunca ocurren, como funciones que siempre lanzan excepción).

## Interfaces vs Types
- **Interfaces**: Ideales para definir la forma de objetos y contratos extensibles mediante declaración abierta (\`declaration merging\`) y herencia con \`extends\`.
- **Type Aliases**: Más versátiles para uniones (\`type Status = 'pending' | 'success' | 'error'\`), tuplas, tipos primitivos y tipos mapeados.

## Type Narrowing (Estrechamiento de Tipos)
TypeScript utiliza comprobaciones de control de flujo en tiempo de ejecución para reducir un tipo amplio a uno más específico:
- Operador \`typeof\` (para primitivos: \`typeof x === 'string'\`).
- Operador \`instanceof\` (para instancias de clases).
- Discriminación mediante campos literales comunes (\`Discriminated Unions\`).
- Predicados de tipo personalizados (\`function isFish(pet: Pet): pet is Fish\`).
`.trim();

  const lesson2Content = `
# Lección 2: Arquitectura Hexagonal y Puertos y Adaptadores

La Arquitectura Hexagonal (también conocida como patrón de Puertos y Adaptadores) fue acuñada por Alistair Cockburn con el objetivo de aislar el núcleo del dominio de negocio de las tecnologías externas y de la infraestructura.

## Principios Fundamentales
1. **Independencia tecnológica**: El núcleo de la aplicación no debe saber nada sobre bases de datos, frameworks HTTP, interfaces gráficas o APIs externas.
2. **Regla de Dependencia**: Las dependencias siempre apuntan hacia adentro, hacia el dominio.
3. **Facilidad de pruebas**: Al no acoplarse a tecnologías externas, el dominio y los casos de uso se pueden probar con tests unitarios rápidos mediante mocks de los puertos.

## Componentes Clave
- **Dominio / Entidades**: Reglas de negocio puras y objetos de valor sin dependencias de librerías externas.
- **Puertos**: Interfaces que definen los contratos de comunicación:
  - *Puertos de entrada (Driving/Primary)*: Casos de uso ejecutados por actores externos (controladores web, CLI).
  - *Puertos de salida (Driven/Secondary)*: Interfaces implementadas por la infraestructura (repositorios de base de datos, clientes de correo, proveedores de LLM o síntesis de voz).
- **Adaptadores**: Implementaciones concretas de los puertos:
  - *Adaptadores de entrada*: Controladores Express, componentes UI de React.
  - *Adaptadores de salida*: Implementación de Prisma/PostgreSQL, llamadas a Gemini API, Web Speech API.
`.trim();

  const lesson1 = await prisma.lesson.create({
    data: {
      courseId: course.id,
      title: 'Fundamentos de TypeScript y Tipado Estático',
      content: lesson1Content,
      order: 1,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      courseId: course.id,
      title: 'Arquitectura Hexagonal y Puertos y Adaptadores',
      content: lesson2Content,
      order: 2,
    },
  });

  console.log(`📖 Lessons created:`);
  console.log(`   1. "${lesson1.title}"`);
  console.log(`   2. "${lesson2.title}"`);

  await prisma.enrollment.create({
    data: {
      userId: studentEnrolled.id,
      courseId: course.id,
    },
  });

  console.log(`🎓 Enrollment created:`);
  console.log(`   - "${studentEnrolled.name}" matriculado en "${course.title}"`);
  console.log(`   - "${studentNoAccess.name}" NO está matriculado`);

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
