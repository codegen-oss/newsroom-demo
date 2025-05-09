/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://news-room.modal.run/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

