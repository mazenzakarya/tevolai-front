import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRevenue } from '../models/irevenue';
import { environment } from '../../environments';

@Injectable({
  providedIn: 'root',
})
export class RevenueService {
  constructor(private http: HttpClient) {
    

  }
  TotalRevenues() : Observable<number> {
      return this.http.get<number>(`${environment.apiUrl}/Revenue/TotalRevenues`);
}

  AddRevenue(revenue: IRevenue): Observable<IRevenue> {
      return this.http.post<IRevenue>(`${environment.apiUrl}/Revenue/AddRevenue`, revenue);
  }
}
