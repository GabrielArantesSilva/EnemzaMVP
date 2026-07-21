import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const nextConfig: NextConfig = {
  /* config options here */
};

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // Serwist não suporta Turbopack em dev ainda (github.com/serwist/serwist/issues/54).
  // Desabilita o service worker em desenvolvimento; roda normalmente em produção (Vercel).
  disable: process.env.NODE_ENV !== "production",
});

export default withSerwist(nextConfig);
