import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { locales, localizedPathnames } from './pathnames';

export const routing = defineRouting({
    locales,
    defaultLocale: 'it',
    localePrefix: 'as-needed',
    // Page metadata and sitemaps know translated dynamic slugs; middleware does not.
    alternateLinks: false,
    // An explicit URL keeps its language, regardless of browser settings or cookies.
    localeDetection: false,
    pathnames: localizedPathnames,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, permanentRedirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
