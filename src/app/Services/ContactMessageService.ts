import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments';
import { ContactMessageDto, PagedContactMessages } from '../models/contact-message.models';

@Injectable({
  providedIn: 'root',
})
export class ContactMessageService {
  constructor(private http: HttpClient) {}

  addContactMessage(message: ContactMessageDto): Observable<ContactMessageDto> {
    return this.http.post<ContactMessageDto>(`${environment.apiUrl}/ContactMessage/AddContactMessage`, message);
  }

  getPagedContactMessages(page: number = 1, pageSize: number = 10): Observable<PagedContactMessages> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedContactMessages>(`${environment.apiUrl}/ContactMessage/GetPagedContactMessages`, { params });
  }

  getContactMessageById(id: number): Observable<ContactMessageDto> {
    return this.http.get<ContactMessageDto>(`${environment.apiUrl}/ContactMessage/GetContactMessageById/${id}`);
  }

  deleteContactMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/ContactMessage/DeleteContactMessage/${id}`);
  }

  markAsRead(id: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/ContactMessage/MarkAsRead/${id}`, {});
  }

  getContactMessagesByReadStatus(isRead: boolean): Observable<ContactMessageDto[]> {
    const params = new HttpParams().set('isRead', isRead.toString());
    return this.http.get<ContactMessageDto[]>(`${environment.apiUrl}/ContactMessage/GetContactMessagesByReadStatus`, { params });
  }
}
