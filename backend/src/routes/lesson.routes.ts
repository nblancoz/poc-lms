import { Router } from 'express';
import { lessonController } from '../controllers/lesson.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireLessonEnrollment } from '../middlewares/enrollment.middleware';

export const lessonRouter = Router();

lessonRouter.get('/:id', authenticate, requireLessonEnrollment, lessonController.getById);
