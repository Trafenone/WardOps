export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  position: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  position: string;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}
