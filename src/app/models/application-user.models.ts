export interface ApplicationUserDto {
  id?: string;
  userName?: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  roles?: string[];
}

export interface CreateApplicationUserDto {
  email: string;
  userName: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
}

export interface UpdateApplicationUserDto {
  email?: string;
  userName?: string;
  fullName?: string;
  phoneNumber?: string;
}

export interface ResetPasswordDto {
  newPassword: string;
}

export interface AssignRoleDto {
  userId: string;
  roleName: string;
}

export interface CreateRoleDto {
  roleName: string;
}
