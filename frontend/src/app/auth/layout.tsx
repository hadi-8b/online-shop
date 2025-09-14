'use client';

import { ReactNode } from "react";

export default function GuestLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">{children}</div>
    </div>
  );
}
