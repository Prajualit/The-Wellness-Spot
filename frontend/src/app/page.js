"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Landing from "@/components/Landing";
import About from "@/components/about";
import Testimonials from "@/components/testimonials";
import Product from "@/components/Families";
import Footer from "@/components/footer";
import { useSelector } from "react-redux";

export default function Home() {
  // Structured data for the homepage (moved inside component to access NEXT_PUBLIC vars)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Wellness Spot",
    url:
      process.env.NEXT_PUBLIC_SITE_URL || "https://thewellnessspot.vercel.app",
    logo: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://thewellnessspot.vercel.app"
    }/logo.png`,
    description:
      "Transform your health journey with expert nutrition guidance, personalized workout plans, premium supplements, and professional health consultations.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "English",
    },
    sameAs: [
      "https://facebook.com/thewellnessspot",
      "https://instagram.com/thewellnessspot",
      "https://twitter.com/thewellnessspot",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Wellness Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Nutrition Consultation",
            description: "Personalized nutrition planning and dietary guidance",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Fitness Training",
            description: "Customized workout plans and fitness coaching",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Health Supplements",
            description: "Premium quality health and fitness supplements",
          },
        },
      ],
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="w-screen h-screen bg-[#f7fafc] overflow-x-hidden ">
        <Navbar />
        <main role="main">
          <Landing />
          <About />
          <Testimonials />
          <Product />
        </main>
        <Footer />
      </div>
    </>
  );
}
