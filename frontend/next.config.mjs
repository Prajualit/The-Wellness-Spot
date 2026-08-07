/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    domains: ["res.cloudinary.com"],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.(pdf)$/i,
        type: "asset/resource",
        generator: { filename: "static/media/[name][ext]" },
      },
      {
        test: /\.(ttf)$/i,
        type: "asset/resource",
        generator: { filename: "static/media/[name][ext]" },
      }
    );
    return config;
  },
  // Enable compression
  compress: true,
  
  // Proxy API requests through Vercel so auth cookies are same-origin
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://client-work-jyoti-prakash.onrender.com/api/v1/:path*",
      },
    ];
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options', 
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  },

  // Performance optimizations
  poweredByHeader: false,
  generateEtags: false,
  
  // Enable static exports for better SEO
  trailingSlash: false,
}

export default nextConfig;
