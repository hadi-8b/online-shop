// src/components/forms/profile/ProfileForm.tsx
"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UserType } from "@/models/user";
import { apiClient } from "@/services/api/client";
import { useAppDispatch } from "@/hooks";
import { updateUser } from "@/store/auth/authSlice";
import useAuth from "@/hooks/useAuth";

interface ProfileFormProps {
  user: UserType;
  onSuccess: () => void;
}

const ProfileForm = ({ user, onSuccess }: ProfileFormProps) => {
  console.log('ProfileForm rendered with user:', user);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // اضافه کردن dispatch و mutate
  const dispatch = useAppDispatch();
  const { mutate } = useAuth();

  const formik = useFormik({
    initialValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      address: user?.address || "",
      card_number: user?.card_number || "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string()
        .min(2, "نام باید حداقل 2 کاراکتر باشد")
        .max(50, "نام نباید بیشتر از 50 کاراکتر باشد")
        .required("نام الزامی است"),
      last_name: Yup.string()
        .min(2, "نام خانوادگی باید حداقل 2 کاراکتر باشد")
        .max(50, "نام خانوادگی نباید بیشتر از 50 کاراکتر باشد")
        .required("نام خانوادگی الزامی است"),
      phone: Yup.string()
        .required("شماره موبایل الزامی است")
        .matches(/^09\d{9}$/, "شماره موبایل نامعتبر است (مثال: 09123456789)"),
      email: Yup.string()
        .email("ایمیل نامعتبر است")
        .nullable(),
      address: Yup.string()
        .max(500, "آدرس نباید بیشتر از 500 کاراکتر باشد")
        .nullable(),
      card_number: Yup.string()
        .matches(/^$|^\d{16}$/, "شماره کارت باید 16 رقم باشد")
        .nullable(),
    }),

    onSubmit: async (values) => {
  setIsSubmitting(true);
  setMessage(null);

  try {
    let payload: any;

    if (values.profile_picture instanceof File) {
      payload = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          payload.append(key, value as any);
        }
      });
    } else {
      payload = values; // JSON
    }

    const response = await apiClient.put("/api/auth/profile", payload, true);

    if (response.success && response.data) {
      setMessage({ type: "success", text: "اطلاعات پروفایل با موفقیت ذخیره شد" });
      await mutate();
      setTimeout(() => onSuccess(), 1500);
    } else {
      setMessage({ type: "error", text: response.message || "خطا در به‌روزرسانی پروفایل" });
    }
  } catch (error: any) {
    setMessage({ type: "error", text: error.message || "خطا در ارتباط با سرور" });
  } finally {
    setIsSubmitting(false);
  }
}

  });

  console.log('Form values:', formik.values);
  console.log('Form errors:', formik.errors);

  return (
    <div className="w-full">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {message && (
          <div className={`p-4 rounded-lg border ${message.type === 'success'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
            }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {message.text}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* نام */}
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
              نام *
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${formik.touched.first_name && formik.errors.first_name
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300'
                }`}
              placeholder="نام خود را وارد کنید"
            />
            {formik.touched.first_name && formik.errors.first_name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.first_name}</p>
            )}
          </div>

          {/* نام خانوادگی */}
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
              نام خانوادگی *
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${formik.touched.last_name && formik.errors.last_name
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300'
                }`}
              placeholder="نام خانوادگی خود را وارد کنید"
            />
            {formik.touched.last_name && formik.errors.last_name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.last_name}</p>
            )}
          </div>
        </div>

        {/* شماره موبایل */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            شماره موبایل *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${formik.touched.phone && formik.errors.phone
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300'
              }`}
            placeholder="09123456789"
            dir="ltr"
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
          )}
        </div>

        {/* ایمیل */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            ایمیل
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${formik.touched.email && formik.errors.email
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300'
              }`}
            placeholder="example@email.com"
            dir="ltr"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        {/* آدرس */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            آدرس
          </label>
          <textarea
            id="address"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${formik.touched.address && formik.errors.address
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300'
              }`}
            placeholder="آدرس کامل خود را وارد کنید"
          />
          {formik.touched.address && formik.errors.address && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.address}</p>
          )}
        </div>

        {/* شماره کارت */}
        <div>
          <label htmlFor="card_number" className="block text-sm font-medium text-gray-700 mb-2">
            شماره کارت
          </label>
          <input
            type="text"
            id="card_number"
            name="card_number"
            value={formik.values.card_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${formik.touched.card_number && formik.errors.card_number
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300'
              }`}
            placeholder="1234567890123456"
            maxLength={16}
            dir="ltr"
          />
          {formik.touched.card_number && formik.errors.card_number && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.card_number}</p>
          )}
        </div>

        {/* دکمه ارسال */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || !formik.isValid}
            className={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${isSubmitting || !formik.isValid
                ? "opacity-50 cursor-not-allowed"
                : ""
              }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white ml-2"></div>
                در حال ذخیره...
              </div>
            ) : (
              'ذخیره تغییرات'
            )}
          </button>
        </div>

        {/* راهنما */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">راهنما:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• فیلدهای نام و نام خانوادگی و شماره موبایل الزامی هستند</li>
            <li>• شماره موبایل باید با 09 شروع شود و 11 رقم باشد</li>
            <li>• شماره کارت باید 16 رقم باشد</li>
            <li>• سایر فیلدها اختیاری هستند</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;