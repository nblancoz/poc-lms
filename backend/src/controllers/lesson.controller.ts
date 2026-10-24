import { type Request, type Response } from 'express';
import { getLessonById } from '../services/lesson.service';

function getParamString(param: string | string[] | undefined): string | null {
  if (typeof param === 'string') return param;
  if (Array.isArray(param) && typeof param[0] === 'string') return param[0];
  return null;
}

export const lessonController = {
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const lessonId = getParamString(req.params.lessonId || req.params.id);
      if (!lessonId) {
        res.status(400).json({ error: 'Bad Request', message: 'Lesson ID is required' });
        return;
      }

      const lesson = await getLessonById(lessonId);
      if (!lesson) {
        res.status(404).json({ error: 'Not Found', message: 'Lesson not found' });
        return;
      }

      res.json({ lesson });
    } catch (error) {
      console.error('Error in lessonController.getById:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve lesson content',
      });
    }
  },
};
