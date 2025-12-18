export interface RegisterDto {
  email: string;
  password: string;
  userName: string;
  fullName?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  id?: string;
  token: string;
  expiresIn?: number;
  userName?: string;
  email: string;
}
