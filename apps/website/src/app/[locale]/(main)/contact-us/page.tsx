import { Metadata } from 'next';

import { PageBaseProps } from '@/interfaces/page.interface';

import ContactRoot from '@/modules/contacts/components/contact-root';

export default async function PageContactUs(_pageProps: PageBaseProps) {
  return (
    <div className="grow">
      <ContactRoot />
    </div>
  );
}

export async function generateMetadata({ params: { locale } }: PageBaseProps): Promise<Metadata> {
  return {
    title: 'Contact',
    description: 'Contact Description',
    alternates: {
      canonical: `/${locale}/contact`,
    },
  };
}
