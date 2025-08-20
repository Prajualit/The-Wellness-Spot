import { useState } from 'react';
import { motion } from 'framer-motion';
import Carousel from 'framer-motion-carousel';
import Image from 'next/image';
import { FaHeart, FaAppleAlt, FaChild, FaRunning, FaWeight, FaBalanceScale, FaMale, FaFemale, FaLeaf, FaChevronRight } from 'react-icons/fa';
import { FaWeightScale } from "react-icons/fa6";
import { GiWeightLiftingUp, GiWeightScale, } from "react-icons/gi";
import { IoIosBody } from "react-icons/io";
import { AiFillSkin, AiOutlineSkin } from "react-icons/ai";
import slider1 from '../../app/assets/slider/slider1.jpg';
import slider2 from '../../app/assets/slider/slider2.jpg';
import slider3 from '../../app/assets/slider/slider3.jpg';
import slider4 from '../../app/assets/slider/slider4.jpg';
import slider5 from '../../app/assets/slider/slider5.jpg';
import weightloss from '../../app/assets/weightloss.jpg';
import weightgain from '../../app/assets/weightgain.jpg';
import weightmaintainence from '../../app/assets/weightmaintainence.jpg';
import jointhealth from '../../app/assets/jointhealth.jpg';
import hearthealth from '../../app/assets/hearthealth.jpg';
import innerskin from '../../app/assets/innerskin.jpg';
import outerskin from '../../app/assets/outerskin.jpg';
import womenhealth from '../../app/assets/womenhealth.jpg';
import malehealth from '../../app/assets/malehealth.jpg';
import childrencare from '../../app/assets/childrencare.jpg';
import sportsnutri from '../../app/assets/sportsnutri.jpg';
import Footer from '../footer';
import Navbar from '../Navbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function HealthPage() {
  const [activeTab, setActiveTab] = useState('weight-loss');

  // Sample image URLs for carousel and cards (replace with your own)
  const heroImages = [
    slider1, // Main hero image
    slider2,
    slider3,
    slider4,
    slider5,
  ];

  // Example: Where to add images for each section (replace with your own paths)
  const sectionImages = {
    'weight-loss': weightloss, // Salad, vegetables
    'weight-gain': weightgain, // Protein shake, eggs, nuts
    'weight-maintenance': weightmaintainence, // Balanced plate
    'joint-health': jointhealth, // Joints, fish, berries
    'heart-health': hearthealth, // Oats, salmon, almonds
    'skin-care-inner': innerskin, // Berries, carrots
    'skin-care-outer': outerskin, // Sunscreen, cleanser
    'women-health': womenhealth, // Leafy greens, yogurt
    'male-health': malehealth, // Lean meats, eggs
    'children-care': childrencare, // Kids, apple slices
    'sports-nutrition': sportsnutri, // Athlete, banana, shake
  };

  // Data for each section (simplified for brevity)
  const sections = [
    { id: 'weight-loss', title: 'Weight Loss', icon: <GiWeightScale />, tips: ['Caloric deficit', 'Eat vegetables, lean proteins, whole grains', 'Exercise 150+ mins/week'] },
    { id: 'weight-gain', title: 'Weight Gain', icon: <FaWeightScale />, tips: ['Caloric surplus', 'Eat healthy fats, proteins, complex carbs', 'Strength training'] },
    { id: 'weight-maintenance', title: 'Weight Maintenance', icon: <GiWeightLiftingUp />, tips: ['Caloric balance', 'Portion control', 'Regular exercise'] },
    { id: 'joint-health', title: 'Joint Health', icon: <IoIosBody />, tips: ['Low-impact exercise', 'Anti-inflammatory foods', 'Glucosamine, omega-3s'] },
    { id: 'heart-health', title: 'Heart Health', icon: <FaHeart />, tips: ['Limit fats/salt', 'Eat whole foods', 'Exercise 30 mins/day'] },
    { id: 'skin-care-inner', title: 'Skin Care (Inner)', icon: <AiFillSkin />, tips: ['Hydration', 'Antioxidants', 'Berries, carrots, green tea'] },
    { id: 'skin-care-outer', title: 'Skin Care (Outer)', icon: <AiOutlineSkin />, tips: ['Sunscreen', 'Gentle cleansing', 'Moisturize'] },
    { id: 'women-health', title: 'Women’s Health', icon: <FaFemale />, tips: ['Iron, calcium, folate', 'Leafy greens, dairy, legumes', 'Folic acid if pregnant'] },
    { id: 'male-health', title: 'Male Health', icon: <FaMale />, tips: ['Protein, zinc, healthy fats', 'Lean meats, nuts, seeds', 'Strength training'] },
    { id: 'children-care', title: 'Children Care', icon: <FaChild />, tips: ['Balanced diet', 'Limit sugar', 'Fruits, veggies, whole grains'] },
    { id: 'sports-nutrition', title: 'Sports Nutrition', icon: <FaRunning />, tips: ['Pre/post-workout nutrition', 'Hydration', 'Banana, protein shake, water'] },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      <div className="relative h-64 md:h-84 flex items-center justify-center overflow-hidden">
        {/* Blurred background image */}
        <div
          style={{
            backgroundImage: `url(${"/homeimage.png"})`,
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
          <h1 className="text-3xl md:text-[42px] font-bold text-white">Your Complete Guide to Health & Well-being</h1>
          <p className="text-xl mt-4 text-white">
            Explore our comprehensive resources for nutrition, fitness, and wellness
          </p>
        </div>
      </div>

      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Image Slider Section */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Health & Wellness Gallery</h2>
            <div className="max-w-4xl mx-auto">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                navigation={true}
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                className="swiper-green-theme"
              >
                {heroImages.map((img, i) => (
                  <SwiperSlide key={i}>
                    <Image
                      src={img}
                      alt="Health & Wellness"
                      draggable={false}
                      className="w-full h-64 md:h-96 object-contain rounded-lg"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <motion.div
              key={section.id}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                {/* Add your image here */}
                <Image
                  src={sectionImages[section.id]}
                  alt={section.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-green-600 mr-2">{section.icon}</span>
                  <h3 className="text-xl font-bold">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.tips.map((tip, i) => (
                    <li key={i} className="flex items-center">
                      <FaChevronRight className="text-green-600 mr-2" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Custom Swiper styling for both themes */}
      <style jsx global>{`
        /* Image Slider Theme */
        .swiper-green-theme .swiper-button-next,
        .swiper-green-theme .swiper-button-prev {
          color: #166534;
          background-color: rgba(255, 255, 255, 0.9);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-top: -25px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .swiper-green-theme .swiper-button-next:hover,
        .swiper-green-theme .swiper-button-prev:hover {
          background-color: #166534;
          color: white;
          transform: scale(1.1);
        }
        
        .swiper-green-theme .swiper-button-next:after,
        .swiper-green-theme .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }
        
        .swiper-green-theme .swiper-pagination-bullet {
          background-color: #166534;
          opacity: 0.4;
          width: 12px;
          height: 12px;
          transition: all 0.3s ease;
        }
        
        .swiper-green-theme .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.2);
          background-color: #166534;
        }
        
        .swiper-green-theme .swiper-pagination {
          bottom: -40px;
        }

        /* Video specific styling */
        .swiper-green-theme video {
          transition: transform 0.3s ease;
        }
        
        .swiper-green-theme .swiper-slide:hover video {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}
