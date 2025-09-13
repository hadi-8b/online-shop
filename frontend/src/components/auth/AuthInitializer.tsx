// src/components/auth/AuthInitializer.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/hooks";
import { updateUser, updateLoading } from "@/store/auth/authSlice";
import { apiClient } from "@/services/api/client";

const AuthInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      dispatch(updateLoading(true));
      try {
        // این درخواست صرفاً بررسی می‌کند کاربر لاگین هست یا نه
        const response = await apiClient.get("v1/profile");
        if (response.success && response.data) {
          dispatch(updateUser(response.data));
        } else {
          // کاربر لاگین نیست یا کوکی معتبر نیست، اطلاعات کاربر رو null کن
          dispatch(updateUser(null));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        dispatch(updateUser(null));
      } finally {
        dispatch(updateLoading(false));
      }
    };

    initializeAuth();
  }, [dispatch]);

  return null;
};

export default AuthInitializer;
