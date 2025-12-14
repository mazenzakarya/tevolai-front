export interface ContactMessageDto {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead?: boolean;
  createdAt?: Date;
}

export interface PagedContactMessages {
  items: ContactMessageDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
