import { Router } from 'express';
import { courseController } from '../controllers/course.controller';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware';

export const courseRouter = Router();

courseRouter.get('/', optionalAuthenticate, courseController.getAll);
courseRouter.get('/:id', optionalAuthenticate, courseController.getById);
courseRouter.post('/:id/enroll', authenticate, courseController.enroll);
