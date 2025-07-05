
import { FaLeaf, FaRunning, FaUserAlt, FaMoneyBillWave, FaCalendarAlt, FaPrescriptionBottle, FaTablets, FaCalculator } from 'react-icons/fa';

import Navbar from '../Navbar';
import Footer from '../footer';
import Image from 'next/image';
import ServicesPage from './services';
import Link from 'next/link';
import banner from '../../app/assets/banner.jpg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


export default function ProductsPage() {
  // Video URLs for video carousel with orientation info
  const heroVideos = [
    { src: '/videos/slider2.mp4', orientation: 'landscape' },
    { src: '/videos/slider5.mp4', orientation: 'landscape' },
    { src: '/videos/slider3.mp4', orientation: 'portrait' },
    { src: '/videos/slider6.mp4', orientation: 'portrait' },
    { src: '/videos/slider4.mp4', orientation: 'portrait' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <div className="relative h-64 md:h-84 flex items-center justify-center overflow-hidden">
        {/* Blurred background image */}
        <div
          style={{
            backgroundImage: `url(${"/download.webp"})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
          className="absolute inset-0 filter blur-sm scale-110"
        ></div>

        {/* Optional dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Content */}
        <div className="relative md:mt-[5%] sm:mt-[10%] mt-[15%] z-10 h-full text-center flex flex-col items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white">Empower Your Health Journey</h1>
          <p className="text-xl mt-4 text-white">Premium Products & Services Tailored for You</p>
        </div>
      </div>

      {/* Video Slider Section */}
      <div className="py-8 px-4">
        <div className="text-3xl font-bold text-center mb-8 text-gray-800">
          Our Featured Videos
        </div>
        <div className="max-w-7xl mx-auto">
          <div>
            <div className="max-w-6xl mx-auto">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                navigation={true}
                pagination={{ clickable: true }}
                autoplay={false}
                className="swiper-video-theme"
              >
                {heroVideos.map((videoObj, i) => {
                  const isPortrait = videoObj.orientation === 'portrait';

                  return (
                    <SwiperSlide key={i}>
                      <div className="flex justify-center items-center min-h-[400px]">
                        <div
                          className={`relative ${isPortrait ? 'max-w-4xl' : 'max-w-4xl'} w-full group`}
                        >
                          <div
                            className="relative w-full"
                            style={{
                              aspectRatio: isPortrait ? '16/9' : '16/9',
                              maxHeight: isPortrait ? '450px' : '450px'
                            }}
                          >
                            <video
                              src={videoObj.src}
                              autoPlay
                              muted
                              loop
                              playsInline
                              controls
                              className="w-full h-full object-contain rounded-lg shadow-lg bg-black"
                              style={{ aspectRatio: isPortrait ? '16/9' : '16/9' }}
                            />
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        </div>
      </div>

      {/* Products/Services Grid */}
      <ServicesPage />

      {/* Special Highlights */}
      <div className="bg-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm flex items-start">
              <FaMoneyBillWave className="text-green-600 text-2xl mr-4" />
              <div>
                <h3 className="font-bold">Money Back Guarantee</h3>
                <p className="text-gray-600">Not satisfied? Get your money back, no questions asked.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex items-start">
              <FaUserAlt className="text-green-600 text-2xl mr-4" />
              <div>
                <h3 className="font-bold">2 Special Coaches</h3>
                <p className="text-gray-600">Expert guidance from our dedicated coaches.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex items-start">
              <FaCalendarAlt className="text-green-600 text-2xl mr-4" />
              <div>
                <h3 className="font-bold">4 Times One-to-One Consultation</h3>
                <p className="text-gray-600">Ongoing support with regular check-ins.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Custom Swiper styling for video theme */}
      <style jsx global>{`
        /* Video Slider Theme */
        .swiper-video-theme .swiper-button-next,
        .swiper-video-theme .swiper-button-prev {
          color: #16a34a;
          background-color: rgba(255, 255, 255, 0.95);
          width: 55px;
          height: 55px;
          border-radius: 50%;
          margin-top: -27px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: 2px solid rgba(22, 163, 74, 0.2);
        }
        
        .swiper-video-theme .swiper-button-next:hover,
        .swiper-video-theme .swiper-button-prev:hover {
          background-color: #16a34a;
          color: white;
          transform: scale(1.15);
          transition: all 0.3s ease-in-out;
        }
        
        .swiper-video-theme .swiper-button-next:after,
        .swiper-video-theme .swiper-button-prev:after {
          font-size: 20px;
          font-weight: bold;
        }
        
        .swiper-video-theme .swiper-pagination-bullet {
          background-color: #16a34a;
          opacity: 0.5;
          width: 14px;
          height: 14px;
          transition: all 0.3s ease;
          border: 2px solid rgba(22, 163, 74, 0.3);
        }
        
        .swiper-video-theme .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.3);
          background-color: #16a34a;
          border-color: #16a34a;
        }
        
        .swiper-video-theme .swiper-pagination {
          bottom: -50px;
        }

        /* Video specific styling */
        .swiper-video-theme video {
          transition: transform 0.3s ease;
        }
      `}</style>
    </div >
  );
}
