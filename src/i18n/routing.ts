import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

const locales = ['it', 'en', 'de', 'nl', 'da', 'no'] as const;

const wordpressPathnames: Record<string, string | Record<(typeof locales)[number], string>> = {
    '/privacy': {
        it: '/privacy-policy',
        en: '/privacy-policy',
        de: '/privacy-policy',
        nl: '/privacy-policy',
        da: '/privacy-policy',
        no: '/privacy-policy',
    },
    '/cookie': {
        it: '/cookie-policy',
        en: '/cookie-policy',
        de: '/cookie-policy',
        nl: '/cookie-policy',
        da: '/cookie-policy',
        no: '/cookie-policy',
    },
    '/termini': {
        it: '/condizioni-generali-di-vendita',
        en: '/terms',
        de: '/terms',
        nl: '/terms',
        da: '/terms',
        no: '/terms',
    },
    '/cart': {
        it: '/carrello',
        en: '/cart',
        de: '/cart',
        nl: '/cart',
        da: '/cart',
        no: '/cart',
    },
    '/storia': {
        it: '/storia',
        en: '/about-us',
        de: '/about-us',
        nl: '/about-us',
        da: '/about-us',
        no: '/about-us',
    },
    '/produzione': {
        it: '/produzione',
        en: '/production',
        de: '/production',
        nl: '/production',
        da: '/production',
        no: '/production',
    },
    '/il-nostro-olio': {
        it: '/il-nostro-olio',
        en: '/olive-oil',
        de: '/olive-oil',
        nl: '/olive-oil',
        da: '/olive-oil',
        no: '/olive-oil',
    },
    '/contatti': {
        it: '/contatti',
        en: '/contact',
        de: '/contact',
        nl: '/contact',
        da: '/contact',
        no: '/contact',
    },
    '/degustazioni': {
        it: '/degustazioni',
        en: '/tastings',
        de: '/tastings',
        nl: '/tastings',
        da: '/tastings',
        no: '/tastings',
    },
};

export const routing = defineRouting({
    locales,
    defaultLocale: 'it',
    localePrefix: 'as-needed',
    pathnames: wordpressPathnames,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
