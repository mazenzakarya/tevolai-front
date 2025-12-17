import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments';
import { Customer, CustomerDto } from '../models/customer.models';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  addCustomer(customer: CustomerDto): Observable<Customer> {
    return this.http.post<Customer>(`${environment.apiUrl}/Customer/AddCustomer`, customer);
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${environment.apiUrl}/Customer/GetCustomerById/${id}`);
  }

  updateCustomer(customer: CustomerDto): Observable<Customer> {
    return this.http.put<Customer>(`${environment.apiUrl}/Customer/UpdateCustomer`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/Customer/DeleteCustomer/${id}`);
  }

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${environment.apiUrl}/Customer/GetAllCustomers`);
  }

  searchCustomers(query: string): Observable<Customer[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<Customer[]>(`${environment.apiUrl}/Customer/SearchCustomers`, { params });
  }
}
