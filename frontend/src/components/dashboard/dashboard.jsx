import React, { useRef } from "react";
import Header from "@/components/dashboard/header.jsx";
import Table from "@/components/dashboard/table.jsx";
import UserCircleSolidIcon from '@/components/svg/UserCircleSolidIcon';
import { Button } from "../ui/button";
import NextImage from "next/image";
import { useSelector } from "react-redux";
import UpdateAvatar from "./updateAvatar";

export default function Dashboard() {
  const user = useSelector((state) => state.user.user);

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Header user={user} />
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight min-w-72">
                Health Records
              </p>
            </div>
            <div className="flex p-4 @container">
              <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
                <div className="flex gap-4">
                  <div
                    className="flex items-center justify-center w-32 h-32 rounded-full bg-[#eaeef1]"
                  >
                    {user?.avatarUrl ? (
                      <NextImage
                        width={98}
                        height={98}
                        src={user.avatarUrl}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleSolidIcon size={98} color="#5c778a" />
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                      {user?.name}
                    </p>
                    <p className="text-[#5c778a] text-base font-normal leading-normal">
                      Age: 30, Height: 5&apos;6&apos;&apos;
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex px-4 py-3 justify-start">
              <UpdateAvatar />
            </div>
            <div className="px-4 py-3 @container">
              <div className="flex overflow-hidden rounded-xl border border-[#d4dde2] bg-gray-50">
                <Table className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
