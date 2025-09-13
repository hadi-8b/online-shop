import { adminUserServices } from '@/services/admin/users';
// import { UserList } from '@/components/modules/admin/users/UserList';
import Link from 'next/link';

export default async function AdminUsersPage() {
    const users = await adminUserServices.getAll();

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">مدیریت کاربران</h1>
                <Link
                    href="/admin/users/create"
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                    افزودن کاربر جدید
                </Link>
            </div>
            {/* <UserList initialUsers={users} /> */}
        </div>
    );
}