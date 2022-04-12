export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  mobile: string;
  createDateTime: string;
  createDateTimeAsDate: Date;
  email: string;
  isBlock: boolean;
  roles: string[];
}
export interface RolesInUserOperationDto {
  id: string;
  name: string;
}
export interface CreateUserDto {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  mobile: string;
  mobileConfirmed: boolean;
  email: string;
  emailConfirmed: boolean;
  isBlock: boolean;
  roles: string[];
}

export interface UpdateUserDto {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  changeForcePassword: boolean;
  mobile: string;
  mobileConfirmed: boolean;
  email: string;
  emailConfirmed: boolean;
  isBlock: boolean;
  roles: string[];
}
