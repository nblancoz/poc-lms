export type TutorMessageRole = 'user' | 'assistant';

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
