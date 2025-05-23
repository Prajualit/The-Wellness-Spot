import Next from 'next';
import Image from 'next/image';
import trainer from '../app/assets/trainer.png';

export default function Landing(){
    return(
        <div>
            <main id="main-area" className="relative bg-gradient-to-r from-[#f3f3fa] via-[#e8f0fe] to-[#e3fcec] flex flex-col lg:flex-row items-center justify-between px-12 py-20 lg:py-32 gap-10">
                <div className="flex-1 flex flex-col gap-7 max-w-xl" id="main-hero-block">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-2 leading-tight font-[Montserrat]" >Unlock Your 
                        <span className="text-primary">Best Self</span> with <br></br>
                        <span className="text-primary">Personal Fitness Training</span>
                    </h1>
                    <p className="text-lg text-gray-700 font-medium mb-4">Transform your body, boost your energy, and achieve your fitness goals with personalized coaching, smart nutrition, and a motivating community.</p>
                    <div className="flex gap-5 mt-2">
                        <button id="book-session-btn" className="px-7 py-3 bg-primary text-white rounded-lg font-bold text-lg shadow-lg bg-blue-600 hover:bg-green-600 duration-300 ease-in-out tracking-wide flex items-center gap-2">
                            <i data-fa-i2svg="">
                                <svg className="svg-inline--fa fa-calendar-check" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar-check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                                    <path fill="currentColor" d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zM329 305c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-95 95-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L329 305z"></path>
                                </svg>
                            </i>Book a Session
                        </button>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center min-w-[340px]" id="main-hero-image-block">
                    <div className="relative">
                        <Image className="rounded-2xl w-[350px] h-[420px] object-cover shadow-xl border-4 border-white" src={trainer}  alt="athletic fitness trainer male posing gym, motivational, high contrast, professional, editorial, dribbble style"></Image>
                        <div className="absolute bottom-4 right-4 bg-white/90 px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
                            <i className="text-yellow-400" data-fa-i2svg="">
                                <svg className="svg-inline--fa fa-bolt" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bolt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                                    <path fill="currentColor" d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z"></path>
                                </svg>
                            </i>
                            <span className="text-sm font-semibold text-gray-700">Certified Personal Trainer</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}