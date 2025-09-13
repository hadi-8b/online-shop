// src/hooks/useAuth.ts
import useSWR from 'swr';
import { apiClient } from '@/services/api/client';
import { UserType } from '@/models/user';

interface UseAuthReturn {
  user: UserType | null;
  loading: boolean;
  error: any;
  mutate: () => Promise<any>;
  isAuthenticated: boolean;
}

const useAuth = (): UseAuthReturn => {
  const {
    data: user,
    error,
    mutate,
    isLoading,
  } = useSWR(
    // همیشه تلاش کن پروفایل رو بگیری؛ اگر 401 شد یعنی لاگین نیست
    'user_profile',
    async () => {
      const response = await apiClient.get<UserType>('v1/profile', true);
      if (response.success && response.data) {
        return response.data;
      }
      // اگر 401 یا هر خطای دیگری بود، کاربر لاگین نیست
      return null;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      dedupingInterval: 30_000,
      errorRetryCount: 0,
    }
  );

  return {
    user: user ?? null,
    loading: isLoading,
    error,
    mutate,
    isAuthenticated: !!user,
  };
};

export default useAuth;
