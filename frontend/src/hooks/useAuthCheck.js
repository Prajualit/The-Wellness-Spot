"use client";
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { clearUser } from '@/redux/Slice/userSlice.js';
import axiosInstance from '@/lib/axios.js';

export const useAuthCheck = (skipApiValidation = false, skipAllValidation = false) => {
    const user = useSelector((state) => state.user.user);
    const router = useRouter();
    const dispatch = useDispatch();
    const isValidating = useRef(false);

    // Function to get cookie value by name
    const getCookie = (name) => {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    // Function to check if JWT token is expired
    const isTokenExpired = (token) => {
        if (!token) return true;
        
        const payloadBase64 = token.split(".")[1];
        if (!payloadBase64) return true;
        
        try {
            const payloadJson = atob(payloadBase64);
            const payload = JSON.parse(payloadJson);
            return payload.exp < Date.now() / 1000;
        } catch (err) {
            return true;
        }
    };

    // Function to check if user has valid authentication tokens
    const hasValidTokens = () => {
        const accessToken = getCookie('accessToken');
        const refreshToken = getCookie('refreshToken');
        
        // Check if tokens exist and are not expired
        if (accessToken && !isTokenExpired(accessToken)) {
            return true;
        }
        
        if (refreshToken && !isTokenExpired(refreshToken)) {
            return true;
        }
        
        return false;
    };

    // Function to clear auth cookies
    const clearAuthCookies = () => {
        if (typeof document !== 'undefined') {
            document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; sameSite=Strict';
            document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; sameSite=Strict';
        }
    };

    // Function to handle logout and redirect
    const handleUnauthenticated = async () => {
        if (isValidating.current) return; // Prevent multiple simultaneous calls
        isValidating.current = true;

        try {
            // Only try to call logout if we have tokens
            const refreshToken = getCookie('refreshToken');
            const accessToken = getCookie('accessToken');
            
            if (refreshToken || accessToken) {
                // Try to call logout endpoint, but don't wait too long
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Logout timeout')), 3000)
                );
                
                try {
                    await Promise.race([
                        axiosInstance.post("/users/logout"),
                        timeoutPromise
                    ]);
                } catch (logoutErr) {
                    // Ignore logout errors - we're logging out anyway
                    console.log("Logout API failed or timed out, continuing with client-side logout");
                }
            }
        } catch (error) {
            // Ignore any errors during logout API call
            console.log("Logout process error, continuing with client-side cleanup");
        }

        // Always perform client-side cleanup regardless of API success/failure
        dispatch(clearUser());
        clearAuthCookies();
        router.push('/login');
        
        isValidating.current = false;
    };

    // Function to validate authentication with API
    const validateWithAPI = async () => {
        if (isValidating.current) return false;
        isValidating.current = true;

        try {
            await axiosInstance.get("/users/me");
            isValidating.current = false;
            return true;
        } catch (err) {
            console.error("API validation failed:", err);
            await handleUnauthenticated();
            return false;
        }
    };

    useEffect(() => {
        // Skip all validation if requested
        if (skipAllValidation) {
            return;
        }

        // Skip validation on login page and home page
        if (typeof window !== 'undefined') {
            const pathname = window.location.pathname;
            if (pathname === '/login' || pathname === '/') {
                return;
            }
        }

        // Check if we just logged in (user exists but no previous validation)
        // Wait a bit longer if we just got user data
        const isFirstLoad = user && !isValidating.current;
        const delay = isFirstLoad ? 500 : 100;

        // Add a small delay to prevent immediate validation after login
        const validationTimeout = setTimeout(() => {
            // First check: Cookie and token validation
            if (!hasValidTokens()) {
                handleUnauthenticated();
                return;
            }

            // Second check: Redux store validation
            if (!user) {
                handleUnauthenticated();
                return;
            }

            // Third check: API validation (optional)
            if (!skipApiValidation) {
                validateWithAPI();
            }
        }, delay);

        return () => clearTimeout(validationTimeout);
    }, [user, router, dispatch, skipApiValidation, skipAllValidation]);

    // If we should skip all validation, return early values but after all hooks are called
    if (skipAllValidation) {
        return {
            isAuthenticated: true, // Don't block rendering on public pages
            user,
            handleUnauthenticated: () => {},
            validateWithAPI: () => Promise.resolve(true)
        };
    }

    return {
        isAuthenticated: user && hasValidTokens(),
        user,
        handleUnauthenticated,
        validateWithAPI
    };
};
