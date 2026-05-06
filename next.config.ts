import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : undefined;
  } catch {
    return undefined;
  }
})();

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // HSTS only sent in production behind HTTPS (Vercel)
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
    : []),
];

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      ...(supabaseHost
        ? [{ protocol: "https" as const, hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
        : []),
      // Free Unsplash photos used as visual fallbacks until the admin uploads
      // real assets through /admin.
      { protocol: "https" as const, hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
    // Cache optimised images on the Vercel CDN for 30 days — both Unsplash
    // assets and Supabase Storage public files are immutable per URL.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Tighter device-size buckets — fewer variants generated, leaner cache,
    // still covers every realistic mobile/tablet/laptop width.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // typedRoutes left disabled: forces every dynamic href into a `Route` cast,
  // which is busywork for a marketing site. Re-enable once URL stability is
  // worth the extra ergonomics tax.
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withNextIntl(config);
