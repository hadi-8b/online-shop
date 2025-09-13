// src/contracts/users/index.ts

export interface UserInterface {
  id: number;
  name?: string;
  phone: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserFormValuesInterface {
  phone: string;
  is_admin: boolean;
}

export interface UpdateUserFormValuesInterface {
  phone?: string;
  is_admin?: boolean;
}