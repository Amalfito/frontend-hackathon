import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sortie autonome UNIQUEMENT hors Vercel (Docker / Render).
  // Sur Vercel, `output: "standalone"` casse le routage → 404 NOT_FOUND.
  // Vercel définit VERCEL=1 pendant le build.
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
};

export default nextConfig;
