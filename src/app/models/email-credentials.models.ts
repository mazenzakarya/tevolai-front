export interface EmailCredential {
  id?: number;
  email: string;
  password: string;
  smtpServer?: string;
  smtpPort?: number;
  isActive?: boolean;
}

export interface AddEmailCredentialRequest {
  email: string;
  password: string;
  smtpServer?: string;
  smtpPort?: number;
}
