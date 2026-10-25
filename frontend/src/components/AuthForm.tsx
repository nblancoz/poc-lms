import { useState, type SyntheticEvent } from 'react';
import { useAuth } from '../context/useAuth';
import { Alert } from './ui/Alert';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Tabs, type TabItem } from './ui/Tabs';

type AuthTab = 'login' | 'register';

const AUTH_TABS: Array<TabItem<AuthTab>> = [
  { key: 'login', label: 'Iniciar sesión' },
  { key: 'register', label: 'Registrarse' },
];

export function AuthForm() {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<AuthTab>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorMessage(null);

    if (tab === 'register' && !name.trim()) {
      setErrorMessage('Por favor ingresa tu nombre completo');
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);

    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ocurrió un error inesperado al procesar la solicitud');
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleTabChange(newTab: AuthTab) {
    setTab(newTab);
    setErrorMessage(null);
  }

  return (
    <Card>
      <Tabs items={AUTH_TABS} activeTab={tab} onChange={handleTabChange} />

      {errorMessage && <Alert variant="error">{errorMessage}</Alert>}

      <form onSubmit={handleSubmit} noValidate>
        {tab === 'register' && (
          <Input
            id="register-name"
            label="Nombre completo"
            type="text"
            placeholder="Ej. Juan Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        )}

        <Input
          id="auth-email"
          label="Correo electrónico"
          type="email"
          placeholder="usuario@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="email"
        />

        <Input
          id="auth-password"
          label="Contraseña"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
        />

        <div style={{ marginTop: '24px' }}>
          <Button type="submit" variant="solid" fullWidth isLoading={isLoading}>
            {tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
