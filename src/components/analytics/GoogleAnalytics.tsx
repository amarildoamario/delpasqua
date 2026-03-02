"use client";

import Script from "next/script";

function hasAnalyticsConsent(): boolean {
  if (typeof document === "undefined") return false;
  return /(?:^|;\s*)analytics_consent=1(?:;|$)/.test(document.cookie);
}

export default function GoogleAnalytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

  // In dev o se manca la key: non carichiamo nulla.
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;

          // Consent Mode (GDPR friendly)
          // Default: denied. Se trovi cookie analytics_consent=1 => granted.
          var consentGranted = ${hasAnalyticsConsent().toString()};
          gtag('consent', 'default', {
            ad_storage: 'denied',
            analytics_storage: consentGranted ? 'granted' : 'denied',
            functionality_storage: 'granted',
            security_storage: 'granted',
            wait_for_update: 500
          });

          gtag('js', new Date());

          // SPA: noi inviamo page_view manualmente su cambio route
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}