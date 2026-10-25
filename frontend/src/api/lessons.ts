import { apiClient } from './client';
import type { LessonDetail } from '../types/lesson';

export async function fetchLessonById(lessonId: string): Promise<LessonDetail> {
  const { data } = await apiClient.get<{ lesson: LessonDetail }>(`/api/lessons/${lessonId}`);
  return data.lesson;
}
