import { type NextFunction, type Request, type Response } from 'express';
import { requireLessonEnrollment } from '../src/middlewares/enrollment.middleware';
import { prisma } from '../src/models/prisma';
import { type JwtUserPayload } from '../src/types/auth';

type MockRequest = Partial<Request> & {
  user?: JwtUserPayload | undefined;
};

jest.mock('../src/models/prisma', () => ({
  prisma: {
    lesson: {
      findUnique: jest.fn(),
    },
    enrollment: {
      findUnique: jest.fn(),
    },
  },
}));

describe('Access Control Middleware (requireLessonEnrollment)', () => {
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
      params: { id: 'lesson-123' },
      user: { id: 'user-carlos', email: 'carlos@example.com', name: 'Carlos' },
    };
    res = {
      status: statusMock as unknown as Response['status'],
      json: jsonMock as unknown as Response['json'],
    };
    next = jest.fn();
  });

  it('rejects with 401 Unauthorized if user is not authenticated', async () => {
    req.user = undefined;

    await requireLessonEnrollment(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ error: 'Unauthorized' }));
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects with 400 Bad Request if lessonId parameter is missing', async () => {
    req.params = {};

    await requireLessonEnrollment(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ error: 'Bad Request' }));
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects with 404 Not Found if lesson does not exist', async () => {
    jest.mocked(prisma.lesson.findUnique).mockResolvedValue(null);

    await requireLessonEnrollment(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ error: 'Not Found' }));
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects with 403 Forbidden if user is NOT enrolled in the lesson course (Lucía scenario)', async () => {
    jest.mocked(prisma.lesson.findUnique).mockResolvedValue({
      id: 'lesson-123',
      courseId: 'course-travel',
    } as any);

    jest.mocked(prisma.enrollment.findUnique).mockResolvedValue(null);

    await requireLessonEnrollment(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Forbidden',
      message: 'You are not enrolled in this course',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('grants access and calls next() if user IS enrolled in the lesson course (Carlos scenario)', async () => {
    jest.mocked(prisma.lesson.findUnique).mockResolvedValue({
      id: 'lesson-123',
      courseId: 'course-travel',
    } as any);

    jest.mocked(prisma.enrollment.findUnique).mockResolvedValue({
      id: 'enroll-1',
      userId: 'user-carlos',
      courseId: 'course-travel',
      createdAt: new Date(),
    } as any);

    await requireLessonEnrollment(req as Request, res as Response, next);

    expect(statusMock).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
});
