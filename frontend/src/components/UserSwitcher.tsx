import { useState } from 'react';
import { PRESET_USERS, type PresetUserType } from '../context/presets';
import { useAuth } from '../context/useAuth';
import { Alert } from './ui/Alert';
import { Card } from './ui/Card';
import { SelectableCard } from './ui/SelectableCard';
import { StatusDot, type StatusDotProps } from './ui/StatusDot';

interface PresetItem {
  key: PresetUserType;
  data: (typeof PRESET_USERS)[PresetUserType];
  dotVariant: StatusDotProps['variant'];
}

const PRESET_ITEMS: PresetItem[] = [
  { key: 'enrolled', data: PRESET_USERS.enrolled, dotVariant: 'enrolled' },
  { key: 'noaccess', data: PRESET_USERS.noaccess, dotVariant: 'noaccess' },
];

export function UserSwitcher() {
  const { user, quickLogin } = useAuth();
  const [switching, setSwitching] = useState<PresetUserType | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSwitch(preset: PresetUserType) {
    setError(null);
    setSwitching(preset);
    try {
      await quickLogin(preset);
    } catch (err: unknown) {
      console.error('Failed to switch user:', err);
      setError(err instanceof Error ? err.message : 'Error al cambiar de usuario');
    } finally {
      setSwitching(null);
    }
  }

  return (
    <Card as="section" className="switcher-panel" aria-label="Usuarios de prueba">
      <div className="switcher-heading">
        <span>Usuarios de prueba</span>
        <span>Acceso rápido</span>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <div className="switcher-grid">
        {PRESET_ITEMS.map(({ key, data, dotVariant }) => (
          <SelectableCard
            key={key}
            isActive={user?.email === data.email}
            isLoading={switching === key}
            disabled={switching !== null}
            onClick={() => handleSwitch(key)}
            title={
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <StatusDot variant={dotVariant} />
                <span>{data.name}</span>
              </span>
            }
            subtitle={data.email}
            description={data.description}
          />
        ))}
      </div>
    </Card>
  );
}
