import { useState } from 'react';
import { motion } from 'framer-motion';
import Carousel from 'framer-motion-carousel';
import Image from 'next/image';
import { FaHeart, FaAppleAlt, FaChild, FaRunning, FaWeight, FaBalanceScale, FaMale, FaFemale, FaLeaf, FaChevronRight } from 'react-icons/fa';
import { FaWeightScale } from "react-icons/fa6";
import { GiWeightLiftingUp, GiWeightScale, } from "react-icons/gi";
import { IoIosBody } from "react-icons/io";
import { AiFillSkin, AiOutlineSkin  } from "react-icons/ai";
import yoga1 from '../../app/assets/yoga1.jpg';
import yoga2 from '../../app/assets/yoga2.jpg';
import yoga3 from '../../app/assets/yoga3.jpg';
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

export default function HealthPage() {
  const [activeTab, setActiveTab] = useState('weight-loss');

  // Sample image URLs for carousel and cards (replace with your own)
  const heroImages = [
    yoga1, // Healthy foods, fitness, happy people
    yoga2, // Group exercise
    yoga3, // Family health
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
      <Navbar/>
      

      {/* Hero Section */}
      <div className="py-8 px-4 mt-16"> 
        <div className="max-w-4xl mx-auto">
          <Carousel autoPlay={false} interval={5000}>
            {heroImages.map((img, i) => (
              <Image
                key={i}
                src={img}
                alt="Health & Wellness"
                draggable={false}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            ))}
          </Carousel>
          <h2 className="mt-6 text-3xl font-bold text-center text-green-700">Your Complete Guide to Health & Well-being</h2>
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
                      <FaChevronRight className="text-green-500 mr-2" />
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
      <Footer/>
    </div>
  );
}
