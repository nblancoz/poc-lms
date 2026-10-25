export type PresetUserType = 'enrolled' | 'noaccess';

export const PRESET_USERS = {
  enrolled: {
    email: 'student.enrolled@example.com',
    password: 'password123',
    name: 'Alumno Matriculado',
    description: 'Tiene matrícula activa.',
  },
  noaccess: {
    email: 'student.noaccess@example.com',
    password: 'password123',
    name: 'Alumno Sin Acceso',
    description: 'No está matriculado.',
  },
} as const;
