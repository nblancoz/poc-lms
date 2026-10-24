import { type NextFunction, type Request, type Response } from 'express';
import { verifyToken } from '../services/auth.service';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or malformed Authorization header with Bearer token',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Token not provided',
    });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
    return;
  }

  req.user = payload;
  next();
}

export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        req.user = payload;
      }
    }
  }

  next();
}
