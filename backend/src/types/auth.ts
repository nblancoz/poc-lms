export interface JwtUserPayload {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: JwtUserPayload;
}
