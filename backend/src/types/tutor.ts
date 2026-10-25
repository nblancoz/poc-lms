export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id?: string;
  role: MessageRole;
  content: string;
  createdAt?: Date;
}

export interface TutorPromptContext {
  lessonTitle: string;
  lessonContent: string;
  history: ChatMessage[];
  userMessage: string;
}

export interface AiProvider {
  name: string;
  generateReply(context: TutorPromptContext): Promise<string>;
}
