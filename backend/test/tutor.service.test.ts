import {
  askTutor,
  getOrCreateTutorSession,
  getTutorChatHistory,
} from '../src/services/tutor.service';
import { prisma } from '../src/models/prisma';
import { getAiProvider } from '../src/services/ai';

jest.mock('../src/models/prisma', () => ({
  prisma: {
    lesson: {
      findUnique: jest.fn(),
    },
    tutorSession: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    tutorMessage: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock('../src/services/ai', () => ({
  getAiProvider: jest.fn(),
}));

describe('Tutor Service - askTutor & Session Management', () => {
  const mockUserId = 'user-ana-123';
  const mockLessonId = 'lesson-grammar-101';
  const mockLesson = {
    id: mockLessonId,
    title: 'Past Simple vs Present Perfect',
    content: 'Learn how to use regular and irregular verbs in past tense.',
  };

  const mockSession = {
    id: 'session-xyz-789',
    userId: mockUserId,
    lessonId: mockLessonId,
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: '¿Cuándo uso had been?',
        createdAt: new Date('2026-10-20T10:00:00Z'),
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'Se usa para el pasado perfecto continuo.',
        createdAt: new Date('2026-10-20T10:00:05Z'),
      },
    ],
  };

  let mockGenerateReply: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});

    mockGenerateReply = jest
      .fn()
      .mockResolvedValue(
        'Utilizamos had been cuando una acción ocurrió antes de otro evento pasado.',
      );
    (getAiProvider as jest.Mock).mockReturnValue({
      name: 'mock',
      generateReply: mockGenerateReply,
    });
  });

  describe('askTutor', () => {
    it('returns LESSON_NOT_FOUND if the requested lesson does not exist in the database', async () => {
      (prisma.lesson.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await askTutor(mockUserId, 'invalid-lesson-id', 'Hola tutor');

      expect(result).toEqual({ success: false, reason: 'LESSON_NOT_FOUND' });
      expect(prisma.lesson.findUnique).toHaveBeenCalledWith({
        where: { id: 'invalid-lesson-id' },
        select: { id: true, title: true, content: true },
      });
      expect(getAiProvider).not.toHaveBeenCalled();
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('persists both user prompt and assistant reply atomically via prisma.$transaction when AI succeeds', async () => {
      (prisma.lesson.findUnique as jest.Mock).mockResolvedValue(mockLesson);
      (prisma.tutorSession.findUnique as jest.Mock).mockResolvedValue(mockSession);

      const savedUserMsg = {
        id: 'msg-user-new',
        sessionId: mockSession.id,
        role: 'user',
        content: '¿Cómo se dice en inglés "ayer fui al aeropuerto"?',
        createdAt: new Date('2026-10-26T20:00:00Z'),
      };
      const savedAssistantMsg = {
        id: 'msg-assistant-new',
        sessionId: mockSession.id,
        role: 'assistant',
        content: 'Utilizamos had been cuando una acción ocurrió antes de otro evento pasado.',
        createdAt: new Date('2026-10-26T20:00:03Z'),
      };

      (prisma.tutorMessage.create as jest.Mock)
        .mockReturnValueOnce('user-message-op')
        .mockReturnValueOnce('assistant-message-op');

      (prisma.$transaction as jest.Mock).mockResolvedValue([savedUserMsg, savedAssistantMsg]);

      const result = await askTutor(
        mockUserId,
        mockLessonId,
        '  ¿Cómo se dice en inglés "ayer fui al aeropuerto"?  ',
      );

      expect(mockGenerateReply).toHaveBeenCalledWith({
        lessonTitle: mockLesson.title,
        lessonContent: mockLesson.content,
        history: [
          { role: 'user', content: '¿Cuándo uso had been?' },
          { role: 'assistant', content: 'Se usa para el pasado perfecto continuo.' },
        ],
        userMessage: '  ¿Cómo se dice en inglés "ayer fui al aeropuerto"?  ',
      });

      expect(prisma.tutorMessage.create).toHaveBeenCalledWith({
        data: {
          sessionId: mockSession.id,
          role: 'user',
          content: '¿Cómo se dice en inglés "ayer fui al aeropuerto"?',
        },
      });
      expect(prisma.tutorMessage.create).toHaveBeenCalledWith({
        data: {
          sessionId: mockSession.id,
          role: 'assistant',
          content: 'Utilizamos had been cuando una acción ocurrió antes de otro evento pasado.',
        },
      });

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        success: true,
        data: {
          reply: 'Utilizamos had been cuando una acción ocurrió antes de otro evento pasado.',
          userMessage: {
            id: savedUserMsg.id,
            role: 'user',
            content: savedUserMsg.content,
            createdAt: savedUserMsg.createdAt,
          },
          assistantMessage: {
            id: savedAssistantMsg.id,
            role: 'assistant',
            content: savedAssistantMsg.content,
            createdAt: savedAssistantMsg.createdAt,
          },
        },
      });
    });

    it('prevents orphaned user messages: does NOT execute transaction if AI provider throws an error', async () => {
      (prisma.lesson.findUnique as jest.Mock).mockResolvedValue(mockLesson);
      (prisma.tutorSession.findUnique as jest.Mock).mockResolvedValue(mockSession);

      mockGenerateReply.mockRejectedValue(new Error('AI API rate limit exceeded'));

      await expect(
        askTutor(mockUserId, mockLessonId, 'Pregunta que causará fallo en la IA'),
      ).rejects.toThrow('AI API rate limit exceeded');

      expect(prisma.tutorMessage.create).not.toHaveBeenCalled();
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('throws and rolls back if database transaction fails after AI generation', async () => {
      (prisma.lesson.findUnique as jest.Mock).mockResolvedValue(mockLesson);
      (prisma.tutorSession.findUnique as jest.Mock).mockResolvedValue(mockSession);

      (prisma.$transaction as jest.Mock).mockRejectedValue(
        new Error('PostgreSQL connection dropped'),
      );

      await expect(
        askTutor(mockUserId, mockLessonId, 'Pregunta válida con fallo en DB'),
      ).rejects.toThrow('PostgreSQL connection dropped');

      expect(mockGenerateReply).toHaveBeenCalled();
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe('getOrCreateTutorSession', () => {
    it('returns existing session if found', async () => {
      (prisma.tutorSession.findUnique as jest.Mock).mockResolvedValue(mockSession);

      const session = await getOrCreateTutorSession(mockUserId, mockLessonId);

      expect(session).toEqual(mockSession);
      expect(prisma.tutorSession.create).not.toHaveBeenCalled();
    });

    it('creates and returns a new session if none exists', async () => {
      (prisma.tutorSession.findUnique as jest.Mock).mockResolvedValue(null);
      const newSession = {
        id: 'new-session-id',
        userId: mockUserId,
        lessonId: mockLessonId,
        messages: [],
      };
      (prisma.tutorSession.create as jest.Mock).mockResolvedValue(newSession);

      const session = await getOrCreateTutorSession(mockUserId, mockLessonId);

      expect(session).toEqual(newSession);
      expect(prisma.tutorSession.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          lessonId: mockLessonId,
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    });
  });

  describe('getTutorChatHistory', () => {
    it('returns session messages in chronological order if session exists', async () => {
      (prisma.tutorSession.findUnique as jest.Mock).mockResolvedValue({
        messages: mockSession.messages,
      });

      const history = await getTutorChatHistory(mockUserId, mockLessonId);

      expect(history).toEqual(mockSession.messages);
      expect(prisma.tutorSession.findUnique).toHaveBeenCalledWith({
        where: {
          userId_lessonId: {
            userId: mockUserId,
            lessonId: mockLessonId,
          },
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            select: {
              id: true,
              role: true,
              content: true,
              createdAt: true,
            },
          },
        },
      });
    });

    it('returns an empty array if no session exists yet for the user and lesson', async () => {
      (prisma.tutorSession.findUnique as jest.Mock).mockResolvedValue(null);

      const history = await getTutorChatHistory(mockUserId, mockLessonId);

      expect(history).toEqual([]);
    });
  });
});
