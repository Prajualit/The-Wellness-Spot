"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import axios from '@/lib/axios.js';

/**
 * Simple authentication hook that checks for user data and validates with backend
 * Since cookies are httpOnly, we can't check them directly
 */
export const useTokenAuth = () => {
    const router = useRouter();
    const user = useSelector((state) => state.user.user);
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            console.log('🔐 useTokenAuth: Starting auth check');
            console.log('- User from Redux:', user ? 'exists' : 'null');
            console.log('- Document cookies:', document.cookie);
            
            // If no user in Redux, redirect to login
            if (!user) {
                console.log('❌ useTokenAuth: No user in Redux, redirecting to login');
                router.push('/login');
                setIsChecking(false);
                return;
            }

            // User exists in Redux, now test if backend auth is working
            try {
                console.log('🔍 useTokenAuth: Testing backend auth with /users/me');
                await axios.get('/users/me'); // Simple authenticated endpoint
                console.log('✅ useTokenAuth: Backend auth successful');
                setIsAuthenticated(true);
            } catch (error) {
                console.error('❌ useTokenAuth: Backend auth failed:', error.response?.status, error.response?.data);
                console.log('- Redirecting to login due to backend auth failure');
                router.push('/login');
            }
            
            setIsChecking(false);
        };

        // Add a small delay to allow for state to settle after login
        setTimeout(checkAuth, 200);
    }, [router, user]);

    return {
        isAuthenticated: isAuthenticated && user,
        isLoading: isChecking,
        user
    };
};
