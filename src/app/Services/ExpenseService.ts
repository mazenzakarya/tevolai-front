import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments';
import { ExpenseDto } from '../models/expense.models';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(private http: HttpClient) {}

  addExpense(expense: ExpenseDto): Observable<ExpenseDto> {
    return this.http.post<ExpenseDto>(`${environment.apiUrl}/Expense`, expense);
  }

  updateExpense(expense: ExpenseDto): Observable<ExpenseDto> {
    return this.http.put<ExpenseDto>(`${environment.apiUrl}/Expense`, expense);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/Expense/${id}`);
  }

  getAllExpenses(): Observable<ExpenseDto[]> {
    return this.http.get<ExpenseDto[]>(`${environment.apiUrl}/Expense`);
  }

  getExpenseById(id: number): Observable<ExpenseDto> {
    return this.http.get<ExpenseDto>(`${environment.apiUrl}/Expense/${id}`);
  }

  getExpenseCount(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/Expense/count`);
  }
}
