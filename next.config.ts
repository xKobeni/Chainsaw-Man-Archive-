import type { NextConfig } from "next";

const config: NextConfig = {
  async redirects() {
    return [{ source: "/world", destination: "/locations", permanent: true }];
  },
};

export default config;
