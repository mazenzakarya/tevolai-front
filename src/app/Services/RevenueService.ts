import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments';
import { RevenueDto } from '../models/revenue.models';

@Injectable({
  providedIn: 'root',
})
export class RevenueService {
  constructor(private http: HttpClient) {}

  getTotalRevenues(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/Revenue/TotalRevenues`);
  }

  addRevenue(revenue: RevenueDto): Observable<RevenueDto> {
    return this.http.post<RevenueDto>(`${environment.apiUrl}/Revenue/AddRevenue`, revenue);
  }

  getRevenueById(id: number): Observable<RevenueDto> {
    return this.http.get<RevenueDto>(`${environment.apiUrl}/Revenue/GetRevenueById/${id}`);
  }

  editRevenue(revenue: RevenueDto): Observable<RevenueDto> {
    return this.http.put<RevenueDto>(`${environment.apiUrl}/Revenue/EditRevenue`, revenue);
  }

  deleteRevenue(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/Revenue/DeleteRevenue/${id}`);
  }
}
