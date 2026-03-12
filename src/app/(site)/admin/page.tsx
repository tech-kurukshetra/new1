'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

export default function AdminRootPage() {
    const router = useRouter();
    const { user, isUserLoading } = useUser();

    useEffect(() => {
        if (!isUserLoading) {
            if (user) {
                router.replace('/admin/dashboard');
            } else {
                router.replace('/admin/auth');
            }
        }
    }, [user, isUserLoading, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
    );
}
