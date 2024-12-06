import type { NextConfig } from "next";
const bucketName = process.env.NEVA_BUCKET_NAME;

if (!bucketName) {
  throw new Error("Environment variable NEVA_BUCKET_NAME is not set");
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${bucketName}.s3.nevaobjects.id`,
        port: "",
        pathname: "/*",
      },
    ],
  },
};

export default nextConfig;
