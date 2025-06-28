export const metadata = {
  title: "Expert Nutrition Services & Consultation",
  description: "Get personalized nutrition guidance from certified nutritionists. Custom diet plans, nutritional assessments, and expert advice for optimal health and wellness goals.",
  keywords: [
    "nutrition consultation",
    "diet planning",
    "nutritionist",
    "healthy eating",
    "meal planning",
    "nutrition advice",
    "dietary guidance",
    "wellness nutrition",
    "weight management",
    "sports nutrition"
  ],
  openGraph: {
    title: "Expert Nutrition Services & Consultation | The Wellness Spot",
    description: "Get personalized nutrition guidance from certified nutritionists. Custom diet plans, nutritional assessments, and expert advice for optimal health.",
    url: "/nutrition",
    type: "website",
    images: [
      {
        url: "/images/nutrition-og.jpg",
        width: 1200,
        height: 630,
        alt: "Nutrition consultation and diet planning services",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Expert Nutrition Services & Consultation | The Wellness Spot",
    description: "Get personalized nutrition guidance from certified nutritionists. Custom diet plans, nutritional assessments, and expert advice for optimal health.",
    images: ["/images/nutrition-og.jpg"],
  },
  alternates: {
    canonical: "/nutrition",
  },
};

export default function NutritionLayout({ children }) {
  return children;
}
