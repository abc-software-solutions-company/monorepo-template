import withNextIntl from 'next-intl/plugin';
import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@repo/react-web-ui-shadcn', '@repo/shared-web', '@repo/shared-universal'],
  swcMinify: true,
  experimental: { optimizeCss: true },
  optimizeFonts: true,
  compress: true,
  productionBrowserSourceMaps: false, // Disable source maps in production
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  // async headers() {
  //   return [
  //     {
  //       source: '/_next/static/(.*)',
  //       headers: [
  //         { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }, // 1 year for versioned static files
  //       ],
  //     },
  //     {
  //       source: '/static/(.*)',
  //       headers: [
  //         { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }, // 1 year for versioned public files
  //       ],
  //     },
  //     {
  //       source: '/',
  //       headers: [
  //         { key: 'Cache-Control', value: 'public, max-age=300' }, // 5 minutes for the root document
  //       ],
  //     },
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         { key: 'Cache-Control', value: 'public, max-age=300' }, // 5 minutes for other routes
  //       ],
  //     },
  //   ];
  // },
  webpack: config => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    });

    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.join(process.cwd(), './src/libs/svg-icons/dist'),
            to: path.join(process.cwd(), './public/fonts'),
            noErrorOnMissing: true,
          },
        ],
      })
    );

    return config;
  },
};

export default withNextIntl('./i18n.ts')(nextConfig);
