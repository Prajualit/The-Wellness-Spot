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

            const cookies = document.cookie;
            
            // More robust cookie checking
            const getCookieValue = (name) => {
                const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
                return match ? match[2] : null;
            };
            
            const accessToken = getCookieValue('accessToken');
            const refreshToken = getCookieValue('refreshToken');
            
            // Fallback: check localStorage for debug tokens
            const debugAccessToken = localStorage.getItem('debug_accessToken');
            const debugRefreshToken = localStorage.getItem('debug_refreshToken');
            
            const hasAccess = !!accessToken || !!debugAccessToken;
            const hasRefresh = !!refreshToken || !!debugRefreshToken;
            
            // Add debugging logs for production
            console.log('🍪 AuthGuard Cookie Debug:');
            console.log('- All cookies:', cookies);
            console.log('- Access token value:', accessToken ? 'exists' : 'missing');
            console.log('- Refresh token value:', refreshToken ? 'exists' : 'missing');
            console.log('- Debug access token (localStorage):', debugAccessToken ? 'exists' : 'missing');
            console.log('- Debug refresh token (localStorage):', debugRefreshToken ? 'exists' : 'missing');
            console.log('- Has accessToken:', hasAccess);
            console.log('- Has refreshToken:', hasRefresh);
            console.log('- Window location:', window.location.href);
            console.log('- User agent:', navigator.userAgent);
            console.log('- Is secure context:', window.isSecureContext);
            console.log('- Document domain:', document.domain);
            console.log('- Window location protocol:', window.location.protocol);
            
            setHasTokens(hasAccess && hasRefresh);
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    // Show loading while checking
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-800 mx-auto"></div>
                </div>
            </div>
        );
    }

    // Check if authenticated (has both user data and tokens)
    const isAuthenticated = user && hasTokens;

    console.log('🛡️ AuthGuard Final Check:');
    console.log('- User exists:', !!user);
    console.log('- Has tokens:', hasTokens);
    console.log('- Is authenticated:', isAuthenticated);

    if (!isAuthenticated) {
        console.log('❌ AuthGuard: Not authenticated, returning fallback');
        return fallback;
    }

    console.log('✅ AuthGuard: Authenticated, rendering children');
    return children;
};

export default AuthGuard;
