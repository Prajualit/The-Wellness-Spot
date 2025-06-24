
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
        <Navbar/>
      {/* Hero Section */}
      <div className="relative mt-16 h-64 md:h-96 bg-green-700 flex items-center justify-center">
        <Image
          src={banner}
          alt="Health Products"
          className="absolute w-full h-full  object-fill opacity-80"
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white">Empower Your Health Journey</h1>
          <p className="mt-4 text-xl text-white">Premium Products & Services Tailored for You</p>
          <Link href='#services' scroll={true}>
            <button className="mt-6 bg-white text-green-700 px-6 py-2 rounded-lg font-medium hover:bg-green-100 transition">
              Explore Our Offerings below
            </button>
          </Link>
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
      <Footer/>
    </div>
  );
}
