import { type Request, type Response } from 'express';
import { enrollInCourse, getCourseById, listCourses } from '../services/course.service';

function getParamString(param: string | string[] | undefined): string | null {
  if (typeof param === 'string') return param;
  if (Array.isArray(param) && typeof param[0] === 'string') return param[0];
  return null;
}

export const courseController = {
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const courses = await listCourses(req.user?.id);
      res.json({ courses });
    } catch (error) {
      console.error('Error in courseController.getAll:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve courses',
      });
    }
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getParamString(req.params.id);
      if (!id) {
        res.status(400).json({ error: 'Bad Request', message: 'Course ID is required' });
        return;
      }

      const course = await getCourseById(id, req.user?.id);
      if (!course) {
        res.status(404).json({ error: 'Not Found', message: 'Course not found' });
        return;
      }

      res.json({ course });
    } catch (error) {
      console.error('Error in courseController.getById:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve course details',
      });
    }
  },

  enroll: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        return;
      }

      const courseId = getParamString(req.params.id);
      if (!courseId) {
        res.status(400).json({ error: 'Bad Request', message: 'Course ID is required' });
        return;
      }

      const result = await enrollInCourse(courseId, userId);

      if (!result.success) {
        if (result.reason === 'COURSE_NOT_FOUND') {
          res.status(404).json({ error: 'Not Found', message: 'Course not found' });
          return;
        }

        if (result.reason === 'ALREADY_ENROLLED') {
          res.status(409).json({
            error: 'Conflict',
            message: 'You are already enrolled in this course',
          });
          return;
        }

        res.status(400).json({ error: 'Bad Request', message: 'Unable to enroll in course' });
        return;
      }

      res.status(201).json({
        message: 'Enrolled successfully',
        enrollment: result.data,
      });
    } catch (error) {
      console.error('Error in courseController.enroll:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to enroll in course',
      });
    }
  },
};
