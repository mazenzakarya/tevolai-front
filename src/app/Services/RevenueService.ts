import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments';
import { RevenueDto, TotalRevenuesResponse } from '../models/revenue.models';

@Injectable({
  providedIn: 'root',
})
export class RevenueService {
  constructor(private http: HttpClient) {}

  getTotalRevenuesAmount(): Observable<TotalRevenuesResponse> {
    return this.http.get<TotalRevenuesResponse>(`${environment.apiUrl}/Revenue/TotalRevenues`);
  }

  addRevenue(revenue: RevenueDto): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/Revenue/AddRevenue`, revenue);
  }

  getRevenueById(id: number): Observable<RevenueDto> {
    return this.http.get<RevenueDto>(`${environment.apiUrl}/Revenue/GetRevenueById/${id}`);
  }

  editRevenue(revenue: RevenueDto): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/Revenue/EditRevenue`, revenue);
  }

  deleteRevenue(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/Revenue/DeleteRevenue/${id}`);
  }
}
