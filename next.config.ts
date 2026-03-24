import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        // Proxy to the external Next.js backend to bypass CORS
        destination: "https://campground-backend-cedt.vercel.app/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
