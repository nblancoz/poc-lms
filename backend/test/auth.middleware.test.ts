import { type NextFunction, type Request, type Response } from 'express';
import { authenticate } from '../src/middlewares/auth.middleware';
import * as authService from '../src/services/auth.service';
import { type JwtUserPayload } from '../src/types/auth';

type MockRequest = Partial<Request> & {
  user?: JwtUserPayload | undefined;
};

jest.mock('../src/services/auth.service', () => ({
  verifyToken: jest.fn(),
}));

describe('Authentication Middleware (authenticate)', () => {
  let req: MockRequest;
  let res: Partial<Response>;
  let next: NextFunction;

  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    req = {
      headers: {},
    };
    res = {
      status: statusMock as unknown as Response['status'],
      json: jsonMock as unknown as Response['json'],
    };
    next = jest.fn();
  });

  it('rejects with 401 when Authorization header is missing', () => {
    authenticate(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ error: 'Unauthorized' }));
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects with 401 when Authorization header does not start with Bearer', () => {
    req.headers = { authorization: 'Basic 123456' };

    authenticate(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects with 401 when token verification fails or token is expired', () => {
    req.headers = { authorization: 'Bearer invalid.token.payload' };
    jest.mocked(authService.verifyToken).mockReturnValue(null);

    authenticate(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('populates req.user and invokes next() when valid token is provided', () => {
    const mockUser = {
      id: 'user-carlos',
      email: 'carlos@example.com',
      name: 'Carlos Alumno',
    };
    req.headers = { authorization: 'Bearer valid.jwt.token' };
    jest.mocked(authService.verifyToken).mockReturnValue(mockUser);

    authenticate(req as Request, res as Response, next);

    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalledTimes(1);
    expect(statusMock).not.toHaveBeenCalled();
  });
});
