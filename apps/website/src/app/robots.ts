import { MetadataRoute } from 'next';

import { WEBSITE_URL } from '@/constants/site.constant';

const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: isProduction ? '/' : '',
        disallow: isProduction ? ['/private/', '/protected/', '/admin/'] : ['/'],
      },
    ],
    host: WEBSITE_URL,
    sitemap: isProduction ? [`${WEBSITE_URL}/sitemap.xml`, `${WEBSITE_URL}/sitemap-0.xml`, `${WEBSITE_URL}/sitemap-1.xml`] : [],
  };
}
