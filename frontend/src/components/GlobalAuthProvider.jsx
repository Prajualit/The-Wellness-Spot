"use client";
import { useAuthCheck } from "@/hooks/useAuthCheck.js";
import { usePathname } from "next/navigation";

const GlobalAuthProvider = ({ children }) => {
    const pathname = usePathname();
    
    // Skip authentication entirely on public pages
    const publicPages = ['/login', '/'];
    const isPublicPage = publicPages.includes(pathname);
    
    // Always call the hook, but pass parameters to control behavior
    const { isAuthenticated } = useAuthCheck(
        true, // skipApiValidation - let individual pages handle API validation
        isPublicPage // skipAllValidation - completely skip on public pages
    );

    return children;
};

export default GlobalAuthProvider;
