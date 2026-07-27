import { apiClient, ApiResponse } from '@/services/api/client';

import {
  UserInterface,
  CreateUserFormValuesInterface,
  UpdateUserFormValuesInterface,
} from '@/contracts/admin/users';

export const adminUserServices = {
  async getAll(): Promise<ApiResponse<UserInterface[]>> {
    return apiClient.get<UserInterface[]>('/api/v1/admin/users');
  },

  async getById(id: number): Promise<ApiResponse<UserInterface>> {
    return apiClient.get<UserInterface>(
      `/api/v1/admin/users/${id}`
    );
  },

  async create(
    userData: CreateUserFormValuesInterface
  ): Promise<ApiResponse<UserInterface>> {
    return apiClient.post<UserInterface>(
      '/api/v1/admin/users',
      userData
    );
  },

  async update(
    id: number,
    userData: UpdateUserFormValuesInterface
  ): Promise<ApiResponse<UserInterface>> {
    return apiClient.put<UserInterface>(
      `/api/v1/admin/users/${id}`,
      userData
    );
  },

  async delete(
    id: number
  ): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(
      `/api/v1/admin/users/${id}`
    );
  },
};