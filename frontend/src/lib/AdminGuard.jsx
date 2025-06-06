import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function AdminGuard({ children }) {
    const router = useRouter();
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }
        if (!user.isAdmin) {
            router.push("/dashboard");
            return;
        }
    }, [user, router]);

    if (!user || !user.isAdmin) return <div>Loading admin...</div>;

    return <>{children}</>;
}
