import { apiClient } from './client';
import type {
  SendTutorMessageResponse,
  TutorChatHistoryResponse,
  TutorMessage,
} from '../types/tutor';

export async function fetchTutorChatHistory(lessonId: string): Promise<TutorMessage[]> {
  const response = await apiClient.get<TutorChatHistoryResponse>(`/api/lessons/${lessonId}/chat`);
  return response.data.messages;
}

export async function sendTutorChatMessage(
  lessonId: string,
  message: string,
): Promise<SendTutorMessageResponse> {
  const response = await apiClient.post<SendTutorMessageResponse>(`/api/lessons/${lessonId}/chat`, {
    message,
  });
  return response.data;
}
