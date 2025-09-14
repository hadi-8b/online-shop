// src/app/panel/profile/page.tsx
'use client';

import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { UserType } from '@/models/user';
import ProfileForm from '@/components/forms/profile/ProfileForm';

const LoadingState = () => (
  <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4" />
    <p className="text-lg text-gray-600">در حال بارگذاری اطلاعات کاربر...</p>
  </div>
);

export default function ProfilePage() {
  // RequireAuth داخل layout تضمین کرده کاربر لاگین است.
  // اینجا فقط برای نمایش و تازه‌سازی از useAuth استفاده می‌کنیم.
  const { user, loading, mutate } = useAuth();

  if (loading || !user) return <LoadingState />;

  const userData = user as UserType;

  const handleProfileUpdate = async () => {
    // بعد از آپدیت، پروفایل را تازه‌سازی کن تا UI بروز شود
    await mutate();
    // اگر دوست داری به پنل برگردی:
    // router.replace('/panel');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ویرایش پروفایل</h1>
            <p className="text-gray-600">ویرایش و به‌روزرسانی اطلاعات شخصی</p>
          </div>
          <Link
            href="/panel"
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            بازگشت به پنل
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">اطلاعات شخصی</h2>
            <p className="text-gray-600 text-sm">اطلاعات زیر را با دقت تکمیل کنید</p>
          </div>
          <ProfileForm user={userData} onSuccess={handleProfileUpdate} />
        </div>

        {/* Current info */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">اطلاعات فعلی</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">اطلاعات شخصی</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">نام:</span> {userData.first_name || 'وارد نشده'}</p>
                <p><span className="text-gray-500">نام خانوادگی:</span> {userData.last_name || 'وارد نشده'}</p>
                <p><span className="text-gray-500">شناسه:</span> {userData.id}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">اطلاعات تماس</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">موبایل:</span> {userData.phone}</p>
                <p><span className="text-gray-500">ایمیل:</span> {userData.email || 'وارد نشده'}</p>
                <p><span className="text-gray-500">آدرس:</span> {userData.address || 'وارد نشده'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
