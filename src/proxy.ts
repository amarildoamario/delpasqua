import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const LEGACY_301_REDIRECTS = new Map<string, string>([
    ["/cart", "/carrello/"],
    ["/portfolio-category/details", "/produzione/"],
    ["/portfolio-category/nature", "/storia/"],
    ["/portfolio-category/photogrpahy", "/storia/"],
    ["/portfolio-category/wine", "/shop/vino-vittoria/"],
    ["/portfolio-tag/blanc-winery", "/produzione/"],
    ["/portfolio-tag/countryside-bay", "/storia/"],
    ["/portfolio-tag/organic-company", "/storia/"],
    ["/portfolio-tag/organic-winery", "/produzione/"],
    ["/portfolio-item/wine-shop", "/shop/vino-vittoria/"],
    ["/portfolio-item/wine-shop-2", "/shop/vino-vittoria/"],
    ["/portfolio-item/wine-shop-4", "/shop/vino-vittoria/"],
    ["/portfolio-item/wine-club", "/shop/vino-vittoria/"],
    ["/portfolio-item/wine-club-2", "/shop/vino-vittoria/"],
    ["/portfolio-item/wine-club-3", "/shop/vino-vittoria/"],
    ["/portfolio-item/red-wine", "/shop/vino-vittoria/"],
    ["/portfolio-item/red-wine-2", "/shop/vino-vittoria/"],
    ["/portfolio-item/red-wine-3", "/shop/vino-vittoria/"],
    ["/portfolio-item/white-wine", "/shop/vino-vittoria/"],
    ["/portfolio-item/white-wine-2", "/shop/vino-vittoria/"],
    ["/portfolio-item/white-wine-3", "/shop/vino-vittoria/"],
    ["/portfolio-item/white-wine-4", "/shop/vino-vittoria/"],
    ["/portfolio-item/white-wine-4-2", "/shop/vino-vittoria/"],
    ["/portfolio-item/desert-wine", "/shop/vino-vittoria/"],
    ["/portfolio-item/desert-wine-2", "/shop/vino-vittoria/"],
    ["/portfolio-item/desert-wine-3", "/shop/vino-vittoria/"],
    ["/portfolio-item/desert-wine-3-2", "/shop/vino-vittoria/"],
    ["/portfolio-item/green-wine", "/shop/vino-vittoria/"],
    ["/portfolio-item/green-wine-2", "/shop/vino-vittoria/"],
    ["/portfolio-item/the-winery", "/produzione/"],
    ["/portfolio-item/the-winery-2", "/produzione/"],
    ["/portfolio-item/the-winery-3", "/produzione/"],
    ["/portfolio-item/wineyards", "/storia/"],
    ["/portfolio-item/wineyards-2", "/storia/"],
    ["/portfolio-item/wineyards-3", "/storia/"],
    ["/product/olio-extravergine-di-oliva-evo", "/shop/evo/"],
    ["/product/olio-extravergine-di-oliva-fruttato-medio-100-italiano", "/shop/fruttato-medio/"],
    ["/product/olio-extravergine-di-oliva-fruttato-intenso-100-italiano", "/shop/fruttato-intenso/"],
    ["/product/olio-aromatizzato-al-tartufo", "/shop/tartufo/"],
    ["/product/olio-aromatico-al-peperoncino", "/shop/peperoncino/"],
    ["/product/olio-aromatico-al-limone", "/shop/"],
    ["/product-category/aromatici", "/shop/"],
    ["/product-category/magnifico", "/shop/"],
    ["/zblog-list-2", "/blog/"],
]);

const LOCALES_WITH_PREFIX = ["en", "de", "nl", "da", "no", "es", "fr", "us"];

function extractLocaleAndPath(pathname: string): { locale: string | null; cleanPath: string } {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0 && LOCALES_WITH_PREFIX.includes(segments[0])) {
        const locale = segments[0];
        const cleanPath = '/' + segments.slice(1).join('/');
        return { locale, cleanPath };
    }
    return { locale: null, cleanPath: pathname };
}

function normalizeLegacyPath(pathname: string) {
    if (pathname === "/") return pathname;
    return pathname.replace(/\/+$/, "");
}

export async function proxy(request: NextRequest) {
    const { locale, cleanPath } = extractLocaleAndPath(request.nextUrl.pathname);
    const normalizedPath = normalizeLegacyPath(cleanPath);
    const legacyDestination = LEGACY_301_REDIRECTS.get(normalizedPath);

    if (legacyDestination) {
        // If it's the English cart (which is a valid native route /en/cart in Next.js),
        // bypass the legacy redirect to avoid an infinite loop with next-intl.
        if ((locale === 'en' || locale === 'us') && normalizedPath === '/cart') {
            // Proceed to intlMiddleware
        } else {
            let finalDestination = legacyDestination;
            if (locale) {
                // Prepend the locale code back (e.g. /en/shop/evo/ or /en/produzione/)
                finalDestination = `/${locale}${legacyDestination}`;
            }
            const redirectUrl = new URL(finalDestination, request.url);
            return NextResponse.redirect(redirectUrl, 301);
        }
    }

    const response = await intlMiddleware(request);
    const host = request.headers.get('host')?.split(':')[0]?.toLowerCase();
    const isFinalDomain = host === 'delpasqua.com' || host === 'www.delpasqua.com';

    if (process.env.NODE_ENV === 'production' && host && !isFinalDomain) {
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    }

    return response;
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
