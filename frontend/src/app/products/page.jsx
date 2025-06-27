"use client";
import React from 'react'
import ProductsPage from '@/components/products/product';

// Structured data for products page
const productsStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Health & Fitness Products - The Wellness Spot",
  "description": "Premium health supplements, fitness equipment, and wellness products to support your health journey.",
  "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://thewellnessspot.vercel.app'}/products`,
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
        "name": "Products",
        "item": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://thewellnessspot.vercel.app'}/products`
      }
    ]
  },
  "mainEntity": {
    "@type": "ItemList",
    "name": "Health & Fitness Products",
    "description": "Curated collection of premium health supplements and wellness products",
    "numberOfItems": "50+",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "ProductGroup",
          "name": "Protein Supplements",
          "description": "High-quality protein powders and supplements"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "ProductGroup",
          "name": "Vitamins & Minerals",
          "description": "Essential vitamins and mineral supplements"
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "ProductGroup",
          "name": "Weight Management",
          "description": "Products to support healthy weight management"
        }
      }
    ]
  }
};

const page = () => {
    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productsStructuredData) }}
            />
            
            <div>
                <ProductsPage/>
            </div>
        </>
    )
}

export default page
