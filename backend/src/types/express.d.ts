import { type JwtUserPayload } from './auth';

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload | undefined;
    }
  }
}

export {};
