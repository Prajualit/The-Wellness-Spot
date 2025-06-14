"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import clientImages from "@/components/ui/clientImages";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

export default function Testimonials() {
  return (
    <div id="testimonials">
      <section className="w-full py-32 px-8 bg-gradient-to-br from-[#e3fcec] via-white to-[#e8f0fe] relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-green-300 to-green-500 rounded-full blur-2xl animate-bounce"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-4 animate-fade-in">
              ✨ Success Stories
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 animate-slide-up">
              Amazing Transformations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up-delay">
              Witness the incredible before and after results of our dedicated
              clients who trusted their journey with us
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto mt-8 rounded-full"></div>
          </div>

          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView="auto"
              coverflowEffect={{
                rotate: 15,
                stretch: 0,
                depth: 300,
                modifier: 1,
                slideShadows: false, // Disabled Swiper's built-in shadows
              }}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 1.5,
                  spaceBetween: 30,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 40,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 50,
                },
              }}
              className="testimonials-swiper pb-16"
            >
              {clientImages.map((image, index) => (
                <SwiperSlide key={index} className="!w-auto">
                  <div className="group relative p-2">
                    <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-xl transform group-hover:scale-105 transition-all duration-500 ease-out">
                      <div className="relative z-20 p-6">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                          <Image
                            src={image}
                            alt={`Client ${index + 1} transformation result`}
                            width={400}
                            height={400}
                            className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-semibold text-emerald-600 shadow-sm">
                            Result #{index + 1}
                          </div>
                        </div>
                        <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4">
                            <h3 className="font-bold text-gray-800 mb-2">
                              Amazing Transformation
                            </h3>
                            <div className="flex justify-center space-x-4 text-sm">
                              <span className="text-emerald-600 font-semibold">
                                ✓ Achieved Goals
                              </span>
                              <span className="text-blue-600 font-semibold">
                                ✓ Lasting Results
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-50 hover:shadow-emerald-200/50 transition-all duration-300 group">
              <svg
                className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-50 hover:shadow-emerald-200/50 transition-all duration-300 group">
              <svg
                className="w-6 h-6 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s both;
        }

        .animate-slide-up-delay {
          animation: slide-up 0.8s ease-out 0.4s both;
        }

        .testimonials-swiper .swiper-pagination {
          bottom: 0 !important;
        }

        .testimonials-swiper .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: linear-gradient(45deg, #10b981, #3b82f6);
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .testimonials-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.2);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
        }

        .testimonials-swiper .swiper-slide {
          transition: all 0.3s ease;
        }

        .testimonials-swiper .swiper-slide:not(.swiper-slide-active) {
          opacity: 1;
          transform: scale(0.9);
        }

        .testimonials-swiper .swiper-slide-active {
          opacity: 1;
          transform: scale(1);
        }
      `}</style>
    </div>
  );
}
