import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserCircleSolidIcon from '@/components/svg/UserCircleSolidIcon';
import { useSelector, useDispatch } from 'react-redux';
import NextImage from 'next/image';
import LoadingButton from '../ui/LoadingButton.jsx';
import axios from '@/lib/axios.js';
import { useRouter } from "next/navigation";
import { clearUser } from '@/redux/Slice/userSlice';

const Header = () => {

    const navLinks = [
        {
            label: 'Home',
            href: ''
        },
        {
            label: 'Query',
            href: 'query'
        },
        {
            label: 'Nutrition',
            href: 'nutrition'
        },
        {
            label: 'Products',
            href: 'products'
        },
        {
            label: 'Contact',
            href: 'dashboard/#footer'
        }
    ];

    const router = useRouter();
    const dispatch = useDispatch();
    const pathname = usePathname();
    const user = useSelector((state) => state.user.user);

    const handleLogout = async () => {
        try {
            const response = await axios.post('/users/logout');
            if (response.status === 200) {
                dispatch(clearUser()); // Clear user from redux store
                console.log("Logout successful");
                router.push('/login');
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    const AdminPanel = () => {
        if (!user?.isAdmin) {
            return null;
        }

        if (pathname === '/admin') {
            return (
                <>
                    <Link href="/dashboard">
                        <LoadingButton>
                            <span className="text-sm">Dashboard</span>
                        </LoadingButton>
                    </Link>
                    <Link href="/admin/analytics">
                        <LoadingButton>
                            <span className="text-sm">Analytics</span>
                        </LoadingButton>
                    </Link>

                </>
            );
        }

        return (
            <Link href="/admin">
                <LoadingButton>
                    <span className="text-sm">Admin Panel</span>
                </LoadingButton>
            </Link>
        );
    };

    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaeef1] px-10 py-3">
            <div className="flex items-center gap-4 text-[#101518]">
                <div className="size-4">
                    <svg
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                            fill="currentColor"
                        ></path>
                    </svg>
                </div>
                <h2 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em]">
                    FitTrack
                </h2>
            </div>
            <div className="flex flex-1 justify-end items-center gap-8">
                <div className="flex items-center gap-9">
                    {navLinks.map((link, index) => (
                        <Link
                            key={index}
                            className="text-black transition-all duration-300 hover:text-blue-600 
                   hover:-translate-y-0.5 hover:opacity-80 cursor-pointer"
                            href={`/${link.href}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <AdminPanel />
                <LoadingButton onClick={() => handleLogout()} >
                    <span className="text-sm">
                        Logout
                    </span>
                </LoadingButton>
                <div
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#eaeef1]"
                >
                    {user?.avatarUrl ? (
                        <NextImage
                            width={20}
                            height={20}
                            src={user?.avatarUrl}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) :
                        <UserCircleSolidIcon size={24} color="black" />
                    }
                </div>
            </div>
        </header>
    )
}

export default Header