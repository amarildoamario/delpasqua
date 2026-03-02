
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const isProd = process.env.NODE_ENV === "production";

const securityHeaders = [
  // Non far sniffare i MIME
  { key: "X-Content-Type-Options", value: "nosniff" },

  // Anti clickjacking
  { key: "X-Frame-Options", value: "DENY" },

  // Referrer più safe
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  // Info minime su permessi browser (tienilo conservativo)
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "ambient-light-sensor=()",
      "autoplay=()",
      "battery=()",
      "camera=()",
      "clipboard-read=()",
      "clipboard-write=()",
      "display-capture=()",
      "document-domain=()",
      "encrypted-media=()",
      "execution-while-not-rendered=()",
      "execution-while-out-of-viewport=()",
      "fullscreen=(self)",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "midi=()",
      "navigation-override=()",
      "payment=()",
      "picture-in-picture=()",
      "publickey-credentials-get=()",
      "screen-wake-lock=()",
      "sync-xhr=()",
      "usb=()",
      "web-share=()",
      "xr-spatial-tracking=()",
    ].join(", "),
  },

  // COOP/COEP/CORP: qui teniamo SOLO COOP (meno rischi di rompere roba esterna)
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },

  // Base XSS protection deprecata nei browser moderni ma innocua
  { key: "X-XSS-Protection", value: "0" },
];

// HSTS SOLO in produzione e SOLO su HTTPS (su Vercel/Reverse proxy va bene)
const hstsHeader = isProd
  ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }]
  : [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nextConfig: any = {
  reactCompiler: true,

  // toglie "X-Powered-By: Next.js"
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },

  async headers() {
    return [
      // Applica headers a tutto (pagine + api)
      {
        source: "/:path*",
        headers: [...securityHeaders, ...hstsHeader],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
