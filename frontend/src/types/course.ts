import type { LessonSummary } from './lesson';

export interface Course {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  lessonsCount: number;
  isEnrolled: boolean;
}

export interface CourseWithLessons extends Course {
  lessons: LessonSummary[];
}

export type CourseSummary = Course;
export type CourseDetail = CourseWithLessons;
