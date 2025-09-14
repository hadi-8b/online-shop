'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import PhoneVerifyForm from '@/components/forms/auth/phoneVerifyForm';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { selectPhone, updatePhone } from '@/store/auth/authSlice';

export default function PhoneVerify() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const phone = useAppSelector(selectPhone);

  const clearPhone = useCallback(() => {
    dispatch(updatePhone(undefined));
  }, [dispatch]);

  useEffect(() => {
    if (!phone) {
      router.replace('/auth/login');
    }
  }, [phone, router]);

  if (!phone) return null;

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <PhoneVerifyForm phone={phone} clearPhone={clearPhone} router={router} />
        </div>
      </div>
    </div>
  );
}
