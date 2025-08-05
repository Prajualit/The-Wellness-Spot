"use client";
import React from 'react';
import Dashboard from '../../components/dashboard/dashboard.jsx';
import Footer from '@/components/footer.js';
import { useTokenAuth } from '@/hooks/useTokenAuth.js';

const Page = () => {
    const { isAuthenticated, isLoading } = useTokenAuth();

    // Show loading while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-800 mx-auto"></div>
                </div>
            </div>
        );
    }

    // Only render dashboard if authenticated
    if (!isAuthenticated) {
        return null; // This shouldn't happen due to redirects in hook, but safety check
    }

    return (
        <div>
            <Dashboard />
            <Footer />
        </div>
    );
}

export default Page;
