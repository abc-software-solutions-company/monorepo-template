import React from 'react';
import { Metadata } from 'next';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';
import { stripHTML } from '@repo/shared-universal/utils/string.util';

import { PageBaseProps } from '@/interfaces/page.interface';

import { WEBSITE_OG_IMAGE } from '@/constants/site.constant';

import PostApi from '@/modules/posts/api/posts.api';
import BlogDetail from '@/modules/posts/components/blog-detail';

type PageProps = {
  params: {
    locale: string;
    slug: string;
  };
} & PageBaseProps;

export default async function PostDetailPage(pageProps: PageProps) {
  const response = await PostApi.getServerPost(pageProps.params.slug);

  return (
    <div className="grow">
      <div className="container">
        <BlogDetail item={response.data} />
      </div>
    </div>
  );
}

// export async function generateStaticParams() {
//   const postsResponse = await PostApi.getServerPosts({ page: 1, limit: 30 });

//   return postsResponse.data.map(post => ({ slug: post.slug }));
// }

// export async function generateMetadata({ params: { locale, slug } }: PageProps): Promise<Metadata> {
//   const response = await PostApi.getServerPost(slug);

//   const defaultLanguage = LANGUAGES.find(x => x.isDefault)?.code;
//   const title = response.data.nameLocalized?.find(x => x.lang === locale)?.value ?? '';
//   const description = response.data.descriptionLocalized?.find(x => x.lang === locale)?.value ?? '';
//   const image = response.data.coverLocalized?.find(x => x.lang === locale)?.value ?? '';
//   const creator = response.data.creator.name;
//   const createdAt = response.data.createdAt.toString();

//   const seoTitle = response.data.seoMeta?.titleLocalized?.find(x => x.lang === locale)?.value ?? title;
//   const seoDescription = response.data.seoMeta?.descriptionLocalized?.find(x => x.lang === locale)?.value ?? stripHTML(description);
//   const keywords = response.data.seoMeta?.keywords ?? '';

//   const ogImage = image ? `${process.env.NEXT_PUBLIC_API_URL}/${image}` : WEBSITE_OG_IMAGE;
//   const languages = LANGUAGES.reduce(
//     (acc, lang) => {
//       acc[lang.code] = lang.code === defaultLanguage ? `/blog/${slug}` : `/${lang.code}/blog/${slug}`;

//       return acc;
//     },
//     {} as Record<string, string>
//   );

//   return {
//     title: seoTitle,
//     description: seoDescription,
//     keywords: keywords.split(', '),
//     creator,
//     authors: { name: creator },
//     openGraph: {
//       title: seoTitle,
//       description: seoDescription,
//       images: [{ url: ogImage, alt: seoTitle }],
//       type: 'article',
//       publishedTime: createdAt,
//       authors: [creator],
//     },
//     twitter: { title: seoTitle, description: seoDescription, images: { url: ogImage, alt: seoTitle } },
//     alternates: {
//       canonical: locale === defaultLanguage ? `/blog/${slug}` : `/${locale}/blog/${slug}`,
//       languages,
//     },
//   };
// }
