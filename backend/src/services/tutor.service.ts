import { prisma } from '../models/prisma';
import { type ChatMessage } from '../types/tutor';
import { getAiProvider } from './ai';

export async function getOrCreateTutorSession(userId: string, lessonId: string) {
  try {
    let session = await prisma.tutorSession.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      session = await prisma.tutorSession.create({
        data: {
          userId,
          lessonId,
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    }

    return session;
  } catch (error) {
    console.error('Error in getOrCreateTutorSession:', error);
    throw error;
  }
}

export async function getTutorChatHistory(userId: string, lessonId: string) {
  try {
    const session = await prisma.tutorSession.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
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

    return session?.messages ?? [];
  } catch (error) {
    console.error('Error in getTutorChatHistory:', error);
    throw error;
  }
}

export async function askTutor(
  userId: string,
  lessonId: string,
  userMessage: string,
): Promise<
  | {
      success: true;
      data: {
        reply: string;
        userMessage: ChatMessage;
        assistantMessage: ChatMessage;
      };
    }
  | { success: false; reason: 'LESSON_NOT_FOUND' }
> {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        title: true,
        content: true,
      },
    });

    if (!lesson) {
      return { success: false, reason: 'LESSON_NOT_FOUND' };
    }

    const session = await getOrCreateTutorSession(userId, lessonId);

    const history: ChatMessage[] = session.messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const provider = getAiProvider();
    const reply = await provider.generateReply({
      lessonTitle: lesson.title,
      lessonContent: lesson.content,
      history,
      userMessage,
    });

    const [savedUserMessage, savedAssistantMessage] = await prisma.$transaction([
      prisma.tutorMessage.create({
        data: {
          sessionId: session.id,
          role: 'user',
          content: userMessage.trim(),
        },
      }),
      prisma.tutorMessage.create({
        data: {
          sessionId: session.id,
          role: 'assistant',
          content: reply,
        },
      }),
    ]);

    return {
      success: true,
      data: {
        reply,
        userMessage: {
          id: savedUserMessage.id,
          role: 'user',
          content: savedUserMessage.content,
          createdAt: savedUserMessage.createdAt,
        },
        assistantMessage: {
          id: savedAssistantMessage.id,
          role: 'assistant',
          content: savedAssistantMessage.content,
          createdAt: savedAssistantMessage.createdAt,
        },
      },
    };
  } catch (error) {
    console.error('Error in askTutor service:', error);
    throw error;
  }
}
