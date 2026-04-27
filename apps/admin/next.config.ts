import type { NextConfig } from "next";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  transpilePackages: ["@vestrapay/ui"],
  turbopack: {
    root: resolve(__dirname, "../.."),
  },
};

export default nextConfig;
