import axios, { type AxiosError } from 'axios';
import { type ApiError } from '../types/auth';

const STORAGE_TOKEN_KEY = 'poc_lms_auth_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save token to localStorage:', error);
  }
}

export function clearStoredToken(): void {
  try {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to clear token from localStorage:', error);
  }
}

export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    let serverMessage = error.response?.data?.message || error.response?.data?.error;
    const details = error.response?.data?.details;

    if (details && typeof details === 'object') {
      if (!Array.isArray(details)) {
        const firstError = Object.values(details).flat().filter(Boolean)[0];
        if (typeof firstError === 'string') {
          serverMessage = firstError;
        }
      } else if (details.length > 0 && details[0]?.message) {
        serverMessage = details[0].message;
      }
    }

    const message = serverMessage || error.message || 'Error en la petición';
    const customError = Object.assign(new Error(message), {
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(customError);
  },
);
