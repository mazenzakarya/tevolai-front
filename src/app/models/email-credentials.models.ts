export interface EmailCredential {
  id?: number;
  customerId?: number;
  emailAddress: string;
  password?: string;
  decryptedPassword?: string;
  userName?: string;
  hostingPlatform?: string;
  notes?: string;
  createdAt?: string;
  lastUsedAt?: string;
  auditLog?: string;
}

export interface AddEmailCredentialRequest {
  customerId?: number;
  emailAddress: string;
  password: string;
  userName?: string;
  hostingPlatform?: string;
  notes?: string;
}
