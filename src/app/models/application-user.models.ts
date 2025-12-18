export interface ApplicationUserDto {
  id?: string;
  userName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  roles?: string[];
}

export interface CreateApplicationUserDto {
  email: string;
  userName: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface UpdateApplicationUserDto {
  email?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
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


