// src/app/panel/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { apiClient } from '@/services/api/client';

const LoadingState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4" />
    <p className="text-lg text-gray-600">در حال بارگذاری اطلاعات کاربر...</p>
    <button
      onClick={onRetry}
      className="mt-4 px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      تلاش مجدد
    </button>
  </div>
);

export default function Panel() {
  // اینجا فقط برای نمایش اطلاعات کاربر از useAuth استفاده می‌کنیم
  const { user, loading, mutate } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiClient.post('logout', {}, true); // POST /api/logout (guard:web)
      await mutate(null, { revalidate: false }); // کش SWR را خالی کن
      router.replace('/auth/login');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  if (loading || !user) {
    // RequireAuth در layout اجازه‌ی ورود مهمان را نمی‌دهد؛
    // این حالت فقط برای revalidation اولیه است.
    return <LoadingState onRetry={() => mutate()} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">پنل کاربری</h1>
            <p className="text-gray-600 mt-2">مدیریت حساب کاربری و اطلاعات شخصی</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => mutate()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
              title="به‌روزرسانی اطلاعات"
            >
              بروزرسانی
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              خروج
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            خوش آمدید {user.first_name || user.phone} 👋
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <div className="font-medium">نام:</div>
              <div>{user.first_name || 'وارد نشده'}</div>
            </div>
            <div>
              <div className="font-medium">نام خانوادگی:</div>
              <div>{user.last_name || 'وارد نشده'}</div>
            </div>
            <div>
              <div className="font-medium">موبایل:</div>
              <div>{user.phone}</div>
            </div>
            <div>
              <div className="font-medium">ایمیل:</div>
              <div>{user.email || 'وارد نشده'}</div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/panel/profile"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              ویرایش پروفایل
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Link
            href="/panel/orders"
            className="bg-white shadow rounded-lg p-6 hover:shadow-md transition flex flex-col items-center"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">سفارش‌های من</h3>
            <p className="text-sm text-gray-500 text-center mt-2">مشاهده و پیگیری سفارش‌ها</p>
          </Link>

          <Link
            href="/panel/favorites"
            className="bg-white shadow rounded-lg p-6 hover:shadow-md transition flex flex-col items-center"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">علاقه‌مندی‌ها</h3>
            <p className="text-sm text-gray-500 text-center mt-2">محصولات مورد علاقه</p>
          </Link>

          <Link
            href="/panel/addresses"
            className="bg-white shadow rounded-lg p-6 hover:shadow-md transition flex flex-col items-center"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">آدرس‌های من</h3>
            <p className="text-sm text-gray-500 text-center mt-2">مدیریت آدرس‌ها</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
