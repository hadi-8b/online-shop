'use client';

import RequireAuth from '@/components/auth/RequireAuth';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
    return <RequireAuth>{children}</RequireAuth>;
}
