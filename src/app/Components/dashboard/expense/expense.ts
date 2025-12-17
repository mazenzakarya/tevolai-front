import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../../../Services/ExpenseService';
import { ExpenseDto } from '../../../models/expense.models';

@Component({
  selector: 'app-expense',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense.html',
  styleUrl: './expense.css'
})
export class Expense implements OnInit {
  expenses = signal<ExpenseDto[]>([]);
  isLoading = signal(true);
  showForm = signal(false);
  editingExpense = signal<ExpenseDto | null>(null);
  expenseForm: FormGroup;
  totalExpenses = signal<number>(0);
  currentPage = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);

  constructor(
    private expenseService: ExpenseService,
    private fb: FormBuilder
  ) {
    this.expenseForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(0.01)]],
      title: ['', [Validators.required]],
      category: [''],
      date: [new Date().toISOString().split('T')[0], [Validators.required]],
      notes: ['']
    });
  }

  ngOnInit() {
    this.loadExpenses();
  }

  loadExpenses() {
    this.isLoading.set(true);
    this.expenseService.getAllExpenses(this.currentPage(), this.pageSize()).subscribe({
      next: (data) => {
        const items = data?.items || [];
        this.expenses.set(items);
        this.totalPages.set(data?.totalPages || 0);
        this.totalExpenses.set(items.reduce((sum, exp) => sum + (exp.amount || 0), 0));
        this.isLoading.set(false);
      },
      error: () => {
        this.expenses.set([]);
        this.totalExpenses.set(0);
        this.isLoading.set(false);
      }
    });
  }

  openAddForm() {
    this.editingExpense.set(null);
    this.expenseForm.reset({
      date: new Date().toISOString().split('T')[0],
      amount: 0
    });
    this.showForm.set(true);
  }

  openEditForm(expense: ExpenseDto) {
    this.editingExpense.set(expense);
    this.expenseForm.patchValue({
      ...expense,
      date: expense.date ? expense.date.split('T')[0] : new Date().toISOString().split('T')[0]
    });
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingExpense.set(null);
    this.expenseForm.reset();
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const expenseData: ExpenseDto = {
        ...this.expenseForm.value,
        date: new Date(this.expenseForm.value.date).toISOString()
      };
      if (this.editingExpense()) {
        expenseData.id = this.editingExpense()!.id;
        this.expenseService.updateExpense(expenseData).subscribe({
          next: () => {
            this.loadExpenses();
            this.closeForm();
          }
        });
      } else {
        this.expenseService.addExpense(expenseData).subscribe({
          next: () => {
            this.loadExpenses();
            this.closeForm();
          }
        });
      }
    }
  }

  deleteExpense(id: number) {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe({
        next: () => this.loadExpenses()
      });
    }
  }
}