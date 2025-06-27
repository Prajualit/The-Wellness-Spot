/**
 * Utility functions for SEO meta tag generation
 */

export const generateMetaTags = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noIndex = false,
  author,
  publishedTime,
  modifiedTime,
}) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thewellnessspot.vercel.app';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The Wellness Spot';
  const twitterHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@thewellnessspot';
  
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Your Complete Fitness & Nutrition Companion`;
  const defaultDescription = 'Transform your health journey with expert nutrition guidance, personalized workout plans, premium supplements, and professional health consultations.';
  const metaDescription = description || defaultDescription;
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;
  const ogImageUrl = ogImage ? `${siteUrl}${ogImage}` : `${siteUrl}/og-image.jpg`;

  return {
    title: fullTitle,
    description: metaDescription,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    canonical: fullCanonicalUrl,
    openGraph: {
      type: ogType,
      title: fullTitle,
      description: metaDescription,
      url: fullCanonicalUrl,
      siteName: siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title || siteName,
        }
      ],
      locale: 'en_US',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
    },
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description: metaDescription,
      images: [ogImageUrl],
      creator: twitterHandle,
    },
  };
};

export const generateBreadcrumbSchema = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

export const generateOrganizationSchema = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thewellnessspot.vercel.app';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The Wellness Spot';
  
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": "Transform your health journey with expert nutrition guidance, personalized workout plans, premium supplements, and professional health consultations.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English",
      "email": process.env.NEXT_PUBLIC_BUSINESS_EMAIL,
      "telephone": process.env.NEXT_PUBLIC_BUSINESS_PHONE
    },
    "sameAs": [
      process.env.NEXT_PUBLIC_FACEBOOK_URL,
      process.env.NEXT_PUBLIC_INSTAGRAM_URL,
      `https://twitter.com/${process.env.NEXT_PUBLIC_TWITTER_HANDLE?.replace('@', '')}`
    ].filter(Boolean)
  };
};

export const generateWebsiteSchema = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thewellnessspot.vercel.app';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The Wellness Spot';
  
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": siteUrl,
    "description": "Transform your health journey with expert nutrition guidance, personalized workout plans, premium supplements, and professional health consultations.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
};

export const generateProductSchema = (product) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thewellnessspot.vercel.app';
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image ? `${siteUrl}${product.image}` : undefined,
    "brand": {
      "@type": "Brand",
      "name": process.env.NEXT_PUBLIC_SITE_NAME || 'The Wellness Spot'
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": product.currency || "USD",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": process.env.NEXT_PUBLIC_SITE_NAME || 'The Wellness Spot'
      }
    },
    ...(product.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating.value,
        "ratingCount": product.rating.count
      }
    })
  };
};

export const generateServiceSchema = (service) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thewellnessspot.vercel.app';
  
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": process.env.NEXT_PUBLIC_SITE_NAME || 'The Wellness Spot',
      "url": siteUrl
    },
    "areaServed": service.areaServed || "Global",
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceType": service.serviceType || "Online Consultation"
    },
    ...(service.priceRange && {
      "offers": {
        "@type": "Offer",
        "priceRange": service.priceRange,
        "priceCurrency": service.currency || "USD"
      }
    })
  };
};
