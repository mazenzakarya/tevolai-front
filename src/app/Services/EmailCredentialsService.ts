import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments';
import { EmailCredential, AddEmailCredentialRequest } from '../models/email-credentials.models';

@Injectable({
  providedIn: 'root',
})
export class EmailCredentialsService {
  constructor(private http: HttpClient) {}

  addCredential(request: AddEmailCredentialRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/EmailCredentials/AddCredential`, request);
  }

  getCredentialById(id: number): Observable<EmailCredential> {
    return this.http.get<EmailCredential>(`${environment.apiUrl}/EmailCredentials/${id}`);
  }

  getCredentialWithPassword(id: number): Observable<EmailCredential> {
    return this.http.get<EmailCredential>(`${environment.apiUrl}/EmailCredentials/${id}/with-password`);
  }

  getAllCredentials(includeDeleted: boolean = false): Observable<EmailCredential[]> {
    const params = new HttpParams().set('includeDeleted', includeDeleted.toString());
    return this.http.get<EmailCredential[]>(`${environment.apiUrl}/EmailCredentials`, { params });
  }

  deleteCredential(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/EmailCredentials/${id}`);
  }

  updateCredential(credential: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/EmailCredentials/UpdateCredential`, credential);
  }
}
