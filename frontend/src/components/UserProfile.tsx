import { PRESET_USERS, useAuth } from '../context';
import { Badge, Button, Card } from './ui';

export function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const isEnrolled = user.email === PRESET_USERS.enrolled.email;
  const isNoAccess = user.email === PRESET_USERS.noaccess.email;

  const statusLabel = isEnrolled
    ? 'Matrícula activa'
    : isNoAccess
      ? 'Sin matrícula'
      : 'Usuario estándar';

  const statusClass = isEnrolled ? 'enrolled' : isNoAccess ? 'noaccess' : 'custom';

  return (
    <Card className="profile-view">
      <div className="profile-header">
        <div>
          <h1 className="profile-title">{user.name}</h1>
          <p className="profile-sub">{user.email}</p>
        </div>
        <Badge variant={statusClass}>{statusLabel}</Badge>
      </div>

      <Button variant="outline" fullWidth onClick={logout}>
        Cerrar sesión
      </Button>
    </Card>
  );
}
