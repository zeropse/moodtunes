/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["natural", "mongodb", "mongoose", "pg", "pg-pool"],
};

export default nextConfig;
