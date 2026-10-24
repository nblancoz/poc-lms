import { type Request, type Response } from 'express';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { loginUser, registerUser } from '../services/auth.service';

export const authController = {
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const parseResult = registerSchema.safeParse(req.body);

      if (!parseResult.success) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Validation failed',
          details: parseResult.error.flatten().fieldErrors,
        });
        return;
      }

      const { name, email, password } = parseResult.data;
      const result = await registerUser(name, email, password);

      if (!result.success) {
        res.status(409).json({
          error: 'Conflict',
          message: 'Email is already registered',
        });
        return;
      }

      res.status(201).json(result.data);
    } catch (error) {
      console.error('Error in authController.register:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred while registering the user',
      });
    }
  },

  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const parseResult = loginSchema.safeParse(req.body);

      if (!parseResult.success) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Validation failed',
          details: parseResult.error.flatten().fieldErrors,
        });
        return;
      }

      const { email, password } = parseResult.data;
      const result = await loginUser(email, password);

      if (!result) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid email or password',
        });
        return;
      }

      res.json(result);
    } catch (error) {
      console.error('Error in authController.login:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred while logging in',
      });
    }
  },

  me: (req: Request, res: Response): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    res.json({ user: req.user });
  },
};
