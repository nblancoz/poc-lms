import { prisma } from '../models/prisma';

export async function listCourses(userId?: string) {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        lessons: {
          select: {
            id: true,
            title: true,
            order: true,
          },
          orderBy: { order: 'asc' },
        },
        enrollments: userId
          ? {
              where: { userId },
            }
          : false,
      },
    });

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      createdAt: course.createdAt,
      lessonsCount: course.lessons.length,
      lessons: course.lessons,
      isEnrolled: Boolean(course.enrollments && course.enrollments.length > 0),
    }));
  } catch (error) {
    console.error('Error in listCourses service:', error);
    throw error;
  }
}

export async function getCourseById(courseId: string, userId?: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          select: {
            id: true,
            title: true,
            order: true,
          },
          orderBy: { order: 'asc' },
        },
        enrollments: userId
          ? {
              where: { userId },
            }
          : false,
      },
    });

    if (!course) {
      return null;
    }

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      createdAt: course.createdAt,
      lessons: course.lessons,
      isEnrolled: Boolean(course.enrollments && course.enrollments.length > 0),
    };
  } catch (error) {
    console.error('Error in getCourseById service:', error);
    throw error;
  }
}

export async function enrollInCourse(
  courseId: string,
  userId: string,
): Promise<
  | { success: true; data: { userId: string; courseId: string; createdAt: Date } }
  | { success: false; reason: 'COURSE_NOT_FOUND' | 'ALREADY_ENROLLED' }
> {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return { success: false, reason: 'COURSE_NOT_FOUND' };
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return { success: false, reason: 'ALREADY_ENROLLED' };
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });

    return { success: true, data: enrollment };
  } catch (error) {
    console.error('Error in enrollInCourse service:', error);
    throw error;
  }
}
