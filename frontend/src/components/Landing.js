import Next from "next";
import Image from "next/image";
import Link from "next/link";
import trainer from "../app/assets/trainer.png";
import homeimage from "../app/assets/homeimage.png";

export default function Landing() {
  return (
    <div>
      <main
        id="home"
        className="relative bg-gradient-to-br from-[#e3fcec] via-white to-[#e8f0fe] flex flex-col lg:flex-row items-center justify-between px-12 py-20 lg:py-32 w-full xl:space-x-20 "
      >
        <div
          className="flex flex-col gap-7 max-sm:gap-0 max-xl:space-y-20 max-xl:items-center max-xl:justify-center max-sm:text-center xl:w-[50%]"
        >
          <h1 className="text-5xl text-start font-extrabold text-gray-900 mb-2 leading-tight font-[Montserrat]">
            Unlock Your Best Self with Personal Fitness Training
          </h1>
          <p className="text-lg text-start text-gray-700 font-medium mb-4">
            Transform your body, boost your energy, and achieve your fitness
            goals with personalized coaching, smart nutrition, and a motivating
            community.
          </p>
          <div className="flex gap-5 mt-2 ">
            <Link href="/booking">
              <button
                id="book-session-btn"
                className="px-7 py-3 text-white rounded-lg cursor-pointer font-bold text-lg shadow-lg bg-green-600 hover:bg-green-700 duration-300 ease-in-out tracking-wide flex items-center gap-2 "
              >
                <svg
                  className="svg-inline--fa fa-calendar-check"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="calendar-check"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 561"
                  width={22}
                  height={22}
                >
                  <path
                    fill="white"
                    d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zM329 305c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-95 95-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L329 305z"
                  />
                </svg>
                Book a Session
              </button>
            </Link>
          </div>
        </div>
        <div
          className="flex-1 flex items-center justify-center"
          id="main-hero-image-block"
        >
          <div className="relative">
            <Image
              className="rounded-2xl max-xl:mt-10 object-cover shadow-xl border-4 border-white"
              src={homeimage}
              height={350}
              alt="athletic fitness trainer male posing gym, motivational, high contrast, professional, editorial, dribbble style"
              priority
            ></Image>
            
          </div>
        </div>
      </main>
    </div>
  );
}
