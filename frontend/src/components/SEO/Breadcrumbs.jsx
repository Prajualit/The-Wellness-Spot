"use client";

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbSchema } from '@/lib/seo';

const Breadcrumbs = ({ items = [] }) => {
  // Always include home as the first item
  const breadcrumbItems = [
    { name: 'Home', url: '/', icon: Home },
    ...items
  ];

  // Generate structured data
  const structuredData = generateBreadcrumbSchema(
    breadcrumbItems.map(item => ({
      name: item.name,
      url: process.env.NEXT_PUBLIC_SITE_URL + item.url
    }))
  );

  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumbs on homepage
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        <ol className="flex items-center space-x-2">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const Icon = item.icon;
            
            return (
              <li key={item.url} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 mx-2 text-gray-400" aria-hidden="true" />
                )}
                
                {isLast ? (
                  <span className="text-gray-900 font-medium" aria-current="page">
                    {Icon && index === 0 ? (
                      <Icon className="w-4 h-4 inline mr-1" aria-hidden="true" />
                    ) : null}
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    aria-label={`Navigate to ${item.name}`}
                  >
                    {Icon && index === 0 ? (
                      <Icon className="w-4 h-4 inline mr-1" aria-hidden="true" />
                    ) : null}
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
