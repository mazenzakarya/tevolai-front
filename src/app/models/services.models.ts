export enum WebsiteCMS {
  WordPress = 0,
  Shopify = 1,
  Custom = 2,
  Other = 3
}

export enum WebsiteStatus {
  Planning = 0,
  InProgress = 1,
  Completed = 2,
  OnHold = 3,
  Cancelled = 4
}

export interface ServicesOnDashBoard {
  id?: number;
  serviceName: string;
  description?: string;
  cms: WebsiteCMS;
  status: WebsiteStatus;
  customerId?: number;
  startDate?: Date;
  endDate?: Date;
  price?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ServiesOnDashBoardDto {
  id?: number;
  serviceName: string;
  description?: string;
  cms: WebsiteCMS;
  status: WebsiteStatus;
  customerId?: number;
  startDate?: Date;
  endDate?: Date;
  price?: number;
}

export interface ServicesOnMainDto {
  id?: number;
  title: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  isActive?: boolean;
  order?: number;
}
