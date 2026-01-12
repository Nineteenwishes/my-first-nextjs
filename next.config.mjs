/** @type {import('next').NextConfig} */
const nextConfig = {
    // Image optimization configuration
    images: {
        // Enable modern image formats
        formats: ['image/avif', 'image/webp'],
        // Device sizes for responsive images
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        // Image sizes for srcset
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        // Minimize image response time
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    },

    // Enable gzip compression
    compress: true,

    // Optimize bundle
    poweredByHeader: false,
};

export default nextConfig;

