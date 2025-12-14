import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments';
import { ServicesOnMainDto } from '../models/services.models';

@Injectable({
  providedIn: 'root',
})
export class ServicesOnMainService {
  constructor(private http: HttpClient) {}

  getAllServices(): Observable<ServicesOnMainDto[]> {
    return this.http.get<ServicesOnMainDto[]>(`${environment.apiUrl}/ServicesOnMain`);
  }

  addService(service: ServicesOnMainDto): Observable<ServicesOnMainDto> {
    return this.http.post<ServicesOnMainDto>(`${environment.apiUrl}/ServicesOnMain`, service);
  }

  updateService(service: ServicesOnMainDto): Observable<ServicesOnMainDto> {
    return this.http.put<ServicesOnMainDto>(`${environment.apiUrl}/ServicesOnMain`, service);
  }

  getServiceById(id: number): Observable<ServicesOnMainDto> {
    return this.http.get<ServicesOnMainDto>(`${environment.apiUrl}/ServicesOnMain/${id}`);
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/ServicesOnMain/${id}`);
  }
}
