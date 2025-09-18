//src/app/auth/login/page.tsx
"use client";

import { useAppDispatch } from "@/hooks";
import { updatePhone } from "@/store/auth/authSlice";
import LoginForm from "@/components/forms/auth/loginForm";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const setPhone = (phone: string) => {
    console.log("Setting phone:", phone);
    dispatch(updatePhone(phone));
  };

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          ورود به حساب کاربری
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm 
            setPhone={setPhone}
            router={router} 
          />
          
          {/* بخش ثبت‌نام */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  حساب کاربری ندارید؟
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link 
                href="/auth/register" 
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                ثبت‌ نام
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;