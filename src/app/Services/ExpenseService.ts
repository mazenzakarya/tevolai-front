import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments';
import { ExpenseDto, PagedExpenses, TotalExpensesResponse } from '../models/expense.models';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(private http: HttpClient) {}

  addExpense(expense: ExpenseDto): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/Expense`, expense);
  }

  updateExpense(expense: ExpenseDto): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/Expense`, expense);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/Expense/${id}`);
  }

  getAllExpenses(pageNumber: number = 1, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('pageNumper', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(`${environment.apiUrl}/Expense`, { params });
  }

  getExpenseById(id: number): Observable<ExpenseDto> {
    return this.http.get<ExpenseDto>(`${environment.apiUrl}/Expense/${id}`);
  }

  getTotalExpensesAmount(): Observable<TotalExpensesResponse> {
    return this.http.get<TotalExpensesResponse>(`${environment.apiUrl}/Expense/count`);
  }
}
