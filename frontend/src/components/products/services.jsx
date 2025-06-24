import Image from 'next/image';
import shakeweight from '../../app/assets/shakeweight.jpg';
import tablettarget from '../../app/assets/tablettarget.jpg';
import energydrink from '../../app/assets/energydrink.jpg';
import shakes from '../../app/assets/shakes.jpg';
import tabletbox from '../../app/assets/tabletbox.jpg';
import marathon from '../../app/assets/marathon.jpg';
import dietplan from '../../app/assets/dietplan.jpg';
import basicexercise from '../../app/assets/basicexercise.jpg';
import yoga from '../../app/assets/yoga.jpg';
import { RiDrinksFill, RiDrinks2Fill } from "react-icons/ri";
import { GiPowderBag, GiJumpingRope } from "react-icons/gi";
import { GrYoga } from "react-icons/gr";
import { motion } from 'framer-motion';
import { FaLeaf, FaRunning, FaUserAlt, FaMoneyBillWave, FaCalendarAlt, FaPrescriptionBottle, FaTablets, FaCalculator } from 'react-icons/fa';



const products = [
  {
    id: 1,
    title: "Shakes for Weight Management",
    image: shakeweight,
    icon: <RiDrinksFill />,
    description: "Personalized shakes to help you reach your weight goals.",
    highlight: "Personalized Plans",
    action: "Learn More"
  },
  {
    id: 2,
    title: "Tablets for Target",
    image: tablettarget,
    icon: <FaTablets />,
    description: "Targeted supplements for your specific needs.",
    highlight: "Targeted Nutrition",
    action: "Learn More"
  },
  {
    id: 3,
    title: "Energy Drinks",
    image: energydrink,
    icon: <RiDrinks2Fill />,
    description: "Wholesome energy drinks for a quick, healthy energy boost without the crash.",
    highlight: "Natural ingredients, quick energy, no crash",
    action: "Buy Now"
  },
  {
    id: 4,
    title: "Shakes",
    image: shakes,
    icon: <GiPowderBag />,
    description: "Delicious, nutritious shakes for meal replacement or snack, rich in protein and vitamins.",
    highlight: "Convenient, balanced nutrition, tasty",
    action: "Buy Now"
  },
  {
    id: 5,
    title: "Tablet Box",
    image: tabletbox,
    icon: <FaPrescriptionBottle />,
    description: "A convenient box containing a variety of essential supplements for daily health",
    highlight: "All-in-one, easy to use, supports wellness",
    action: "Buy Now"
  },
  {
    id: 6,
    title: "Special Marathons",
    image: marathon,
    icon: <FaRunning />,
    description: "Community-driven marathons to challenge yourself and connect with others.",
    highlight: "Motivational, social, fun, goal-oriented",
    action: "Register Now"
  },
  {
    id: 7,
    title: "One-to-One Diet Plan",
    image: dietplan,
    icon: <FaCalculator />,
    description: "Personalized diet plan tailored to your unique needs and goals by expert nutritionists.",
    highlight: "Customized, expert advice, sustainable",
    action: "Book Now"
  },
  {
    id: 8,
    title: "Daily Basic Exercise",
    image: basicexercise,
    icon: <GiJumpingRope />,
    description: "Simple, effective daily exercise routines suitable for all fitness levels.",
    highlight: "Easy to follow, improves fitness, flexible",
    action: "Start Now"
  },
  {
    id: 9,
    title: "Yoga",
    image: yoga,
    icon: <GrYoga />,
    description: "Guided yoga sessions for flexibility, strength, and mental clarity.",
    highlight: "Mind-body balance, relaxing, accessible",
    action: "Book Now"
  },
  
];



export default function ServicesPage() {
    return(
        <section id='services'>

                <div className="max-w-6xl mx-auto py-12 px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                    <div className="h-48 overflow-hidden">
                        <Image
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-6">
                        <div className="flex items-center mb-2">
                        <span className="text-green-600 mr-2">{product.icon}</span>
                        <h3 className="text-xl font-bold">{product.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-3">{product.description}</p>
                        <div className="flex items-center mb-4">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                            {product.highlight}
                        </span>
                        </div>
                        
                    </div>
                    </motion.div>
                ))}
                </div>
            </div>
        </section>
    );
}