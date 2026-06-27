import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { Manrope } from "next/font/google";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from "next";
import { getSeoLocale, SITE_NAME, SITE_URL } from "@/lib/seo";
import { readPublicCatalog } from "@/lib/server/catalog";

const uiSans = Manrope({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

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

  setRequestLocale(locale);

  const messages = await getMessages();
  const initialCatalog = await readPublicCatalog();
  return (
    <html lang={getSeoLocale(locale)} className={uiSans.variable}>
      <head>
        {/* Forza il browser a usare SOLO light UI */}
        <meta name="color-scheme" content="light" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>

      <body className={`${uiSans.className} bg-white text-zinc-900 antialiased font-sans`}>
        <NextIntlClientProvider messages={messages}>
          <Providers initialCatalog={initialCatalog}>
            <GoogleAnalytics />
            <Navbar initialCatalog={initialCatalog.map((product) => ({ id: product.id, slug: product.slug }))} />

            <main>
              {children}
            </main>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
