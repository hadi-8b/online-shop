// src/services/api/auth.ts
import { apiClient } from "@/services/api/client";

class AuthService {
  /**
   * مرحله اول: درخواست لاگین با شماره موبایل
   * (کد تأیید برای کاربر ارسال میشه)
   */
  async login(phone: string) {
    // حتما قبلش csrf-cookie گرفته بشه
    await apiClient.get("/sanctum/csrf-cookie");
    return apiClient.post("auth/login", { phone });
  }

  /**
   * مرحله دوم: تأیید کد ارسال شده
   * (اینجا کاربر لاگین میشه و سشن ساخته میشه)
   */
  async verify(phone: string, code: string) {
    await apiClient.get("/sanctum/csrf-cookie");
    return apiClient.post("auth/verify", { phone, code });
  }

  /**
   * گرفتن پروفایل کاربر لاگین‌شده
   * (این یکی requireAuth=true تا کوکی HttpOnly ارسال بشه)
   */
  async profile() {
    return apiClient.get("v1/profile", true);
  }

  /**
   * خروج از حساب
   */
  async logout() {
    return apiClient.post("logout", {}, true);
  }
}

export const authService = new AuthService();
