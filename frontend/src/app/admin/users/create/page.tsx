// src/app/admin/users/create/page.tsx
'use client';

import { adminUserServices } from '@/services/admin/users';
import { CreateUserFormValuesInterface } from '@/contracts/admin/users';

export default function CreateUserPage() {
    const handleSubmit = async (values: CreateUserFormValuesInterface) => {
        await adminUserServices.create(values);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">ایجاد کاربر جدید</h1>
            {/* <UserForm onSubmit={handleSubmit} /> */}
        </div>
    );
}