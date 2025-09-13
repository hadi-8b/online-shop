// src/services/admin/users.ts
import { fetcher, sendToApi } from '@/services/api/api';
import { 
    UserInterface, 
    CreateUserFormValuesInterface, 
    UpdateUserFormValuesInterface 
} from '@/contracts/admin/users';

export const adminUserServices = {
    getAll: async (): Promise<UserInterface[]> => {
        const response = await fetcher({ 
            url: 'admin/users'
        });
        const data = await response.json();
        return data;
    },

    getById: async (id: number): Promise<UserInterface> => {
        const response = await fetcher({ 
            url: `admin/users/${id}`
        });
        const data = await response.json();
        return data;
    },

    create: async (userData: CreateUserFormValuesInterface): Promise<UserInterface> => {
        const response = await sendToApi({
            url: 'admin/users',
            options: {
                body: JSON.stringify(userData)
            }
        });
        const data = await response.json();
        return data.user;
    },

    update: async (id: number, userData: UpdateUserFormValuesInterface): Promise<UserInterface> => {
        const response = await sendToApi({
            url: `admin/users/${id}`,
            options: {
                method: 'PUT',
                body: JSON.stringify(userData)
            }
        });
        const data = await response.json();
        return data.user;
    },

    delete: async (id: number): Promise<void> => {
        await fetcher({
            url: `admin/users/${id}`,
            options: {
                method: 'DELETE'
            }
        });
    }
};