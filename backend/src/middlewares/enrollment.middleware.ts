import { type NextFunction, type Request, type Response } from 'express';
import { prisma } from '../models/prisma';

export async function requireLessonEnrollment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    const rawLessonId = req.params.lessonId || req.params.id;
    const lessonId = typeof rawLessonId === 'string' ? rawLessonId : rawLessonId?.[0];

    if (!lessonId) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Lesson ID is required',
      });
      return;
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, courseId: true },
    });

    if (!lesson) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Lesson not found',
      });
      return;
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.courseId,
        },
      },
    });

    if (!enrollment) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You are not enrolled in this course',
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Error in requireLessonEnrollment middleware:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to verify course enrollment',
    });
  }
}
