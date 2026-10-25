export type PresetUserType = 'enrolled' | 'noaccess';

export const PRESET_USERS = {
  enrolled: {
    email: 'student.enrolled@example.com',
    password: 'password123',
    name: 'Alumno Matriculado',
    description: 'Tiene matrícula activa en el curso de TypeScript.',
  },
  noaccess: {
    email: 'student.noaccess@example.com',
    password: 'password123',
    name: 'Alumno Sin Acceso',
    description: 'No está matriculado. Ideal para probar el 403 Forbidden.',
  },
} as const;
