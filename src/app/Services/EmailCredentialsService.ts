import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments';
import { EmailCredential, AddEmailCredentialRequest } from '../models/email-credentials.models';

@Injectable({
  providedIn: 'root',
})
export class EmailCredentialsService {
  constructor(private http: HttpClient) {}

  addCredential(request: AddEmailCredentialRequest): Observable<EmailCredential> {
    return this.http.post<EmailCredential>(`${environment.apiUrl}/EmailCredentials/AddCredentialAsync`, request);
  }

  getCredentialById(id: number): Observable<EmailCredential> {
    return this.http.get<EmailCredential>(`${environment.apiUrl}/EmailCredentials/${id}`);
  }

  deleteCredential(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/EmailCredentials/${id}`);
  }

  updateCredential(id: number, request: AddEmailCredentialRequest): Observable<EmailCredential> {
    return this.http.put<EmailCredential>(`${environment.apiUrl}/EmailCredentials/UpdateCredentialAsync`, { id, ...request });
  }
}
