export interface Customer {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomerDto {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
}
