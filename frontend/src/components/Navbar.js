"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { useSelector } from "react-redux";
import LoadingButton from "@/components/ui/LoadingButton.jsx";
import axios from "@/lib/axios.js";
import { useRouter, usePathname } from "next/navigation";
import NextImage from "next/image";
import { clearUser } from "@/redux/Slice/userSlice";
import { useDispatch } from "react-redux";
import Wellnesslogo2 from "../app/assets/Wellnesslogo2.png";
import Image from "next/image";
import UserCircleSolidIcon from "@/components/svg/UserCircleSolidIcon.jsx";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Nutrition", href: "/nutrition" },
  { label: "Query", href: "/query", showOnlyOnHome: true },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "#footer" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await axios.post("/users/logout");
      if (response.status === 200) {
        dispatch(clearUser());
        console.log("Logout successful");
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Filter nav items based on current path
  const getVisibleNavItems = () => {
    return navItems.filter((item) => {
      if (item.showOnlyOnHome) {
        return pathname === "/";
      }
      return true;
    });
  };

  const AuthButton = user ? (
    <div className="flex items-center space-x-4">
      <LoadingButton onClick={handleLogout}>
        <span className="text-sm">Logout</span>
      </LoadingButton>
      <Link href="/dashboard">
        <LoadingButton>
          <span className="text-sm">Dashboard</span>
        </LoadingButton>
      </Link>
      <div className="flex items-center space-x-2 max-sm:hidden ">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#eaeef1] overflow-hidden">
          {user?.avatarUrl ? (
            <NextImage
              src={user?.avatarUrl}
              width={40}
              height={40}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
              <UserCircleSolidIcon size={24} color="gray" />
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <Button variant="outline" className="cursor-pointer">
      <Link href="/login" className="flex items-center gap-2">
        <LoginIcon />
        Login
      </Link>
    </Button>
  );

  return (
    <header className="w-full flex items-center justify-between px-4 sm:px-8 py-4 bg-white shadow-md fixed top-0 z-50">
      <Link
        href="/"
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <Image src={Wellnesslogo2} height={45} alt="Logo"></Image>
      </Link>

      <div className="flex items-center sm:w-full justify-end space-x-5">
        <nav className="hidden lg:flex gap-6">
          {getVisibleNavItems().map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-black transition-all duration-300 hover:text-green-600
                   hover:-translate-y-0.5 hover:opacity-80 cursor-pointer"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="max-sm:hidden">{AuthButton}</div>
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
              <div className="mt-4 sm:hidden">{AuthButton}</div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function LoginIcon() {
  return (
    <svg
      className="w-5 h-5"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
    >
      <path d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
    </svg>
  );
}
