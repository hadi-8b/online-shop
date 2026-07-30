'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

type ProfileUser = {
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  address?: string | null;
};

function isProfileComplete(user: ProfileUser): boolean {
  return Boolean(
    user.first_name?.trim() &&
      user.last_name?.trim() &&
      user.phone?.trim() &&
      user.address?.trim()
  );
}

export function useCheckout() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const goToCheckout = useCallback(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }

    if (!isProfileComplete(user)) {
      router.push('/panel/profile?redirect=/checkout');
      return;
    }

    router.push('/checkout');
  }, [authLoading, isAuthenticated, user, router]);

  return {
    goToCheckout,
    authLoading,
  };
}