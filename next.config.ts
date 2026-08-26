import type { NextConfig } from "next";
import { siteConfig } from "./src/lib/site-config";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // The `download` attribute alone is a hint the browser's built-in PDF
        // viewer may ignore. Forcing the disposition makes the CV save to disk
        // from every entry point — hero button, command palette, direct URL.
        source: siteConfig.cvUrl,
        headers: [
          {
            key: "Content-Disposition",
            value: `attachment; filename="${siteConfig.cvFileName}"`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
