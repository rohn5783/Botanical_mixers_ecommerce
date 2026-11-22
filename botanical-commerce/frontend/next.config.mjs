/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
  },
  sassOptions: {
    includePaths: ['./src/styles'],
  },
};

export default nextConfig;
