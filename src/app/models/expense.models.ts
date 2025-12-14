export interface ExpenseDto {
  id?: number;
  amount: number;
  description: string;
  category?: string;
  expenseDate: Date;
  notes?: string;
}
