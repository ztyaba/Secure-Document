import withPWA from 'next-pwa';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  transpilePackages: ['@clerk/nextjs']
};

export default withPWA({
  dest: 'public',
  disable: !isProd,
  register: true,
  skipWaiting: true
})(nextConfig);
