import Image from "next/image";
import Link from "next/link";
import pp from "../app/assets/pp.png";
import { useDispatch, useSelector } from "react-redux";
import { setActiveNav } from "@/redux/navbar/navbarSlice.js";

export default function Navbar() {
  const activeNav = useSelector((state) => state.navbar.activeNav);
  const dispatch = useDispatch();

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Products", href: "#products" },
  ];

  return (
    <header className="w-full flex items-center justify-between px-4 sm:px-8 py-4 bg-white shadow-md sticky top-0 z-50">
      <Link
        href="/"
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <DumbbellIcon />
        <span className="font-black text-2xl tracking-tight text-gray-900">
          FitPro Trainer
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-gray-700 font-medium hover:text-gray-600 transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button
          className="px-4 py-2 rounded-lg font-semibold text-gray-600 border border-gray-600 hover:bg-gray-600 hover:text-white transition-colors flex items-center gap-2"
          aria-label="Login"
        >
          <LoginIcon />
          <span>Login</span>
        </button>
        <button
          className="w-10 h-10 rounded-full overflow-hidden border border-gray-600 hover:border-gray-600 transition-colors"
          aria-label="User profile"
        >
          <Image
            src={pp}
            width={40}
            height={40}
            alt="Profile picture"
            className="w-full h-full object-cover"
            priority
          />
        </button>
      </div>
    </header>
  );
}

// Extracted SVG components for better readability
function DumbbellIcon() {
  return (
    <svg
      className="w-6 h-6 text-primary"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 512"
      fill="currentColor"
    >
      <path d="M96 64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32V224v64V448c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V384H64c-17.7 0-32-14.3-32-32V288c-17.7 0-32-14.3-32-32s14.3-32 32-32V160c0-17.7 14.3-32 32-32H96V64zm448 0v64h32c17.7 0 32 14.3 32 32v64c17.7 0 32 14.3 32 32s-14.3 32-32 32v64c0 17.7-14.3 32-32 32H544v64c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32V288 224 64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32zM416 224v64H224V224H416z" />
    </svg>
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
