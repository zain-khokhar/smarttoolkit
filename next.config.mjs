/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:tool',
        destination: '/tools/img/:tool',
      },
    ];
  },
};

export default nextConfig;
