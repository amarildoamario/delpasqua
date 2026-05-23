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
        en: '/condizioni-generali-di-vendita',
        de: '/condizioni-generali-di-vendita',
        nl: '/condizioni-generali-di-vendita',
        da: '/condizioni-generali-di-vendita',
        no: '/condizioni-generali-di-vendita',
    },
    '/cart': {
        it: '/carrello',
        en: '/cart',
        de: '/cart',
        nl: '/cart',
        da: '/cart',
        no: '/cart',
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
