import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { apiClient, clearStoredToken, getStoredToken, setStoredToken } from '../api/client';
import { type AuthResponse, type User } from '../types/auth';
import { AuthContext } from './auth-context';
import { PRESET_USERS, type PresetUserType } from './presets';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      const stored = getStoredToken();
      if (!stored) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await apiClient.get<{ user: User }>('/api/auth/me');
        setUser(data.user);
        setToken(stored);
      } catch (error) {
        console.warn('Session expired or invalid, clearing token:', error);
        clearStoredToken();
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }

    void loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await apiClient.post<AuthResponse>('/api/auth/login', {
      email,
      password,
    });

    setStoredToken(data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { data } = await apiClient.post<AuthResponse>('/api/auth/register', {
      name,
      email,
      password,
    });

    setStoredToken(data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const quickLogin = useCallback(
    async (preset: PresetUserType) => {
      const credentials = PRESET_USERS[preset];
      await login(credentials.email, credentials.password);
    },
    [login],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        quickLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
