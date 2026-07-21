/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  turbopack: {
    root: import.meta.dirname,
  },
  allowedDevOrigins: ["192.168.1.8"],
};

export default nextConfig;
