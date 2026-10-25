import { BackButton } from '../ui/BackButton';
import { Button } from '../ui/Button';

export interface LessonAccessDeniedProps {
  onBack: () => void;
  onEnroll?: (() => void) | undefined;
  isEnrolling?: boolean | undefined;
}

export function LessonAccessDenied({
  onBack,
  onEnroll,
  isEnrolling = false,
}: LessonAccessDeniedProps) {
  return (
    <div className="forbidden-box" role="alert">
      <h3 className="forbidden-title">Acceso Restringido a la Lección</h3>
      <p className="forbidden-desc">
        No tienes una matrícula activa en el curso al que pertenece esta lección. Para acceder al
        contenido y consultar con el tutor de IA, debes estar matriculado.
      </p>

      <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
        <BackButton onClick={onBack} />
        {onEnroll && (
          <Button variant="solid" size="sm" onClick={onEnroll} isLoading={isEnrolling}>
            Matricularme ahora
          </Button>
        )}
      </div>
    </div>
  );
}
