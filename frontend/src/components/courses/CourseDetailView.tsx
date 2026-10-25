import type { ReactNode } from 'react';
import type { Course } from '../../types/course';
import { Alert } from '../ui/Alert';
import { BackButton } from '../ui/BackButton';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export interface CourseDetailViewProps {
  course: Course;
  onBack: () => void;
  onEnroll: () => void;
  isEnrolling: boolean;
  enrollError?: string | null;
  children?: ReactNode;
}

export function CourseDetailView({
  course,
  onBack,
  onEnroll,
  isEnrolling,
  enrollError,
  children,
}: CourseDetailViewProps) {
  return (
    <Card className="course-card-content">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <BackButton onClick={onBack}>Todos los cursos</BackButton>
        <Badge variant={course.isEnrolled ? 'enrolled' : 'noaccess'}>
          {course.isEnrolled ? 'Matrícula activa' : 'Sin matrícula'}
        </Badge>
      </div>

      <div style={{ marginTop: '8px' }}>
        <h2 className="section-title" style={{ fontSize: '1.2rem' }}>
          {course.title}
        </h2>
        <p className="course-card-desc" style={{ marginTop: '4px' }}>
          {course.description}
        </p>
      </div>

      {enrollError && (
        <Alert variant="error" style={{ marginTop: '12px' }}>
          {enrollError}
        </Alert>
      )}

      {!course.isEnrolled && (
        <Alert variant="warning" style={{ marginTop: '14px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
              width: '100%',
            }}
          >
            <span>
              No estás matriculado en este curso. Matricúlate para desbloquear el contenido.
            </span>
            <Button variant="solid" size="sm" onClick={onEnroll} isLoading={isEnrolling}>
              Inscribirme al curso
            </Button>
          </div>
        </Alert>
      )}

      {children}
    </Card>
  );
}
