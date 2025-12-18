import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments';
import { LoginDto, RegisterDto, AuthResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  register(registerDto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/Auth/register`, registerDto);
  }

  login(loginDto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/Auth/login`, loginDto);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string | any): void {
    let tokenString: string;
    if (typeof token === 'string') {
      tokenString = token;
    } else if (typeof token === 'object' && token) {
      // If token is an object, try to extract the actual token string
      tokenString = token.token || token.access_token || token.jwt || JSON.stringify(token);
    } else {
      return;
    }
    localStorage.setItem(this.tokenKey, tokenString);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];

    const payload = this.decodeJwtPayload(token);
    if (!payload) return [];

    const roleClaim =
      payload['role'] ??
      payload['roles'] ??
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (!roleClaim) return [];
    if (Array.isArray(roleClaim)) return roleClaim.filter((r) => typeof r === 'string');
    if (typeof roleClaim === 'string') return [roleClaim];
    return [];
  }

  hasRole(role: string): boolean {
    const target = (role || '').toLowerCase();
    const roles = this.getRoles();
    return roles.some((r) => (r || '').toLowerCase() === target);
  }

  private decodeJwtPayload(token: string): any | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
      const json = atob(padded);
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
}
