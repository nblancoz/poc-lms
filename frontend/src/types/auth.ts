export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
  message: string;
  details?: Record<string, string[] | undefined> | Array<{ field: string; message: string }>;
}
