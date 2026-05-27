import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const LEGACY_301_REDIRECTS = new Map<string, string>([
    ["/cart", "/carrello/"],
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

function normalizeLegacyPath(pathname: string) {
    if (pathname === "/") return pathname;
    return pathname.replace(/\/+$/, "");
}

export async function proxy(request: NextRequest) {
    const legacyDestination = LEGACY_301_REDIRECTS.get(normalizeLegacyPath(request.nextUrl.pathname));
    if (legacyDestination) {
        const redirectUrl = new URL(legacyDestination, request.url);
        return NextResponse.redirect(redirectUrl, 301);
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
