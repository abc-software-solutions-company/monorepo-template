import { Metadata } from 'next';

import { PageBaseProps } from '@/interfaces/page.interface';

import HomeRoot from '@/modules/home/components/home-root';

export default async function HomePage(_pageProps: PageBaseProps) {
  return (
    <div className="grow">
      <HomeRoot />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Home Page',
    description: 'Home Page Description',
    alternates: {
      canonical: '/',
    },
  };
}
