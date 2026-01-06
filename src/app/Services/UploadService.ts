import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments';

export interface UploadResponse {
  name: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  /**
   * Upload a file to the server
   * @param file File to upload
   * @returns Observable with upload response containing file name and URL
   */
  uploadFile(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadResponse>(this.apiUrl, formData);
  }

  /**
   * Get all uploaded files
   */
  getAllUploads(): Observable<UploadResponse[]> {
    return this.http.get<UploadResponse[]>(this.apiUrl);
  }

  /**
   * Delete an uploaded file
   * @param fileName Name of the file to delete
   */
  deleteUpload(fileName: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${fileName}`);
  }
}
