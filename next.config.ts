import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sortie autonome : bundle minimal pour Docker / Render.
  output: "standalone",
};

export default nextConfig;
