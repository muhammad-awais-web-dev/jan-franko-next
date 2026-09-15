import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "janfranko.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      // 1. Academy Governance & Curriculum Root Aliases -> Canonical /academy/...
      { source: "/the-academy", destination: "/academy", permanent: true },
      { source: "/certification", destination: "/academy/certification", permanent: true },
      { source: "/explorer-rank-system", destination: "/academy/explorer-rank-system", permanent: true },
      { source: "/rank-system", destination: "/academy/explorer-rank-system", permanent: true },
      { source: "/code-of-conduct", destination: "/academy/code-of-conduct", permanent: true },
      { source: "/summit-protocol", destination: "/academy/summit-protocol", permanent: true },
      { source: "/environmental-stress-index", destination: "/academy/environmental-stress-index-esi", permanent: true },
      { source: "/environmental-stress-index-esi", destination: "/academy/environmental-stress-index-esi", permanent: true },
      { source: "/esi", destination: "/academy/environmental-stress-index-esi", permanent: true },
      { source: "/explorer-path", destination: "/academy/explorer-path", permanent: true },

      // 2. Legacy Editorial & Scrolls Paths -> Canonical /knowledge/...
      { source: "/editorial", destination: "/knowledge", permanent: true },
      { source: "/editorial/mongolia", destination: "/knowledge/mongolia-expedition", permanent: true },
      { source: "/editorial/:slug*", destination: "/knowledge/:slug*", permanent: true },
      { source: "/scrolls", destination: "/knowledge", permanent: true },
      { source: "/scrolls/mongolia", destination: "/knowledge/mongolia-expedition", permanent: true },
      { source: "/scrolls/category/:path*", destination: "/knowledge", permanent: true },
      { source: "/scrolls/region/:path*", destination: "/knowledge", permanent: true },
      { source: "/scrolls/:slug*", destination: "/knowledge/:slug*", permanent: true },
      // 3. Equipment Categories & Bowyer Root -> Canonical /about/partners
      { source: "/bowyer", destination: "/about/partners", permanent: true },
      { source: "/equipment/categories", destination: "/equipment", permanent: true },
      { source: "/equipment/category", destination: "/equipment", permanent: true },
      { source: "/categories", destination: "/equipment", permanent: true },
    ];
  },
};


export default nextConfig;
