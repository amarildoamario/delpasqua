import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { locales, localizedPathnames } from './pathnames';

export const routing = defineRouting({
    locales,
    defaultLocale: 'it',
    localePrefix: 'as-needed',
    pathnames: localizedPathnames,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
