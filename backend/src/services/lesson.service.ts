import { prisma } from '../models/prisma';

export async function getLessonById(lessonId: string) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return lesson;
  } catch (error) {
    console.error('Error in getLessonById service:', error);
    throw error;
  }
}
