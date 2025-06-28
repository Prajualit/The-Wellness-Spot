"use client";
import React from 'react'
import { useSelector } from "react-redux";
import Nutrition from '@/components/nutrition/nutrition';

const page = () => {
    // Structured data for nutrition page (moved inside component)
    const nutritionStructuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Nutrition Services - The Wellness Spot",
        "description": "Expert nutrition consultation, personalized diet plans, and nutritional guidance for optimal health and wellness.",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://thewellnessspot.vercel.app'}/nutrition`,
        "isPartOf": {
            "@type": "WebSite",
            "name": "The Wellness Spot",
            "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://thewellnessspot.vercel.app'
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": process.env.NEXT_PUBLIC_SITE_URL || 'https://thewellnessspot.vercel.app'
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Nutrition",
                    "item": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://thewellnessspot.vercel.app'}/nutrition`
                }
            ]
        },
        "mainEntity": {
            "@type": "Service",
            "name": "Nutrition Consultation",
            "description": "Personalized nutrition planning and dietary guidance from certified nutritionists",
            "provider": {
                "@type": "Organization",
                "name": "The Wellness Spot"
            },
            "areaServed": "Global",
            "availableChannel": {
                "@type": "ServiceChannel",
                "serviceType": "Online Consultation"
            }
        }
    };

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(nutritionStructuredData) }}
            />
            
            <div>
                <Nutrition/>
            </div>
        </>
    )
}

export default page
