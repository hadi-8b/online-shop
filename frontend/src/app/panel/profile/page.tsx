// src/app/panel/profile/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { UserType } from "@/models/user";
import ProfileForm from "@/components/forms/profile/ProfileForm";

// UI states
const LoadingState = () => (
  <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
    <p className="text-lg text-gray-600">در حال بارگذاری اطلاعات کاربر...</p>
  </div>
);

const UnauthenticatedState = ({ onLogin }: { onLogin: () => void }) => (
  <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
    <div className="text-gray-400 mb-4">
      <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
    <p className="text-lg mb-6 text-gray-600 text-center">
      برای دسترسی به پروفایل، لطفا وارد حساب خود شوید
    </p>
    <button
      onClick={onLogin}
      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
    >
      ورود به حساب کاربری
    </button>
  </div>
);

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth(); // فقط از سشن استفاده می‌کنیم

  // اگر لاگین نیست، بعد از اتمام لودینگ به صفحه ورود هدایت کن
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  const handleProfileUpdate = async () => {
    // اینجا اگر لازم داری بعد از آپدیت جایی بری:
    setTimeout(() => router.push("/panel"), 2000);
  };

  const handleLogin = () => router.push("/auth/login");
  const handleBackToPanel = () => router.push("/panel");

  if (loading) return <LoadingState />;

  if (!user) return <UnauthenticatedState onLogin={handleLogin} />;

  const userData = user as UserType;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ویرایش پروفایل</h1>
          <p className="text-gray-600">ویرایش و به‌روزرسانی اطلاعات شخصی</p>
        </div>

        {/* Form */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">اطلاعات شخصی</h2>
            <p className="text-gray-600 text-sm">اطلاعات زیر را با دقت تکمیل کنید</p>
          </div>

          <ProfileForm user={userData} onSuccess={handleProfileUpdate} />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={handleBackToPanel}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            بازگشت به پنل کاربری
          </button>
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