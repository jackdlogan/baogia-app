import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.mservice.com.vn",
        pathname: "/momo_app_v2/img/**",
      },
    ],
  },
};

export default nextConfig;
