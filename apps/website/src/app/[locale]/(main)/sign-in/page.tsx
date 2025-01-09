import { Metadata } from 'next';

import { LayoutProps } from '@/interfaces/layout.interface';
import { PageBaseProps } from '@/interfaces/page.interface';

import FormSignIn from '@/modules/auth/components/form-sign-in';

export default async function PageSignIn(_pageProps: PageBaseProps) {
  return (
    <div className="relative grow">
      <FormSignIn />
    </div>
  );
}

export async function generateMetadata({ params: { locale } }: LayoutProps): Promise<Metadata> {
  return {
    title: 'Sign In',
    description: 'Sign In Description',
    alternates: {
      canonical: `/${locale}/sign-in`,
    },
  };
}
