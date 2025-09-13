// src/app/auth/register/page.tsx
'use client';

import RegisterForm from '@/components/forms/auth/registerForm'
import { useRouter } from 'next/navigation';

const Register = () => {
    const router = useRouter();

    return (
        <>
            <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
               
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <RegisterForm router={router} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register
