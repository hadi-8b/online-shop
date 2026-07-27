// src/app/admin/users/[id]/page.tsx

import { notFound } from 'next/navigation';
import { adminUserServices } from '@/services/admin/users';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserPage({ params }: Props) {
  const { id } = await params;

  const response = await adminUserServices.getById(Number(id));

  if (!response.status || !response.data) {
    notFound();
  }

  const user = response.data;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {user.first_name} {user.last_name}
      </h1>

      <div className="space-y-2 rounded border p-4">
        <p>
          <strong>شناسه:</strong> {user.id}
        </p>

        <p>
          <strong>نام:</strong> {user.first_name}
        </p>

        <p>
          <strong>نام خانوادگی:</strong> {user.last_name}
        </p>

        <p>
          <strong>شماره موبایل:</strong> {user.phone}
        </p>

        <p>
          <strong>ایمیل:</strong> {user.email ?? '-'}
        </p>

        <p>
          <strong>آدرس:</strong> {user.address ?? '-'}
        </p>

        <p>
          <strong>ادمین:</strong> {user.is_admin ? 'بله' : 'خیر'}
        </p>
      </div>
    </div>
  );
}