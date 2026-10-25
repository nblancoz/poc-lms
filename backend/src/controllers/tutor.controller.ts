import { type Request, type Response } from 'express';
import { chatMessageSchema } from '../schemas/tutor.schema';
import { askTutor, getTutorChatHistory } from '../services/tutor.service';

function getParamString(param: string | string[] | undefined): string | null {
  if (typeof param === 'string') return param;
  if (Array.isArray(param) && typeof param[0] === 'string') return param[0];
  return null;
}

export const tutorController = {
  chat: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        return;
      }

      const lessonId = getParamString(req.params.id);
      if (!lessonId) {
        res.status(400).json({ error: 'Bad Request', message: 'Lesson ID is required' });
        return;
      }

      const parsed = chatMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid chat message payload',
          details: parsed.error.issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        });
        return;
      }

      const result = await askTutor(userId, lessonId, parsed.data.message);

      if (!result.success) {
        if (result.reason === 'LESSON_NOT_FOUND') {
          res.status(404).json({ error: 'Not Found', message: 'Lesson not found' });
          return;
        }

        res.status(400).json({ error: 'Bad Request', message: 'Unable to process chat request' });
        return;
      }

      res.json(result.data);
    } catch (error) {
      console.error('Error in tutorController.chat:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to process message with AI tutor',
      });
    }
  },

  getHistory: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        return;
      }

      const lessonId = getParamString(req.params.id);
      if (!lessonId) {
        res.status(400).json({ error: 'Bad Request', message: 'Lesson ID is required' });
        return;
      }

      const messages = await getTutorChatHistory(userId, lessonId);
      res.json({ messages });
    } catch (error) {
      console.error('Error in tutorController.getHistory:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve tutor chat history',
      });
    }
  },
};
