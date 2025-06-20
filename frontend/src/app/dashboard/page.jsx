"use client";
import React, { useEffect } from 'react';
import Dashboard from '../../components/dashboard/dashboard.jsx';
import Footer from '@/components/footer.js';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const Page = () => {
    const user = useSelector((state) => state.user.user);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <div>
            <Dashboard />
            <Footer />
        </div>
    );
}

export default Page;
