"use client";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const AuthGuard = ({ children, fallback = null }) => {
    const user = useSelector((state) => state.user.user);
    const [hasTokens, setHasTokens] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simple check for tokens in cookies
        const checkAuth = () => {
            if (typeof document === 'undefined') {
                setIsLoading(false);
                return;
            }

            // More robust cookie checking
            const getCookieValue = (name) => {
                const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
                return match ? match[2] : null;
            };
            
            const accessToken = getCookieValue('accessToken');
            const refreshToken = getCookieValue('refreshToken');
            
            setHasTokens(!!accessToken || !!refreshToken);
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    // Show loading while checking
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-green-800 mx-auto"></div>
                </div>
            </div>
        );
    }

    // Check if authenticated (has both user data and tokens)
    const isAuthenticated = user || hasTokens;

    if (!isAuthenticated) {
        return fallback;
    }

    return children;
};

export default AuthGuard;
