// src/contracts/admin/users/index.ts

export interface UserInterface {
    id: number;

    first_name: string | null;
    last_name: string | null;

    phone: string;

    email: string | null;
    address: string | null;

    profile_picture: string | null;

    card_number: string | null;

    is_admin: boolean;

    created_at: string;
    updated_at: string;
}

export interface CreateUserFormValuesInterface {
    first_name?: string;
    last_name?: string;

    phone: string;

    email?: string;
    address?: string;

    card_number?: string;

    password?: string;

    profile_picture?: File;

    is_admin: boolean;
}

export interface UpdateUserFormValuesInterface {
    first_name?: string;
    last_name?: string;

    phone?: string;

    email?: string;
    address?: string;

    card_number?: string;

    password?: string;

    profile_picture?: File;

    is_admin?: boolean;
}