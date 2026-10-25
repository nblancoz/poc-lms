import { useCallback, useEffect, useState } from 'react';
import { enrollInCourse, fetchCourseById, fetchCourses } from '../api/courses';
import type { CourseDetail, CourseSummary } from '../types/course';

export type DashboardView =
  | { mode: 'catalog' }
  | { mode: 'course'; courseId: string }
  | { mode: 'lesson'; courseId: string; lessonId: string };

export function useLearningDashboard() {
  const [view, setView] = useState<DashboardView>({ mode: 'catalog' });

  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  const [selectedCourse, setSelectedCourse] = useState<CourseDetail | null>(null);
  const [loadingCourseDetail, setLoadingCourseDetail] = useState<boolean>(false);
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    setLoadingCourses(true);
    setCoursesError(null);
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (err: unknown) {
      setCoursesError(err instanceof Error ? err.message : 'Error al cargar los cursos');
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  const loadCourseDetail = useCallback(async (courseId: string) => {
    setLoadingCourseDetail(true);
    try {
      const data = await fetchCourseById(courseId);
      setSelectedCourse(data);
    } catch (err: unknown) {
      console.error('Failed to load course details:', err);
    } finally {
      setLoadingCourseDetail(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchCourses()
      .then((data) => {
        if (isMounted) {
          setCourses(data);
          setCoursesError(null);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setCoursesError(err instanceof Error ? err.message : 'Error al cargar los cursos');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoadingCourses(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function handleSelectCourse(courseId: string) {
    setEnrollError(null);
    setView({ mode: 'course', courseId });
    void loadCourseDetail(courseId);
  }

  function handleBackToCatalog() {
    setEnrollError(null);
    setView({ mode: 'catalog' });
    setSelectedCourse(null);
    void loadCourses();
  }

  function handleSelectLesson(courseId: string, lessonId: string) {
    setEnrollError(null);
    setView({ mode: 'lesson', courseId, lessonId });
  }

  function handleBackToCourse(courseId: string) {
    setEnrollError(null);
    setView({ mode: 'course', courseId });
    void loadCourseDetail(courseId);
  }

  async function handleEnroll(courseId: string) {
    setIsEnrolling(true);
    setEnrollError(null);
    try {
      await enrollInCourse(courseId);
      await loadCourseDetail(courseId);
      await loadCourses();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al inscribirse en el curso';
      setEnrollError(message);
      throw err;
    } finally {
      setIsEnrolling(false);
    }
  }

  return {
    view,
    courses,
    loadingCourses,
    coursesError,
    selectedCourse,
    loadingCourseDetail,
    isEnrolling,
    enrollError,
    handleSelectCourse,
    handleBackToCatalog,
    handleSelectLesson,
    handleBackToCourse,
    handleEnroll,
  };
}
