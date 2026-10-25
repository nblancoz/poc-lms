import { createContext } from 'react';
import { type User } from '../types/auth';
import { type PresetUserType } from './presets';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  quickLogin: (preset: PresetUserType) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
