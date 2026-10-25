export interface LessonSummary {
  id: string;
  courseId?: string;
  title: string;
  order: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type LessonDetail = Lesson;
