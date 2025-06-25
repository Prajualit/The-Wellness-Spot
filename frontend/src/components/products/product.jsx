
import { FaLeaf, FaRunning, FaUserAlt, FaMoneyBillWave, FaCalendarAlt, FaPrescriptionBottle, FaTablets, FaCalculator } from 'react-icons/fa';

import Navbar from '../Navbar';
import Footer from '../footer';
import Image from 'next/image';
import ServicesPage from './services';
import Link from 'next/link';
import banner from '../../app/assets/banner.jpg';


export default function ProductsPage() {
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

      {/* Products/Services Grid */}
      <ServicesPage/>

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
    </div>
  );
}
