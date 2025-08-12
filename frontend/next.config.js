/** @type {import('next').NextConfig} */
const nextConfig = {
  
  output: 'standalone',
  images: {
    domains: [
      'images.unsplash.com',
      'maps.googleapis.com',
      'lh3.googleusercontent.com',
      'localhost',
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  },
}

module.exports = nextConfig
