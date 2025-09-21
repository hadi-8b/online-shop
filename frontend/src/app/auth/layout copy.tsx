// src/app/auth/layout.tsx
'use client';

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";

interface Props {
    children: ReactNode;
}

const GuestLayout = ({ children }: Props) => {
    const router = useRouter();
    const { user, error, loading } = useAuth();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (user && !isRedirecting) {
            console.log("User authenticated, redirecting to panel");
            setIsRedirecting(true);
            router.push('/panel');
        }
    }, [user, router, isRedirecting]);

    // نمایش loading هنگام بارگذاری یا هدایت
    if (loading || isRedirecting) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">
                        {isRedirecting ? 'در حال هدایت به پنل کاربری...' : 'در حال بررسی احراز هویت...'}
                    </p>
                </div>
            </div>
        );
    }

    // اگر کاربر وارد شده، چیزی نمایش ندهیم (در حال هدایت)
    if (user) {
        return null;
    }

    // نمایش محتوای مهمان
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full">
                {children}
            </div>
        </div>
    );
};

export default GuestLayout;