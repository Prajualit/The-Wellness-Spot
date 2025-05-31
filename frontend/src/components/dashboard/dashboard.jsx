import React from "react";
import Header from "@/components/dashboard/header.jsx";
import Table from "@/components/dashboard/table.jsx";
import UserCircleSolidIcon from '@/components/svg/UserCircleSolidIcon';

export default function Dashboard(user) {
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
                      <UserCircleSolidIcon size={98} color="#5c778a" />
                    }
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                      Olivia Bennett
                    </p>
                    <p className="text-[#5c778a] text-base font-normal leading-normal">
                      Age: 30, Height: 5&apos;6&apos;&apos;
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex px-4 py-3 justify-start">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#eaeef1] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Change Profile Photo</span>
              </button>
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
