import type { LessonSummary } from '../../types/lesson';
import { Badge } from '../ui/Badge';
import { StatusDot } from '../ui/StatusDot';

export interface LessonListProps {
  lessons: LessonSummary[];
  isEnrolled: boolean;
  activeLessonId?: string;
  onSelectLesson: (lessonId: string) => void;
}

export function LessonList({
  lessons,
  isEnrolled,
  activeLessonId,
  onSelectLesson,
}: LessonListProps) {
  if (lessons.length === 0) {
    return (
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '12px 0' }}>
        No hay lecciones registradas en este curso.
      </p>
    );
  }

  return (
    <div className="lesson-list">
      {lessons.map((lesson) => {
        const isActive = activeLessonId === lesson.id;

        return (
          <button
            key={lesson.id}
            type="button"
            className={`lesson-row ${isActive ? 'active' : ''}`}
            onClick={() => onSelectLesson(lesson.id)}
          >
            <div className="lesson-row-left">
              <span className="lesson-order">{lesson.order}</span>
              <span className="lesson-title">{lesson.title}</span>
            </div>

            <div className="lesson-row-right">
              {isEnrolled ? (
                <StatusDot variant="enrolled" />
              ) : (
                <Badge variant="noaccess">Bloqueada</Badge>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
