export interface ContactMessageDto {
  id?: number;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
  isRead?: boolean;
}

export interface PagedContactMessages {
  items: ContactMessageDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
