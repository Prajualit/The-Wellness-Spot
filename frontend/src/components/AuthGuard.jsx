"use client";
import React from 'react';
import { useAuthCheck } from '@/hooks/useAuthCheck.js';

const AuthGuard = ({ children, fallback = null, skipApiValidation = true }) => {
    const { isAuthenticated } = useAuthCheck(skipApiValidation);

    if (!isAuthenticated) {
        return fallback;
    }

    return children;
};

export default AuthGuard;
