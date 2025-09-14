// src/components/forms/profile/ProfileForm.tsx
"use client";

import { useState, useMemo } from "react";
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

type FormValues = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  card_number: string;
  profile_picture: File | null;
};

const phoneRegex = /^09\d{9}$/;

const validationSchema = Yup.object({
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
    .matches(phoneRegex, "شماره موبایل نامعتبر است (مثال: 09123456789)"),
  email: Yup.string().email("ایمیل نامعتبر است").nullable().optional(),
  address: Yup.string().max(500, "آدرس نباید بیشتر از 500 کاراکتر باشد").nullable().optional(),
  card_number: Yup.string()
    .matches(/^$|^\d{16}$/, "شماره کارت باید 16 رقم باشد")
    .nullable()
    .optional(),
  profile_picture: Yup.mixed<File>()
    .nullable()
    .test("fileSize", "حجم فایل نباید بیش از 2MB باشد", (file) => !file || file.size <= 2 * 1024 * 1024)
    .test("fileType", "فقط فرمت‌های JPG/PNG مجاز است", (file) => {
      if (!file) return true;
      return ["image/jpeg", "image/png"].includes(file.type);
    }),
});

export default function ProfileForm({ user, onSuccess }: ProfileFormProps) {
  const dispatch = useAppDispatch();
  const { mutate } = useAuth();

  const initialValues: FormValues = useMemo(
    () => ({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      address: user?.address || "",
      card_number: user?.card_number || "",
      profile_picture: null,
    }),
    [user]
  );

  const [serverMsg, setServerMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      setServerMsg(null);

      try {
        const hasFile = !!values.profile_picture;

        // آماده‌سازی payload
        if (hasFile) {
          // وقتی فایل داریم → FormData + method override
          const fd = new FormData();
          fd.append("_method", "PUT");
          fd.append("first_name", values.first_name);
          fd.append("last_name", values.last_name);
          fd.append("phone", values.phone);
          if (values.email) fd.append("email", values.email);
          if (values.address) fd.append("address", values.address);
          if (values.card_number) fd.append("card_number", values.card_number);
          if (values.profile_picture) fd.append("profile_picture", values.profile_picture);

          // استفاده از POST + X-HTTP-Method-Override به سمت PUT برای سازگاری کامل با Laravel
          const res = await apiClient.post("v1/profile", fd, {
            headers: { "X-HTTP-Method-Override": "PUT" },
          });

          if (!res.success) {
            throw new Error(res.message || "خطا در به‌روزرسانی پروفایل");
          }

          // res.data ممکن است کل کاربر یا فقط پروفایل باشد؛ با داده قبلی merge می‌کنیم
          const updated = { ...user, ...(res.data || {}) } as UserType;
          dispatch(updateUser(updated));
        } else {
          // بدون فایل → JSON PUT ساده
          // فیلدهای خالی را نفرستیم
          const payload: Record<string, any> = {};
          (["first_name", "last_name", "phone", "email", "address", "card_number"] as const).forEach((k) => {
            const v = values[k];
            if (v !== null && v !== undefined && v !== "") payload[k] = v;
          });

          const res = await apiClient.put("v1/profile", payload);

          if (!res.success) {
            throw new Error(res.message || "خطا در به‌روزرسانی پروفایل");
          }

          const updated = { ...user, ...(res.data || {}) } as UserType;
          dispatch(updateUser(updated));
        }

        // SWR cache برای /v1/profile هم تازه شود
        await mutate();

        setServerMsg({ type: "success", text: "اطلاعات پروفایل با موفقیت به‌روزرسانی شد." });

        // پس از کمی تأخیر کال‌بک موفقیت
        setTimeout(() => onSuccess(), 1200);
      } catch (e: any) {
        setServerMsg({
          type: "error",
          text: e?.message || "خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید.",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full">
      <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
        {serverMsg && (
          <div
            className={`p-4 rounded-lg border ${
              serverMsg.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            <div className="flex items-center">
              {serverMsg.type === "success" ? (
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {serverMsg.text}
            </div>
          </div>
        )}

        {/* نام و نام خانوادگی */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
              نام *
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                formik.touched.first_name && formik.errors.first_name
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="نام"
            />
            {formik.touched.first_name && formik.errors.first_name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.first_name}</p>
            )}
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
              نام خانوادگی *
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                formik.touched.last_name && formik.errors.last_name
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="نام خانوادگی"
            />
            {formik.touched.last_name && formik.errors.last_name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.last_name}</p>
            )}
          </div>
        </div>

        {/* موبایل */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            شماره موبایل *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            dir="ltr"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              formik.touched.phone && formik.errors.phone
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="09123456789"
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
            id="email"
            name="email"
            type="email"
            dir="ltr"
            value={formik.values.email || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              formik.touched.email && formik.errors.email
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="example@email.com"
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
            rows={3}
            value={formik.values.address || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition resize-none ${
              formik.touched.address && formik.errors.address
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="آدرس کامل"
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
            id="card_number"
            name="card_number"
            type="text"
            maxLength={16}
            dir="ltr"
            value={formik.values.card_number || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              formik.touched.card_number && formik.errors.card_number
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="1234567890123456"
          />
          {formik.touched.card_number && formik.errors.card_number && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.card_number}</p>
          )}
        </div>

        {/* عکس پروفایل (اختیاری) */}
        <div>
          <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700 mb-2">
            عکس پروفایل (اختیاری)
          </label>
          <input
            id="profile_picture"
            name="profile_picture"
            type="file"
            accept="image/png,image/jpeg"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0] || null;
              formik.setFieldValue("profile_picture", file);
            }}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {formik.touched.profile_picture && formik.errors.profile_picture && (
            <p className="text-red-500 text-sm mt-1">{String(formik.errors.profile_picture)}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">حداکثر 2MB — فرمت‌های مجاز: JPG, PNG</p>
        </div>

        {/* دکمه ارسال */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting || !formik.isValid}
            className={`w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ${
              submitting || !formik.isValid ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? (
              <span className="inline-flex items-center">
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white ml-2" />
                در حال ذخیره...
              </span>
            ) : (
              "ذخیره تغییرات"
            )}
          </button>
        </div>

        {/* راهنما */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">راهنما:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• نام، نام خانوادگی و شماره موبایل الزامی هستند.</li>
            <li>• شماره موبایل باید با 09 شروع شود و 11 رقم باشد.</li>
            <li>• شماره کارت (در صورت وارد کردن) باید 16 رقم باشد.</li>
            <li>• برای تغییر عکس پروفایل، فایل JPG/PNG حداکثر 2MB انتخاب کنید.</li>
          </ul>
        </div>
      </form>
    </div>
  );
}
