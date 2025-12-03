/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mwikduzkufyldfrwowdh.supabase.co',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig

