export type TutorMessageRole = 'user' | 'assistant';
export type TutorInteractionStatus = 'ready' | 'thinking' | 'offline' | 'error';

export interface TutorMessage {
  id: string;
  role: TutorMessageRole;
  content: string;
  createdAt: string;
}

export interface TutorChatHistoryResponse {
  messages: TutorMessage[];
}

export interface SendTutorMessageResponse {
  reply: string;
  userMessage: TutorMessage;
  assistantMessage: TutorMessage;
}
