export interface RegisterDto {
  email: string;
  password: string;
  userName: string;
  fullName?: string;
  phoneNumber?: string;
}

export interface LoginDto {
  Email: string;
  Password: string;
}

export interface AuthResponse {
  id?: string;
  token: string;
  expiresIn?: number;
  userName?: string;
  email: string;
}
