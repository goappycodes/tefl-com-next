/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server mode (no static export): on-demand ISR + Route Handlers
  // (/api/revalidate, sitemap/robots proxies) need it.
  output: undefined,
  // WordPress permalinks end in "/" — keep the exact same URL shape.
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  async rewrites() {
    return {
      beforeFiles: [
        // Yoast sitemaps (+ their XSL) at the exact live URLs, in every geo folder.
        {
          source: "/:file((?:[a-z_]+-)?sitemap(?:_index|\\d*)\\.xml)",
          destination: "/api/sitemap/:file",
        },
        {
          source: "/:cc(gb|za|nl|ca|it|fr)/:file((?:[a-z_]+-)?sitemap(?:_index|\\d*)\\.xml)",
          destination: "/api/sitemap/:cc/:file",
        },
        { source: "/main-sitemap.xsl", destination: "/api/sitemap/main-sitemap.xsl" },
      ],
    };
  },
};

export default nextConfig;
