"use client";

import Head from 'next/head';

const SEOHead = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  noIndex = false,
}) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thewellnessspot.vercel.app';
  const fullTitle = title ? `${title} | The Wellness Spot` : 'The Wellness Spot - Your Complete Fitness & Nutrition Companion';
  const defaultDescription = 'Transform your health journey with expert nutrition guidance, personalized workout plans, premium supplements, and professional health consultations.';
  const metaDescription = description || defaultDescription;
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;
  const ogImageUrl = ogImage ? `${siteUrl}${ogImage}` : `${siteUrl}/og-image.jpg`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:alt" content={title || 'The Wellness Spot'} />
      <meta property="og:site_name" content="The Wellness Spot" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:creator" content="@thewellnessspot" />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
};

export default SEOHead;
