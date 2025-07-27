import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable standalone output for Docker optimization
  output: 'standalone',
  
  // External packages that should not be bundled
  serverExternalPackages: ['sqlmodel', 'winston'],
  
  // Image optimization settings
  images: {
    domains: ['localhost', 'klipsmart.shop', 'www.klipsmart.shop', 'api.klipsmart.shop', 'slam-frontend-627487702645-us-central1.a.run.app'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    unoptimized: false, // Re-enable optimization for better performance
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Add loader configuration for better image handling
    loader: 'default',
    path: '/_next/image',
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Logging configuration
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default nextConfig
