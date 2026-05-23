import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
    const response = await intlMiddleware(request);
    const host = request.headers.get('host')?.split(':')[0]?.toLowerCase();
    const isFinalDomain = host === 'delpasqua.com' || host === 'www.delpasqua.com';

    if (process.env.NODE_ENV === 'production' && host && !isFinalDomain) {
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    }

    return response;
}

export const config = {
    // Let internal default-locale rewrites render without re-entering the proxy.
    matcher: ['/((?!api|_next|_vercel|it(?:/|$)|.*\\..*).*)']
};
