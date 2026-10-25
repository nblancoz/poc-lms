import { apiClient } from './client';
import type { CourseDetail, CourseSummary } from '../types/course';

export async function fetchCourses(): Promise<CourseSummary[]> {
  const { data } = await apiClient.get<{ courses: CourseSummary[] }>('/api/courses');
  return data.courses;
}

export async function fetchCourseById(courseId: string): Promise<CourseDetail> {
  const { data } = await apiClient.get<{ course: CourseDetail }>(`/api/courses/${courseId}`);
  return data.course;
}

export async function enrollInCourse(courseId: string): Promise<void> {
  await apiClient.post(`/api/courses/${courseId}/enroll`);
}
