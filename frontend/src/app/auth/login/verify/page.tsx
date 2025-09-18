//src/app/auth/login/verify/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import PhoneVerifyForm from '@/components/forms/auth/phoneVerifyForm';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { selectPhone, updatePhone } from '@/store/auth/authSlice';
import useAuth from '@/hooks/useAuth';

const PhoneVerify = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const phone = useAppSelector(selectPhone);
  const { user, loading } = useAuth();

  const clearPhone = useCallback(() => {
    dispatch(updatePhone(undefined));
  }, [dispatch]);

  useEffect(() => {
    if (!loading && user) {
      // اگر کاربر لاگین شده → مستقیم بفرست به پنل
      router.replace('/panel');
    }
    if (!loading && !user && !phone) {
      // اگر کاربر لاگین نیست و phone هم نداره → برش گردون لاگین
      router.replace('/auth/login');
    }
  }, [user, loading, phone, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>در حال بررسی اطلاعات...</p>
        </div>
      </div>
    );
  }

  if (!phone) return null;

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <PhoneVerifyForm
            phone={phone}
            clearPhone={clearPhone}
            router={router}
          />
        </div>
      </div>
    </div>
  );
};

export default PhoneVerify;