
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
  trailingSlash: true,

  // toglie "X-Powered-By: Next.js"
  poweredByHeader: false,
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

  async redirects() {
    return [
      // INTERVENTO 1: Redirect Categoria Vino (WordPress -> Vercel)
      {
        source: "/portfolio-category/wine",
        destination: "/shop/vino/",
        permanent: true,
      },
      {
        source: "/portfolio-category/wine/",
        destination: "/shop/vino/",
        permanent: true,
      },
      {
        source: "/en/portfolio-category/wine",
        destination: "/en/shop/vino/",
        permanent: true,
      },
      {
        source: "/en/portfolio-category/wine/",
        destination: "/en/shop/vino/",
        permanent: true,
      },

      // INTERVENTO 2: Redirect di sicurezza /it/ per evitare pagine duplicate
      {
        source: "/it",
        destination: "/",
        permanent: true,
      },
      {
        source: "/it/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/it/storia",
        destination: "/storia/",
        permanent: true,
      },
      {
        source: "/it/storia/",
        destination: "/storia/",
        permanent: true,
      },
      {
        source: "/it/produzione",
        destination: "/produzione/",
        permanent: true,
      },
      {
        source: "/it/produzione/",
        destination: "/produzione/",
        permanent: true,
      },
      {
        source: "/it/il-nostro-olio",
        destination: "/il-nostro-olio/",
        permanent: true,
      },
      {
        source: "/it/il-nostro-olio/",
        destination: "/il-nostro-olio/",
        permanent: true,
      },
      {
        source: "/it/shop",
        destination: "/shop/",
        permanent: true,
      },
      {
        source: "/it/shop/",
        destination: "/shop/",
        permanent: true,
      },
      {
        source: "/it/acquista",
        destination: "/acquista/",
        permanent: true,
      },
      {
        source: "/it/acquista/",
        destination: "/acquista/",
        permanent: true,
      },
      {
        source: "/it/contatti",
        destination: "/contatti/",
        permanent: true,
      },
      {
        source: "/it/contatti/",
        destination: "/contatti/",
        permanent: true,
      },
      {
        source: "/it/degustazioni",
        destination: "/degustazioni/",
        permanent: true,
      },
      {
        source: "/it/degustazioni/",
        destination: "/degustazioni/",
        permanent: true,
      },
      {
        source: "/it/privacy-policy",
        destination: "/privacy-policy/",
        permanent: true,
      },
      {
        source: "/it/privacy-policy/",
        destination: "/privacy-policy/",
        permanent: true,
      },
      {
        source: "/it/cookie-policy",
        destination: "/cookie-policy/",
        permanent: true,
      },
      {
        source: "/it/cookie-policy/",
        destination: "/cookie-policy/",
        permanent: true,
      },
      {
        source: "/it/condizioni-generali-di-vendita",
        destination: "/condizioni-generali-di-vendita/",
        permanent: true,
      },
      {
        source: "/it/condizioni-generali-di-vendita/",
        destination: "/condizioni-generali-di-vendita/",
        permanent: true,
      },

      // Migration of English slugs from Italian to English
      {
        source: "/en/storia",
        destination: "/en/about-us/",
        permanent: true,
      },
      {
        source: "/en/storia/",
        destination: "/en/about-us/",
        permanent: true,
      },
      {
        source: "/en/produzione",
        destination: "/en/production/",
        permanent: true,
      },
      {
        source: "/en/produzione/",
        destination: "/en/production/",
        permanent: true,
      },
      {
        source: "/en/il-nostro-olio",
        destination: "/en/olive-oil/",
        permanent: true,
      },
      {
        source: "/en/il-nostro-olio/",
        destination: "/en/olive-oil/",
        permanent: true,
      },
      {
        source: "/en/acquista",
        destination: "/en/buy/",
        permanent: true,
      },
      {
        source: "/en/acquista/",
        destination: "/en/buy/",
        permanent: true,
      },
      {
        source: "/en/contatti",
        destination: "/en/contact/",
        permanent: true,
      },
      {
        source: "/en/contatti/",
        destination: "/en/contact/",
        permanent: true,
      },
      {
        source: "/en/degustazioni",
        destination: "/en/tastings/",
        permanent: true,
      },
      {
        source: "/en/degustazioni/",
        destination: "/en/tastings/",
        permanent: true,
      },
      {
        source: "/en/condizioni-generali-di-vendita",
        destination: "/en/terms/",
        permanent: true,
      },
      {
        source: "/en/condizioni-generali-di-vendita/",
        destination: "/en/terms/",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
