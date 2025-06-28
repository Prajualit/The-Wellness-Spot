import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ReduxProvider from "@/redux/reduxProvider.js";
import AnalyticsProvider from "@/components/AnalyticsProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
}); 

export const metadata = {
  title: {
    default: "The Wellness Spot - Your Complete Fitness & Nutrition Companion",
    template: "%s | The Wellness Spot"
  },
  description: "Transform your health journey with The Wellness Spot. Expert nutrition guidance, personalized workout plans, premium supplements, and professional health consultations. Start your wellness transformation today.",
  keywords: [
    "wellness",
    "fitness",
    "nutrition",
    "health supplements",
    "workout plans", 
    "diet consultation",
    "health transformation",
    "fitness goals",
    "nutrition planning",
    "wellness coaching"
  ],
  authors: [{ name: "The Wellness Spot Team" }],
  creator: "The Wellness Spot",
  publisher: "The Wellness Spot",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://thewellnessspot.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'The Wellness Spot',
    title: 'The Wellness Spot - Your Complete Fitness & Nutrition Companion',
    description: 'Transform your health journey with expert nutrition guidance, personalized workout plans, premium supplements, and professional health consultations.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'The Wellness Spot - Transform Your Health Journey',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Wellness Spot - Your Complete Fitness & Nutrition Companion',
    description: 'Transform your health journey with expert nutrition guidance, personalized workout plans, premium supplements, and professional health consultations.',
    images: ['/og-image.jpg'],
    creator: '@thewellnessspot',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    bing: process.env.BING_VERIFICATION,
  },
};

export default function RootLayout({ children }) {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
  
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#16a34a" />
        <meta name="msapplication-TileColor" content="#16a34a" />
        
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        {GA_TRACKING_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    page_location: window.location.href,
                    page_title: document.title,
                  });
                `,
              }}
            />
          </>
        )}
        
        {/* JSON-LD structured data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "The Wellness Spot",
              "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://thewellnessspot.vercel.app',
              "logo": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://thewellnessspot.vercel.app'}/logo.png`,
              "description": "Transform your health journey with expert nutrition guidance, personalized workout plans, premium supplements, and professional health consultations.",
              "sameAs": [
                "https://facebook.com/thewellnessspot",
                "https://instagram.com/thewellnessspot",
                "https://twitter.com/thewellnessspot"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "English"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
