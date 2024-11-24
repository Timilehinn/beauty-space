// /** @type {import('next').NextConfig} */
// const { i18n } = require('./next-i18next.config.js')

// module.exports = {
//   typescript: {
//     ignoreBuildErrors: true, // Disables type checking during builds
//   },
//   reactStrictMode: true,
//   images: {
//     unoptimized: true,
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'd1pzp604yjq4ak.cloudfront.net',
//         port: '',
//         pathname: '/my-bucket/**', // Adjust the pathname as needed
//       },
//       // Add other patterns if necessary
//     ],
//   },
//   i18n,
// }

/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config.js')

module.exports = {
  typescript: {
    ignoreBuildErrors: true, // Disables type checking during builds
  },
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd1pzp604yjq4ak.cloudfront.net',
        port: '',
        pathname: '/my-bucket/**', // Adjust the pathname as needed
      },
      // Add other patterns if necessary
    ],
  },
  i18n,
  webpack(config, { isServer }) {
    // Enable source maps for production builds
    if (!isServer) {
      config.devtool = 'source-map';
    }else{
      config.devtool = 'source-map';
    }
    return config;
  },
}