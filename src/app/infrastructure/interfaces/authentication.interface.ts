export interface LoginDto {
  userName: string;
  password: string;
}

export interface TokenDto {
  token: string;
  lifeMinutes: number;
  userName: string;
  userRoles: string[];
}
