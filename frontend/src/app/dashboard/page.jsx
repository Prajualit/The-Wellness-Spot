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
        // Simple check: if no user in Redux, redirect to login
        if (!user) {
            // Add a small delay to prevent immediate redirect after login
            const timer = setTimeout(() => {
                if (!user) {
                    router.push('/login');
                }
            }, 1000); // 1 second delay

            return () => clearTimeout(timer);
        }
    }, [user, router]);

    // Show loading while user data is being loaded
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Dashboard />
            <Footer />
        </div>
    );
}

export default Page;
