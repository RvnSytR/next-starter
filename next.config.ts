import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.NEVA_BUCKET_NAME}.s3.nevaobjects.id`,
        port: "",
        pathname: "/*",
      },
    ],
  },
};

export default nextConfig;
