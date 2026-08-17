import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sin `output: "standalone"`: el arranque es `next start`, y ambos juntos son
  // incompatibles (Next avisa y el servidor no queda expuesto correctamente).
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["motion"],
  },
};

export default nextConfig;
