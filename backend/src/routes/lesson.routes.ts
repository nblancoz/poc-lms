import { Router } from 'express';
import { lessonController } from '../controllers/lesson.controller';
import { tutorController } from '../controllers/tutor.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireLessonEnrollment } from '../middlewares/enrollment.middleware';

export const lessonRouter = Router();

// Lesson content
lessonRouter.get('/:id', authenticate, requireLessonEnrollment, lessonController.getById);

// AI tutor
lessonRouter.get('/:id/chat', authenticate, requireLessonEnrollment, tutorController.getHistory);
lessonRouter.post('/:id/chat', authenticate, requireLessonEnrollment, tutorController.chat);
