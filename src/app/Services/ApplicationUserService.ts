import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments';
import {
  ApplicationUserDto,
  CreateApplicationUserDto,
  ResetPasswordDto,
  UpdateApplicationUserDto,
} from '../models/application-user.models';

@Injectable({
  providedIn: 'root',
})
export class ApplicationUserService {
  constructor(private http: HttpClient) {}

  count(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/ApplicationUser/Count`);
  }

  getAll(): Observable<ApplicationUserDto[]> {
    return this.http.get<ApplicationUserDto[]>(`${environment.apiUrl}/ApplicationUser`);
  }

  getById(id: string): Observable<ApplicationUserDto> {
    return this.http.get<ApplicationUserDto>(`${environment.apiUrl}/ApplicationUser/${id}`);
  }

  create(dto: CreateApplicationUserDto): Observable<ApplicationUserDto> {
    return this.http.post<ApplicationUserDto>(`${environment.apiUrl}/ApplicationUser`, dto);
  }

  update(id: string, dto: UpdateApplicationUserDto): Observable<ApplicationUserDto> {
    return this.http.put<ApplicationUserDto>(`${environment.apiUrl}/ApplicationUser/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/ApplicationUser/${id}`);
  }

  byEmail(email: string): Observable<ApplicationUserDto> {
    const params = new HttpParams().set('email', email);
    return this.http.get<ApplicationUserDto>(`${environment.apiUrl}/ApplicationUser/ByEmail`, { params });
  }

  resetPassword(id: string, dto: ResetPasswordDto): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/ApplicationUser/ResetPassword/${id}`, dto);
  }
}


