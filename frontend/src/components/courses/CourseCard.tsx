import type { CourseSummary } from '../../types/course';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export interface CourseCardProps {
  course: CourseSummary;
  onSelect: (courseId: string) => void;
}

export function CourseCard({ course, onSelect }: CourseCardProps) {
  return (
    <Card className="course-card-content">
      <div className="course-card-top">
        <h3 className="course-card-title">{course.title}</h3>
        <Badge variant={course.isEnrolled ? 'enrolled' : 'custom'}>
          {course.isEnrolled ? 'Matriculado' : 'Disponible'}
        </Badge>
      </div>

      <p className="course-card-desc">{course.description}</p>

      <div className="course-card-footer">
        <span className="course-card-meta">
          {course.lessonsCount} {course.lessonsCount === 1 ? 'lección' : 'lecciones'}
        </span>
        <Button variant="outline" size="sm" onClick={() => onSelect(course.id)}>
          Ver temario
        </Button>
      </div>
    </Card>
  );
}
