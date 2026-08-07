"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import axios from '@/lib/axios.js';
import { getApiBaseURL } from '@/lib/apiConfig.js';

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
            // If no user in Redux, redirect to login
            if (!user) {
                router.push('/login');
                setIsChecking(false);
                return;
            }

            // User exists in Redux, now test if backend auth is working
            try {
                const response = await fetch(`${getApiBaseURL()}/users/me`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                setIsAuthenticated(true);
            } catch (error) {
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
