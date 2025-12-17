export interface IRevenue {
  id?: number;
  paymentDate: Date;
  customerId: number;
  notes?: string;
  amount: number;
  paymentMethod: string;
  serviceId: number;
}

export interface RevenueDto {
  id?: number;
  paymentDate: string;
  customerId: number;
  notes?: string;
  amount: number;
  paymentMethod?: string;
  serviceId: number;
}

export interface TotalRevenuesResponse {
  totalAmount: number;
}
