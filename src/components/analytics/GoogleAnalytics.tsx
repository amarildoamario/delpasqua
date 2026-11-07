"use client";

import Script from "next/script";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const GA4RouteTracker = dynamic(() => import("./GA4RouteTracker"), { ssr: false });

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

          // I collaudi controllati possono impostare il cookie internal=1.
          // In quel caso GA4 viene disabilitato completamente per questo browser.
          var testMode = new URLSearchParams(window.location.search).get('test_mode');
          if (testMode === '1') document.cookie = 'internal=1; Max-Age=86400; Path=/; SameSite=Lax; Secure';
          if (testMode === '0') document.cookie = 'internal=; Max-Age=0; Path=/; SameSite=Lax; Secure';
          var internalTraffic = testMode === '1' || (testMode !== '0' && /(?:^|;\\s*)internal=1(?:;|$)/.test(document.cookie));
          if (internalTraffic) window['ga-disable-${GA_ID}'] = true;

          // Consent Mode (GDPR friendly)
          // Default: denied. Se trovi cookie analytics_consent=1 => granted.
          var consentGranted = !internalTraffic && /(?:^|;\\s*)analytics_consent=1(?:;|$)/.test(document.cookie);
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
      <Suspense fallback={null}>
        <GA4RouteTracker />
      </Suspense>
    </>
  );
}
