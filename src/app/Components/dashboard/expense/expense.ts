import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../../../Services/ExpenseService';
import { ExpenseDto } from '../../../models/expense.models';

@Component({
  selector: 'app-expense',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense.html',
  styleUrl: './expense.css',
})
export class Expense implements OnInit {
  expenses = signal<ExpenseDto[]>([]);
  allExpenses = signal<ExpenseDto[]>([]); // Store all expenses for client-side pagination
  isLoading = signal(true);
  showForm = signal(false);
  editingExpense = signal<ExpenseDto | null>(null);
  expenseForm: FormGroup;
  totalExpenses = signal<number>(0);
  currentPage = signal(1);
  pageSize = signal(10); // Default to 10 items per page
  totalPages = signal(0);

  constructor(private expenseService: ExpenseService, private fb: FormBuilder) {
    this.expenseForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(0.01)]],
      title: ['', [Validators.required]],
      category: [''],
      date: [new Date().toISOString().split('T')[0], [Validators.required]],
      notes: [''],
    });
  }

  ngOnInit() {
    this.loadExpenses();
  }

  loadExpenses() {
    // If we already have all expenses loaded, just update pagination
    if (this.allExpenses().length > 0) {
      this.updatePagination();
      return;
    }

    this.isLoading.set(true);
    // Load all expenses by requesting a large page size
    this.expenseService.getAllExpenses(1, 1000).subscribe({
      next: (data) => {
        // Handle different possible response structures
        let allItems: ExpenseDto[] = [];
        if (data?.items && Array.isArray(data.items)) {
          allItems = data.items;
        } else if (Array.isArray(data)) {
          allItems = data;
        } else if (data?.data && Array.isArray(data.data)) {
          allItems = data.data;
        }

        this.allExpenses.set(allItems);
        this.totalExpenses.set(allItems.reduce((sum, exp) => sum + (exp.amount || 0), 0));
        this.updatePagination();
        this.isLoading.set(false);
      },
      error: (error) => {
        this.allExpenses.set([]);
        this.expenses.set([]);
        this.totalExpenses.set(0);
        this.totalPages.set(0);
        this.isLoading.set(false);
      },
    });
  }

  updatePagination() {
    const allItems = this.allExpenses();
    const pageSize = this.pageSize();
    const currentPage = this.currentPage();

    // Calculate total pages
    const totalPages = Math.ceil(allItems.length / pageSize);
    this.totalPages.set(totalPages);

    // Get items for current page
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageItems = allItems.slice(startIndex, endIndex);

    this.expenses.set(pageItems);
  }

  openAddForm() {
    this.editingExpense.set(null);
    this.expenseForm.reset({
      date: new Date().toISOString().split('T')[0],
      amount: 0,
    });
    this.showForm.set(true);
  }

  openEditForm(expense: ExpenseDto) {
    this.editingExpense.set(expense);
    this.expenseForm.patchValue({
      ...expense,
      date: expense.date ? expense.date.split('T')[0] : new Date().toISOString().split('T')[0],
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
        date: new Date(this.expenseForm.value.date).toISOString(),
      };
      if (this.editingExpense()) {
        expenseData.id = this.editingExpense()!.id;
        this.expenseService.updateExpense(expenseData).subscribe({
          next: () => {
            this.allExpenses.set([]); // Clear cache to force reload
            this.loadExpenses();
            this.closeForm();
          },
        });
      } else {
        this.expenseService.addExpense(expenseData).subscribe({
          next: () => {
            this.allExpenses.set([]); // Clear cache to force reload
            this.loadExpenses();
            this.closeForm();
          },
        });
      }
    }
  }

  deleteExpense(id: number) {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe({
        next: () => {
          this.allExpenses.set([]); // Clear cache to force reload
          this.loadExpenses();
        },
      });
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.updatePagination();
    }
  }

  changePageSize(newSize: string) {
    const newSizeNum = +newSize;
    this.pageSize.set(newSizeNum);
    this.currentPage.set(1); // Reset to first page when changing page size
    this.updatePagination();
  }

  getVisiblePages(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const maxVisible = 7; // Maximum number of page buttons to show

    if (total <= maxVisible) {
      // Show all pages if total is small
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Calculate range around current page
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
}
