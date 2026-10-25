import { useAuth } from '../context/useAuth';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-title">
          <span>LMS Platform</span>
          <Badge variant="brand">PoC</Badge>
        </div>

        {user && (
          <div className="header-user">
            <span className="header-user-email">{user.email}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
