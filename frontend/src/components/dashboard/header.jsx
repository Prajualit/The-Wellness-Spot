import React from 'react'
import Link from 'next/link';
import UserCircleSolidIcon from '@/components/svg/UserCircleSolidIcon';

const Header = (user) => {

    const navLinks = [
        {
            label: 'Overview',
            href: 'overview'
        },
        {
            label: 'Workouts',
            href: 'workouts'
        },
        {
            label: 'Nutrition',
            href: 'nutrition'
        },
        {
            label: 'Community',
            href: 'community'
        }
    ];

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
            <div className="flex flex-1 justify-end gap-8">
                <div className="flex items-center gap-9">
                    {navLinks.map((link, index) => (
                        <Link
                            key={index}
                            className="text-[#101518] text-sm font-medium leading-normal"
                            href={link.href}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#eaeef1] text-[#101518] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                    <div
                        className="text-[#101518]"
                        data-icon="Bell"
                        data-size="20px"
                        data-weight="regular"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20px"
                            height="20px"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                        >
                            <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
                        </svg>
                    </div>
                </button>
                <div
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#eaeef1]"
                >
                    {user?.profilePicture ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                        >
                            <path d="M128,144a48,48,0,1,0-48-48A48,48,0,0,0,128,144Zm0-80a32,32,0,1,1-32,32A32,32,0,0,1,128,64Zm80.8,112H47.2A16.2,16.2,0,0,0,31.2,192v16a16.2,16.2,0,0,0,16.2,16h160a16.2,16.2,0,0,0,16.2-16V192A16.2,16.2,0,0,0,208.8,176ZM224.8,192v16H31.2V192h193.6Z"></path>
                        </svg>
                    ) :

                        <UserCircleSolidIcon size={24} color="black" />
                    }
                </div>
            </div>
        </header>

    )
}

export default Header
