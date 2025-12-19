import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments';
import { ServicesOnDashBoard, ServiesOnDashBoardDto, WebsiteCMS, WebsiteStatus } from '../models/services.models';

@Injectable({
  providedIn: 'root',
})
export class ServicesOnDashBoardService {
  constructor(private http: HttpClient) {}

  addService(service: ServiesOnDashBoardDto): Observable<ServicesOnDashBoard> {
    return this.http.post<ServicesOnDashBoard>(`${environment.apiUrl}/ServicesOnDashBoard/AddServiceOnDashBoard`, service);
  }

  getAllServices(): Observable<ServicesOnDashBoard[]> {
    return this.http.get<ServicesOnDashBoard[]>(`${environment.apiUrl}/ServicesOnDashBoard/GetAllServicesOnDashBoard`);
  }

  getServiceById(id: string): Observable<ServicesOnDashBoard> {
    return this.http.get<ServicesOnDashBoard>(`${environment.apiUrl}/ServicesOnDashBoard/GetServiceOnDashBoardById/${id}`);
  }

  getServicesByUserId(userId: string): Observable<ServicesOnDashBoard[]> {
    return this.http.get<ServicesOnDashBoard[]>(`${environment.apiUrl}/ServicesOnDashBoard/GetServicesByUserId/${userId}`);
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/ServicesOnDashBoard/DeleteServiceOnDashBoard/${id}`);
  }

  updateService(service: ServiesOnDashBoardDto): Observable<ServicesOnDashBoard> {
    return this.http.put<ServicesOnDashBoard>(`${environment.apiUrl}/ServicesOnDashBoard/UpdateServiceOnDashBoard`, service);
  }

  searchServicesByName(serviceName: string): Observable<ServicesOnDashBoard[]> {
    return this.http.get<ServicesOnDashBoard[]>(`${environment.apiUrl}/ServicesOnDashBoard/SearchServicesByName/${encodeURIComponent(serviceName)}`);
  }

  filterServicesByCMS(cms: WebsiteCMS): Observable<ServicesOnDashBoard[]> {
    return this.http.get<ServicesOnDashBoard[]>(`${environment.apiUrl}/ServicesOnDashBoard/FilterServicesByCMS/${cms}`);
  }

  filterServicesByStatus(status: WebsiteStatus): Observable<ServicesOnDashBoard[]> {
    return this.http.get<ServicesOnDashBoard[]>(`${environment.apiUrl}/ServicesOnDashBoard/FilterServicesByStatus/${status}`);
  }

  sortServicesByCreatedAt(ascending: boolean = true): Observable<ServicesOnDashBoard[]> {
    return this.http.get<ServicesOnDashBoard[]>(`${environment.apiUrl}/ServicesOnDashBoard/SortServicesByCreatedAt/${ascending}`);
  }
}
