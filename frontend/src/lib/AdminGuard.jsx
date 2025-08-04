"use client";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }) {
    const router = useRouter();
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        // First check: if no user, redirect to login (same as dashboard protection)
        if (!user) {
            const timer = setTimeout(() => {
                if (!user) {
                    router.push('/login');
                }
            }, 1000); // 1 second delay like dashboard

            return () => clearTimeout(timer);
        }

        // Second check: if user exists but is not admin, redirect to dashboard
        if (user && !user.isAdmin) {
            router.push("/dashboard");
        }
    }, [user, router]);

    // Show loading while user data is being loaded or checking admin status
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-800 mx-auto"></div>
                </div>
            </div>
        );
    }

    // If user exists but is not admin, show loading while redirecting
    if (!user.isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-800 mx-auto"></div>
                </div>
            </div>
        );
    }

    // User is authenticated and is admin, show admin content
    return <>{children}</>;
}
