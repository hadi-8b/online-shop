// src/app/admin/users/[id]/edit/page.tsx
import { adminUserServices } from '@/services/admin/users';
import { notFound } from 'next/navigation';
import { UpdateUserFormValuesInterface } from '@/contracts/admin/users';

interface Props {
    params: {
        id: string;
    };
}

export default async function EditUserPage({ params }: Props) {
    const user = await adminUserServices.getById(parseInt(params.id));

    if (!user) {
        notFound();
    }

    const handleSubmit = async (values: UpdateUserFormValuesInterface) => {
        await adminUserServices.update(user.id, values);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">ویرایش کاربر</h1>
            {/* <UserForm 
                initialValues={user} 
                onSubmit={handleSubmit}
            /> */}
        </div>
    );
}