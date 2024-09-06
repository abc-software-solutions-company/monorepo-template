import { LocalePrefix, Pathnames } from 'next-intl/routing';

export const localeDetection = false;
export const defaultLocale = 'en-us';
export const publicPages = [
  '/',
  '/sign-in',
  '/sign-up',
  '/admin-portal',
  '/admin-api',
  '/mobile-app',
  '/blog',
  '/blog/(.*)',
  '/game',
  '/privacy-policy',
  '/terms-and-conditions',
];
export const locales = ['en-us', 'vi-vn'] as const;
export const localePrefix = { mode: 'as-needed' } satisfies LocalePrefix<typeof locales>;
export const pathnames = {
  '/': '/',
  '/sign-in': '/sign-in',
  '/sign-up': '/sign-up',
  '/blog': '/blog',
  '/blog/[slug]': '/blog/[slug]',
  '/admin-portal': '/admin-portal',
  '/admin-api': '/admin-api',
  '/mobile-app': '/mobile-app',
  '/game': '/game',
  '/privacy-policy': '/privacy-policy',
  '/terms-and-conditions': '/terms-and-conditions',
} satisfies Pathnames<typeof locales>;
