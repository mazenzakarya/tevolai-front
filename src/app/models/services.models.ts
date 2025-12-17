export enum WebsiteCMS {
  WordPress = 0,
  DotNet = 1,
  Joomla = 2,
  Drupal = 3,
  Custom = 4
}

export enum WebsiteStatus {
  Active = 0,
  Suspended = 1,
  InProgress = 2
}

export interface ServicesOnDashBoard {
  id?: number;
  customerId: number;
  serviceName: string;
  domain: string;
  userName: string;
  cms: WebsiteCMS;
  hostingServer?: string;
  status: WebsiteStatus;
  notes?: string;
  createdAt?: string;
  isDeleted?: boolean;
}

export interface ServiesOnDashBoardDto {
  id?: number;
  customerId: number;
  serviceName: string;
  domain: string;
  userName: string;
  cms: WebsiteCMS;
  hostingServer?: string;
  status: WebsiteStatus;
  notes?: string;
  createdAt?: string;
  isDeleted?: boolean;
}

export enum Language {
  English = 0,
  Arabic = 1
}

export interface ServicesOnMainDto {
  id?: number;
  title: string;
  description: string;
  price?: number;
  imageUrl?: string;
  category?: string;
  isActive?: boolean;
  language?: Language;
  createdAt?: string;
  isDeleted?: boolean;
}
