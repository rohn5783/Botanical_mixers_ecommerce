/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
  },
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'https://botanical-mixers-ecommerce.onrender.com';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
