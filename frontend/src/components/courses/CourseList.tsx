import type { CourseSummary } from '../../types/course';
import { Alert } from '../ui/Alert';
import { Card } from '../ui/Card';
import { CourseCard } from './CourseCard';

export interface CourseListProps {
  courses: CourseSummary[];
  isLoading: boolean;
  error: string | null;
  onSelectCourse: (courseId: string) => void;
}

export function CourseList({ courses, isLoading, error, onSelectCourse }: CourseListProps) {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <span className="spinner-md" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  if (courses.length === 0) {
    return (
      <Card>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.875rem' }}>
          No hay cursos disponibles en este momento.
        </p>
      </Card>
    );
  }

  return (
    <section aria-label="Catálogo de cursos">
      <div className="section-header">
        <h2 className="section-title">Cursos disponibles</h2>
        <p className="section-subtitle">
          Selecciona un curso para explorar su temario y acceder a las lecciones.
        </p>
      </div>

      <div className="course-grid">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} onSelect={onSelectCourse} />
        ))}
      </div>
    </section>
  );
}
