import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments';
import { AssignRoleDto, CreateRoleDto } from '../models/application-user.models';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(private http: HttpClient) {}

  createRole(dto: CreateRoleDto): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/Roles/create`, dto);
  }

  assign(dto: AssignRoleDto): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/Roles/assign`, dto);
  }
}


