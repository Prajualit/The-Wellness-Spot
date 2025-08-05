import React, { useState } from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserCircleSolidIcon from '@/components/svg/UserCircleSolidIcon';
import { useSelector, useDispatch } from 'react-redux';
import NextImage from 'next/image';
import LoadingButton from '../ui/LoadingButton.jsx';
import axios from '@/lib/axios.js';
import { useRouter } from "next/navigation";
import { clearUser } from '@/redux/Slice/userSlice';
import Wellnesslogo2 from '../../app/assets/Wellnesslogo2.png';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';


const Header = () => {
    const [open, setOpen] = useState(false);

    const navLinks = [
        {
            label: 'Home',
            href: ''
        },
        {
            label: 'Query',
            href: 'query',
            showOnlyOnHome: true
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

    const getVisibleNavItems = () => {
        return navLinks.filter((item) => {
            if (item.showOnlyOnHome) {
                return pathname === "/";
            }
            return true;
        });
    };

    const router = useRouter();
    const dispatch = useDispatch();
    const pathname = usePathname();
    const user = useSelector((state) => state.user.user);

    const handleLogout = async () => {
        try {
            const response = await axios.post('/users/logout');
            if (response.status === 200) {
                dispatch(clearUser()); // Clear user from redux store
                router.push('/login');
            }
        } catch (error) {
            // Handle logout error
        }
    }

    const AdminPanel = () => {
        if (!user?.isAdmin) {
            return (
                <LoadingButton onClick={() => handleLogout()} >
                    <span className="text-sm">
                        Logout
                    </span>
                </LoadingButton>
            );
        }

        if (pathname === '/admin') {
            return (
                <div className='flex space-x-4 max-md:flex-col max-md:space-y-4 '>
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
                    <LoadingButton className="md:hidden" onClick={() => handleLogout()} >
                        <span className="text-sm ">
                            Logout
                        </span>
                    </LoadingButton>
                </div>
            );
        }

        return (
            <div className='flex space-x-4 '>
                <Link href="/admin">
                    <LoadingButton>
                        <span className="text-sm">Admin Panel</span>
                    </LoadingButton>
                </Link>
                <LoadingButton onClick={() => handleLogout()} >
                    <span className="text-sm">
                        Logout
                    </span>
                </LoadingButton>
            </div>
        );
    };

    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaeef1] px-10 py-3">
            <div className="flex items-center gap-4 text-[#101518]">
                <Link href="/">
                    <NextImage
                        src={Wellnesslogo2}
                        height={45}
                        alt='Logo'
                        className='cursor-pointer hover:opacity-80 transition-opacity'>
                    </NextImage>
                </Link>

            </div>
            <div className="flex flex-1 justify-end items-center gap-8">
                <div className="hidden lg:flex items-center gap-9">
                    {navLinks.map((link, index) => (
                        <Link
                            key={index}
                            className="text-black transition-all duration-300 hover:text-green-800 
                   hover:-translate-y-0.5 hover:opacity-80 cursor-pointer"
                            href={`/${link.href}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <div className="max-md:hidden">
                    <AdminPanel />
                </div>

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

            {/* Mobile Nav */}
            <div className="lg:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[250px] p-6">
                        <div className="flex flex-col gap-4 mt-8">
                            {getVisibleNavItems().map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="text-base font-medium text-muted-foreground hover:text-primary"
                                    onClick={() => setOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <div className="mt-4 md:hidden"><AdminPanel /></div>    
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}

export default Header