import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import GA4RouteTracker from "@/components/analytics/GA4RouteTracker";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  const messages = await getMessages();
  return (
    <html lang={locale}>
      <head>
        {/* Forza il browser a usare SOLO light UI */}
        <meta name="color-scheme" content="light" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>

      <body className="bg-white text-zinc-900">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <GoogleAnalytics />
            <GA4RouteTracker />
            <Navbar />

            <main>
              {children}

              {/* Spacer SOLO in fondo pagina per non far coprire il footer dalla bottom navbar mobile */}
              <div
                className="md:hidden"
                aria-hidden="true"
                style={{ height: "calc(76px + env(safe-area-inset-bottom))" }}
              />
            </main>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}