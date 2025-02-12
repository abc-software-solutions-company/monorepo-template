import { LocalePrefix, Pathnames } from 'next-intl/routing';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';

export const localeDetection = false;
export const defaultLocale = LANGUAGES.find(x => x.isDefault)?.code ?? 'en-us';
export const publicPages = [
  '/',
  '/sign-in',
  '/sign-up',
  '/admin-portal',
  '/admin-api',
  '/mobile-app',
  '/blog',
  '/blog/category/(.*)',
  '/blog/(.*)',
  '/product',
  '/product/(.*)',
  '/game',
  '/privacy-policy',
  '/terms-and-conditions',
  '/about-us',
  '/contact-us',
];
export const locales = LANGUAGES.map(x => x.code);
export const localePrefix = { mode: 'as-needed' } satisfies LocalePrefix<typeof locales>;
export const pathnames = {
  '/': '/',
  '/sign-in': '/sign-in',
  '/sign-up': '/sign-up',
  '/blog': '/blog',
  '/blog/category/[slug]': '/blog/category/[slug]',
  '/blog/[slug]': '/blog/[slug]',
  '/product': '/product',
  '/product/[slug]': '/product/[slug]',
  '/admin-portal': '/admin-portal',
  '/admin-api': '/admin-api',
  '/mobile-app': '/mobile-app',
  '/game': '/game',
  '/privacy-policy': '/privacy-policy',
  '/terms-and-conditions': '/terms-and-conditions',
  '/about-us': '/about-us',
  '/contact-us': '/contact-us',
} satisfies Pathnames<typeof locales>;
