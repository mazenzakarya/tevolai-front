export interface ExpenseDto {
  id?: number;
  title: string;
  amount: number;
  category?: string;
  date: string;
  notes?: string;
  isDeleted?: boolean;
}

export interface PagedExpenses {
  items: ExpenseDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface TotalExpensesResponse {
  totalAmount: number;
}
