export const metadata = {
  title: "Ask Our Health Experts - Free Consultation",
  description: "Get personalized health advice and answers to your wellness questions from certified nutritionists and fitness experts. Free consultation available.",
  keywords: [
    "health consultation",
    "nutrition advice",
    "fitness questions",
    "wellness consultation",
    "health expert",
    "free consultation",
    "health queries",
    "fitness guidance",
    "nutrition questions",
    "wellness support"
  ],
  openGraph: {
    title: "Ask Our Health Experts - Free Consultation | The Wellness Spot",
    description: "Get personalized health advice and answers to your wellness questions from certified nutritionists and fitness experts.",
    url: "/query",
    type: "website",
    images: [
      {
        url: "/images/consultation-og.jpg",
        width: 1200,
        height: 630,
        alt: "Health consultation and expert advice",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ask Our Health Experts - Free Consultation | The Wellness Spot",
    description: "Get personalized health advice and answers to your wellness questions from certified nutritionists and fitness experts.",
    images: ["/images/consultation-og.jpg"],
  },
  alternates: {
    canonical: "/query",
  },
};

export default function QueryLayout({ children }) {
  return children;
}
